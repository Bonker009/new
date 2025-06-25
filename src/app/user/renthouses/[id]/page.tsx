'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import {
  ArrowLeft, MapPin, Heart, DollarSign, Building, Loader2, BedDouble, CheckCircle,
  Building2, Users, Wifi, Wind, Tv, ParkingSquare
} from 'lucide-react';
import Link from 'next/link';
import { userService } from '@/services/user';
import { useApi, useApiMutation } from '@/hooks/useApi';
import { RenthouseDto, RoomDto } from '@/types/property';
import { toast } from 'sonner';
import Image from 'next/image';
import { useAuthStore } from '@/store/auth';
import { getImageUrl } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function RenthouseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const propertyId = parseInt(params.id as string);
  const { user } = useAuthStore();

  const { data: property, loading, error, refetch } = useApi(
    () => userService.getRenthouseDetails(propertyId),
    { autoFetch: true }
  );
  
  const bookRoomMutation = useApiMutation(userService.bookRoom);

  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [bookingRoom, setBookingRoom] = useState<RoomDto | null>(null);
  const [isBookingSuccess, setIsBookingSuccess] = useState(false);

  const userHasBookedRoom = property?.floors
    ?.flatMap(floor => floor.rooms)
    .some(room => room.renterId === user?.id);

  useEffect(() => {
    if (property) {
      const checkFavorite = async () => {
        setFavoriteLoading(true);
        try {
          const res = await userService.checkRenthouseInFavorites(property.id);
          if (res.success) setIsFavorite(res.data);
        } finally {
          setFavoriteLoading(false);
        }
      };
      checkFavorite();
    }
  }, [property]);

  const availableRooms = property?.floors?.flatMap(floor =>
    floor.rooms?.filter(room => !room.isOccupied) || []
  ) || [];

  const toggleFavorite = async () => {
    if (!property) return;
    setFavoriteLoading(true);
    try {
      if (isFavorite) {
        const res = await userService.removeRenthouseFromFavorites(property.id);
        if (res.success) {
          setIsFavorite(false);
          toast.success('Removed from favorites');
        } else {
          toast.error(res.message || 'Failed to remove from favorites');
        }
      } else {
        const res = await userService.addRenthouseToFavorites(property.id);
        if (res.success) {
          setIsFavorite(true);
          toast.success('Added to favorites');
        } else {
          toast.error(res.message || 'Failed to add to favorites');
        }
      }
    } catch (error) {
      toast.error('Failed to update favorites');
    } finally {
      setFavoriteLoading(false);
    }
  };

  const handleBookNowClick = (room: RoomDto) => {
    setBookingRoom(room);
  };

  const confirmBooking = async () => {
    if (!bookingRoom) return;
    try {
      await bookRoomMutation.mutate(bookingRoom.id);
      setIsBookingSuccess(true);
      refetch(); // Refresh data to show room as occupied
    } catch (error) {
      toast.error('Failed to book room. It may have been taken.');
      setBookingRoom(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <h2 className="text-xl font-semibold">Loading Property...</h2>
          <p className="text-muted-foreground">Please wait while we fetch the details.</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="text-center p-8 bg-card rounded-lg shadow-sm">
          <Building className="h-16 w-16 text-destructive mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">Oops! Property Not Found</h3>
          <p className="text-muted-foreground mb-6">The property you are looking for might have been removed or is unavailable.</p>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
          </Button>
        </div>
      </div>
    );
  }

  const renderAmenityIcon = (amenity: string) => {
    const lowerAmenity = amenity.toLowerCase();
    if (lowerAmenity.includes('wifi')) return <Wifi className="h-4 w-4 mr-2" />;
    if (lowerAmenity.includes('air conditioning')) return <Wind className="h-4 w-4 mr-2" />;
    if (lowerAmenity.includes('tv')) return <Tv className="h-4 w-4 mr-2" />;
    if (lowerAmenity.includes('parking')) return <ParkingSquare className="h-4 w-4 mr-2" />;
    return <CheckCircle className="h-4 w-4 mr-2" />;
  };

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Search
          </Button>
          
          <div className="flex flex-col md:flex-row justify-between items-start">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-2">{property.name}</h1>
              <p className="text-muted-foreground flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                {property.address}
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button
                variant={isFavorite ? "secondary" : "outline"}
                onClick={toggleFavorite}
                disabled={favoriteLoading}
                className="shrink-0"
              >
                <Heart className={`h-4 w-4 mr-2 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                {favoriteLoading ? 'Updating...' : isFavorite ? 'Favorited' : 'Add to Favorites'}
              </Button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="relative w-full h-96 overflow-hidden rounded-lg border">
              <Image
                src={getImageUrl(property.imageUrl)}
                alt={property.name}
                fill
                priority
                className="object-cover"
              />
            </div>

            <div>
              <h2 className="text-2xl font-bold border-b pb-2 mb-4">About this property</h2>
              <p className="text-muted-foreground">{property.description}</p>
            </div>

            {property.amenities && property.amenities.length > 0 && (
              <div>
                <h3 className="text-2xl font-bold border-b pb-2 mb-4">Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {property.amenities.map((amenity) => (
                    <div key={amenity} className="flex items-center text-muted-foreground">
                      {renderAmenityIcon(amenity)}
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Tabs defaultValue="available" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="available">Available Rooms</TabsTrigger>
                <TabsTrigger value="all">All Floors & Rooms</TabsTrigger>
              </TabsList>
              <TabsContent value="available" className="mt-6">
                {availableRooms.length === 0 ? (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center text-center py-16">
                      <BedDouble className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-semibold">No Rooms Available</h3>
                      <p className="text-muted-foreground">All rooms in this property are currently occupied.</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {availableRooms.map((room) => (
                      <Card key={room.id} className="flex flex-col md:flex-row items-center p-4 gap-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold mb-1">Room {room.roomNumber}</h3>
                          <p className="text-sm text-muted-foreground mb-2">Floor {room.floorNumber}</p>
                          <p className="text-muted-foreground text-sm mb-4">{room.description}</p>
                          <div className="flex items-center gap-4">
                              <Badge variant="outline" className="flex items-center"><DollarSign className="h-3 w-3 mr-1"/>{room.monthlyRent} / month</Badge>
                              <Badge variant="outline" className="flex items-center">Deposit: ${room.deposit}</Badge>
                          </div>
                        </div>
                        <div className="w-full md:w-auto">
                          <Button 
                            onClick={() => handleBookNowClick(room)} 
                            className="w-full"
                            disabled={bookRoomMutation.loading || userHasBookedRoom}
                          >
                            {userHasBookedRoom ? "You have a booking" : "Book Now"}
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
              <TabsContent value="all" className="mt-6">
                <div className="space-y-6">
                  {property.floors.map((floor) => (
                    <div key={floor.id}>
                      <h3 className="text-xl font-semibold mb-4">Floor {floor.floorNumber}</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        {floor.rooms.map((room) => (
                          <Card key={room.id} className={`${room.isOccupied ? 'bg-muted/50' : ''}`}>
                            <CardHeader>
                              <CardTitle>Room {room.roomNumber}</CardTitle>
                              <CardDescription>
                                {room.isOccupied
                                  ? <Badge variant="destructive">Occupied</Badge>
                                  : <Badge variant="success">Available</Badge>
                                }
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-muted-foreground mb-4">{room.description}</p>
                              <div className="font-semibold">${room.monthlyRent}/month</div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Property Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center"><Building2 className="h-4 w-4 mr-2"/> Type</span>
                    <span className="font-semibold">Apartment</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center"><BedDouble className="h-4 w-4 mr-2"/> Available Rooms</span>
                    <span className="font-semibold">{availableRooms.length}</span>
                  </div>
                   <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center"><Users className="h-4 w-4 mr-2"/> Total Rooms</span>
                    <span className="font-semibold">{property.floors.reduce((acc, f) => acc + f.rooms.length, 0)}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Owner Information</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarFallback>{property.ownerName?.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{property.ownerName}</p>
                    <p className="text-sm text-muted-foreground">Property Owner</p>
                  </div>
                </CardContent>
                <CardFooter>
                    <Button className="w-full">Contact Owner</Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={!!bookingRoom} onOpenChange={(open) => !open && setBookingRoom(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Booking</DialogTitle>
            <DialogDescription>
              You are about to book Room {bookingRoom?.roomNumber} at {property.name}.
              A deposit of ${bookingRoom?.deposit} is required.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBookingRoom(null)}>Cancel</Button>
            <Button onClick={confirmBooking} disabled={bookRoomMutation.loading}>
              {bookRoomMutation.loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirm Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isBookingSuccess} onOpenChange={setIsBookingSuccess}>
        <DialogContent>
          <DialogHeader className="items-center text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
            <DialogTitle className="text-2xl">Booking Successful!</DialogTitle>
            <DialogDescription>
              You have successfully booked Room {bookingRoom?.roomNumber}. 
              The owner will contact you shortly with the next steps.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="justify-center">
            <Button onClick={() => {
              setIsBookingSuccess(false);
              setBookingRoom(null);
              router.push('/user/bookings');
            }}>
              View My Bookings
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}