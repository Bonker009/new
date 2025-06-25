'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, MapPin, Search, CreditCard, Star, Users, Home, DollarSign, Package } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { userService } from '@/services/user';
import { RenthouseDto, RoomDto, PaymentDto } from '@/types/property';
import { toast } from 'sonner';
import { getImageUrl } from '@/lib/utils';
import { PendingPayments } from '@/components/ui/pending-payments';

export default function UserDashboard() {
  const [featuredRenthouses, setFeaturedRenthouses] = useState<RenthouseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favoriteStates, setFavoriteStates] = useState<{ [key: number]: boolean }>({});
  const [favoriteLoading, setFavoriteLoading] = useState<{ [key: number]: boolean }>({});
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [activeBooking, setActiveBooking] = useState<RoomDto | null>(null);
  const [pendingPaymentCount, setPendingPaymentCount] = useState(0);
  const [pendingPayments, setPendingPayments] = useState<PaymentDto[]>([]);
  const [paymentsLoading, setPaymentsLoading] = useState(true);
  const [paymentsError, setPaymentsError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [featuredResponse, favoritesResponse, bookingResponse, pendingPaymentsResponse] = await Promise.all([
          userService.getFeaturedRenthouses(),
          userService.getFavorites(),
          userService.getCurrentBooking(),
          userService.getPendingPayments(),
        ]);

        const favoriteRooms = favoritesResponse.success ? favoritesResponse.data || [] : [];
        const favoriteRenthouseIds = new Set(favoriteRooms.map(room => room.renthouseId));
        setFavoriteCount(favoriteRenthouseIds.size);

        if (featuredResponse.success) {
          const renthouses = featuredResponse.data || [];
          setFeaturedRenthouses(renthouses);
          
          const favoriteStatesMap: { [key: number]: boolean } = {};
          renthouses.forEach(renthouse => {
            favoriteStatesMap[renthouse.id] = favoriteRenthouseIds.has(renthouse.id);
          });
          setFavoriteStates(favoriteStatesMap);
        } else {
          setError(featuredResponse.message || 'Failed to fetch featured properties');
        }

        if (bookingResponse.success) {
          setActiveBooking(bookingResponse.data);
        }

        if (pendingPaymentsResponse.success) {
          const pendingPaymentsData = pendingPaymentsResponse.data || [];
          console.log('DEBUG: Dashboard received pending payments:', pendingPaymentsData);
          console.log('DEBUG: Pending payments count:', pendingPaymentsData.length);
          setPendingPayments(pendingPaymentsData);
          setPendingPaymentCount(pendingPaymentsData.length);
          setPaymentsError(null);
        } else {
          console.log('DEBUG: Failed to get pending payments:', pendingPaymentsResponse.message);
          setPaymentsError(pendingPaymentsResponse.message || 'Failed to load pending payments');
        }
      } catch (err) {
        setError('Failed to fetch dashboard data');
        setPaymentsError('Failed to fetch pending payments');
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
        setPaymentsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const refreshPendingPayments = async () => {
    try {
      setPaymentsLoading(true);
      setPaymentsError(null);
      console.log('DEBUG: Refreshing pending payments...');
      const response = await userService.getPendingPayments();
      console.log('DEBUG: Refresh response:', response);
      if (response.success) {
        const pendingPaymentsData = response.data || [];
        console.log('DEBUG: Refresh received pending payments:', pendingPaymentsData);
        setPendingPayments(pendingPaymentsData);
        setPendingPaymentCount(pendingPaymentsData.length);
      } else {
        console.log('DEBUG: Refresh failed:', response.message);
        setPaymentsError(response.message || 'Failed to load pending payments');
      }
    } catch (err) {
      console.log('DEBUG: Refresh error:', err);
      setPaymentsError('Failed to refresh pending payments');
      console.error('Error refreshing pending payments:', err);
    } finally {
      setPaymentsLoading(false);
    }
  };

  const handleFavoriteToggle = async (renthouseId: number) => {
    try {
      setFavoriteLoading(prev => ({ ...prev, [renthouseId]: true }));
      
      const isCurrentlyFavorite = favoriteStates[renthouseId];
      
      if (isCurrentlyFavorite) {
        const response = await userService.removeRenthouseFromFavorites(renthouseId);
        if (response.success) {
          setFavoriteStates(prev => ({ ...prev, [renthouseId]: false }));
          setFavoriteCount(prev => Math.max(0, prev - 1));
          toast.success('Removed from favorites');
        } else {
          toast.error(response.message || 'Failed to remove from favorites');
        }
      } else {
        const response = await userService.addRenthouseToFavorites(renthouseId);
        if (response.success) {
          setFavoriteStates(prev => ({ ...prev, [renthouseId]: true }));
          setFavoriteCount(prev => prev + 1);
          toast.success('Added to favorites');
        } else {
          toast.error(response.message || 'Failed to add to favorites');
        }
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
      toast.error('Failed to update favorites');
    } finally {
      setFavoriteLoading(prev => ({ ...prev, [renthouseId]: false }));
    }
  };

  // Helper function to get available rooms count
  const getAvailableRoomsCount = (renthouse: RenthouseDto) => {
    let available = 0;
    let total = 0;
    
    renthouse.floors?.forEach(floor => {
      floor.rooms?.forEach((room: RoomDto) => {
        total++;
        if (room.status === 'AVAILABLE') {
          available++;
        }
      });
    });
    
    return { available, total };
  };

  // Helper function to get amenities (placeholder for now)
  const getAmenities = (renthouse: RenthouseDto) => {
    // This would come from the backend, for now using placeholder
    return ['WiFi', 'Parking', 'Security'];
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Find your perfect rental home.
        </p>
      </div>

      {/* Top summary cards grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        <Link href="/user/bookings" className="block h-full">
          <Card className="hover:bg-muted/50 transition-colors h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 flex-shrink-0">
              <CardTitle className="text-sm font-medium">
                Current Booking
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            {activeBooking ? (
              <>
                <CardContent className="flex-1 flex flex-col justify-center">
                  <div className="text-2xl font-bold truncate">
                    {activeBooking.renthouseName}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Room {activeBooking.roomNumber}
                  </p>
                </CardContent>
              </>
            ) : (
              <CardContent className="flex-1 flex flex-col justify-center">
                <div className="text-2xl font-bold">No Active Booking</div>
                <p className="text-xs text-muted-foreground">
                  You have no active bookings.
                </p>
              </CardContent>
            )}
          </Card>
        </Link>
        <Link href="/user/favorites" className="block h-full">
          <Card className="hover:bg-muted/50 transition-colors h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 flex-shrink-0">
              <CardTitle className="text-sm font-medium">Favorites</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-center">
              <div className="text-2xl font-bold">{favoriteCount}</div>
              <p className="text-xs text-muted-foreground">
                Your saved properties
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Quick Actions & Pending Payments grid */}
      <div className="grid gap-6 lg:grid-cols-1 w-full">
        <Card className="h-full flex flex-col justify-between">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks to get you started
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Link href="/search">
              <Button className="w-full justify-start">
                <Search className="mr-2 h-4 w-4" />
                Search Properties
              </Button>
            </Link>
            <Link href="/user/favorites">
              <Button variant="outline" className="w-full justify-start">
                <Heart className="mr-2 h-4 w-4" />
                View Favorites
              </Button>
            </Link>
            <Link href="/user/payments">
              <Button variant="outline" className="w-full justify-start">
                <CreditCard className="mr-2 h-4 w-4" />
                Payment History
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Featured Renthouses Section */}
      <Card className="mt-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Featured Properties</CardTitle>
              <CardDescription>
                Discover amazing rental properties near you
              </CardDescription>
            </div>
            <Link href="/search">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="h-48 bg-gray-200 animate-pulse" />
                  <CardContent className="p-4 space-y-2">
                    <div className="h-4 bg-gray-200 rounded animate-pulse" />
                    <div className="h-3 bg-gray-200 rounded animate-pulse" />
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">{error}</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => window.location.reload()}
              >
                Try Again
              </Button>
            </div>
          ) : featuredRenthouses.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No featured properties available</p>
              <p className="text-sm text-muted-foreground mt-2">
                Check back later for new listings
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featuredRenthouses.map((renthouse) => {
                const { available, total } = getAvailableRoomsCount(renthouse);
                const amenities = getAmenities(renthouse);
                const isFavorite = favoriteStates[renthouse.id] || false;
                const isLoading = favoriteLoading[renthouse.id] || false;
                
                return (
                  <Card key={renthouse.id} className="overflow-hidden hover:shadow-lg transition-shadow p-0 h-full flex flex-col">
                    <div className="relative h-48 w-full flex-shrink-0">
                      <Image
                        src={getImageUrl(renthouse.imageUrl)}
                        alt={renthouse.name}
                        fill
                        className="object-cover transition-transform duration-300 hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute top-2 right-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`h-8 w-8 p-0 transition-all duration-200 ${
                            isFavorite 
                              ? 'bg-red-500/80 hover:bg-red-500 text-white' 
                              : 'bg-white/80 hover:bg-white'
                          }`}
                          onClick={() => handleFavoriteToggle(renthouse.id)}
                          disabled={isLoading}
                        >
                          <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
                        </Button>
                      </div>
                      <div className="absolute bottom-2 left-2">
                        <Badge variant="secondary" className="bg-white/90 text-black">
                          <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                          4.5
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-4 flex-1 flex flex-col">
                      <div className="space-y-2 flex-1">
                        <div>
                          <h3 className="font-semibold text-lg line-clamp-1">{renthouse.name}</h3>
                          <p className="text-sm text-muted-foreground flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {renthouse.address || 'Address not available'}
                          </p>
                        </div>
                        
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {renthouse.description || 'No description available'}
                        </p>
                        
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center text-muted-foreground">
                            <Users className="h-3 w-3 mr-1" />
                            {available}/{total} available
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">${renthouse.baseRent || 0}/month</div>
                            <div className="text-xs text-muted-foreground">
                              + ${renthouse.waterFee || 0} water + ${renthouse.electricityFee || 0} electricity
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-1 mt-2">
                          {amenities.slice(0, 3).map((amenity, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {amenity}
                            </Badge>
                          ))}
                          {amenities.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{amenities.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex gap-2 mt-4 pt-2">
                        <Link href={`/user/renthouses/${renthouse.id}`} className="flex-1">
                          <Button className="w-full" size="sm">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}