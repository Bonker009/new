'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Loader2, MapPin, Trash2, Star, Users, Search, Home } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { userService } from '@/services/user';
import { RenthouseDto, RoomDto } from '@/types/property';
import { toast } from 'sonner';
import { getImageUrl } from '@/lib/utils';

interface FavoriteRenthouse extends RenthouseDto {
  favoriteRoomId?: number;
  isFavorite: boolean;
}

export default function FavoritesPage() {
  const [favoriteRenthouses, setFavoriteRenthouses] = useState<FavoriteRenthouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removingFavorites, setRemovingFavorites] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    fetchFavoriteRenthouses();
  }, []);

  const fetchFavoriteRenthouses = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get all favorite rooms
      const favoritesResponse = await userService.getFavorites();
      if (!favoritesResponse.success) {
        throw new Error(favoritesResponse.message || 'Failed to fetch favorites');
      }

      const favoriteRooms = favoritesResponse.data || [];

      if (favoriteRooms.length === 0) {
        setFavoriteRenthouses([]);
        return;
      }

      // Group rooms by renthouse and get renthouse details
      const renthouseIds = [...new Set(favoriteRooms.map(room => room.renthouseId))];
      const renthousesData: FavoriteRenthouse[] = [];

      for (const renthouseId of renthouseIds) {
        try {
          const renthouseResponse = await userService.getRenthouseDetails(renthouseId!);
          if (renthouseResponse.success) {
            const renthouse = renthouseResponse.data;
            const favoriteRoomsInRenthouse = favoriteRooms.filter(room => room.renthouseId === renthouseId);

            renthousesData.push({
              ...renthouse,
              favoriteRoomId: favoriteRoomsInRenthouse[0]?.id,
              isFavorite: true
            });
          }
        } catch (err) {
          console.error(`Failed to fetch renthouse ${renthouseId}:`, err);
        }
      }

      setFavoriteRenthouses(renthousesData);
    } catch (err) {
      console.error('Error fetching favorite renthouses:', err);
      setError('Failed to load favorites');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (renthouseId: number) => {
    try {
      setRemovingFavorites(prev => ({ ...prev, [renthouseId]: true }));

      const response = await userService.removeRenthouseFromFavorites(renthouseId);
      if (response.success) {
        setFavoriteRenthouses(prev => prev.filter(r => r.id !== renthouseId));
        toast.success('Removed from favorites');
      } else {
        toast.error(response.message || 'Failed to remove from favorites');
      }
    } catch (err) {
      console.error('Error removing favorite:', err);
      toast.error('Failed to remove from favorites');
    } finally {
      setRemovingFavorites(prev => ({ ...prev, [renthouseId]: false }));
    }
  };

  const handleToggleFavorite = async (renthouseId: number) => {
    try {
      setRemovingFavorites(prev => ({ ...prev, [renthouseId]: true }));

      const response = await userService.removeRenthouseFromFavorites(renthouseId);
      if (response.success) {
        setFavoriteRenthouses(prev => prev.filter(r => r.id !== renthouseId));
        toast.success('Removed from favorites');
      } else {
        toast.error(response.message || 'Failed to remove from favorites');
      }
    } catch (err) {
      console.error('Error removing favorite:', err);
      toast.error('Failed to remove from favorites');
    } finally {
      setRemovingFavorites(prev => ({ ...prev, [renthouseId]: false }));
    }
  };

  // Helper function to get available rooms count
  const getAvailableRoomsCount = (renthouse: FavoriteRenthouse) => {
    let available = 0;
    let total = 0;

    renthouse.floors?.forEach(floor => {
      floor.rooms?.forEach(room => {
        total++;
        if (room.status === 'AVAILABLE') {
          available++;
        }
      });
    });

    return { available, total };
  };

  // Helper function to get amenities
  const getAmenities = (renthouse: FavoriteRenthouse) => {
    return ['WiFi', 'Parking', 'Security'];
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Favorites</h1>
          <p className="text-muted-foreground">
            Properties you've saved for later
          </p>
        </div>
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
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Favorites</h1>
          <p className="text-muted-foreground">
            Properties you've saved for later
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-sm">
            {favoriteRenthouses.length} {favoriteRenthouses.length === 1 ? 'property' : 'properties'}
          </Badge>
        </div>
      </div>

      {error ? (
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={fetchFavoriteRenthouses}>
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : favoriteRenthouses.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Heart className="mr-2 h-5 w-5" />
              Saved Properties
            </CardTitle>
            <CardDescription>
              Properties you've bookmarked
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <Heart className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No favorites yet</h3>
              <p className="text-muted-foreground mt-2 mb-4">
                Start exploring properties and save your favorites here
              </p>
              <div className="flex gap-2 justify-center">
                <Link href="/search">
                  <Button>
                    <Search className="mr-2 h-4 w-4" />
                    Browse Properties
                  </Button>
                </Link>
                <Link href="/user/dashboard">
                  <Button variant="outline">
                    <Home className="mr-2 h-4 w-4" />
                    Go to Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {favoriteRenthouses.map((renthouse) => {
            const { available, total } = getAvailableRoomsCount(renthouse);
            const amenities = getAmenities(renthouse);
            const isLoading = removingFavorites[renthouse.id] || false;

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
                      className="h-8 w-8 p-0 bg-red-500/80 hover:bg-red-500 text-white transition-all duration-200"
                      onClick={() => handleToggleFavorite(renthouse.id)}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Heart className="h-4 w-4 fill-current" />
                      )}
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
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveFavorite(renthouse.id)}
                      disabled={isLoading}
                      className="border-red-500 text-red-500 hover:bg-red-50"
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}