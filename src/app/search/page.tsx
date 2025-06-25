'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, MapPin, Heart, Star, Users, Loader2, Home, X, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { userService } from '@/services/user';
import { RenthouseDto, RoomDto } from '@/types/property';
import { toast } from 'sonner';
import Image from 'next/image';
import { getImageUrl } from '@/lib/utils';

export default function SearchPage() {
  const router = useRouter();
  const [allRenthouses, setAllRenthouses] = useState<RenthouseDto[]>([]);
  const [filteredRenthouses, setFilteredRenthouses] = useState<RenthouseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  
  const [favoriteStates, setFavoriteStates] = useState<{ [key: number]: boolean }>({});
  const [favoriteLoading, setFavoriteLoading] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    fetchAllRenthouses();
  }, []);
  
  const fetchAllRenthouses = async () => {
    try {
      setLoading(true);
      setError(null);
      const [renthousesResponse, favoritesResponse] = await Promise.all([
        userService.searchRenthouses({}),
        userService.getFavorites(),
      ]);

      if (!renthousesResponse.success) {
        throw new Error(renthousesResponse.message || 'Failed to fetch properties');
      }

      const renthouses = renthousesResponse.data || [];
      setAllRenthouses(renthouses);
      setFilteredRenthouses(renthouses);

      const favoriteRooms = favoritesResponse.success ? favoritesResponse.data || [] : [];
      const favoriteRenthouseIds = new Set(favoriteRooms.map((room: RoomDto) => room.renthouseId));
      const favoriteStatesMap: { [key: number]: boolean } = {};
      renthouses.forEach((renthouse: RenthouseDto) => {
        favoriteStatesMap[renthouse.id] = favoriteRenthouseIds.has(renthouse.id);
      });
      setFavoriteStates(favoriteStatesMap);
      
    } catch (err) {
      console.error('Failed to load properties:', err);
      setError('Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let results = allRenthouses;

    if (searchQuery) {
      results = results.filter(r => r.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    if (locationQuery) {
      results = results.filter(r => r.address && r.address.toLowerCase().includes(locationQuery.toLowerCase()));
    }

    if (priceRange) {
      const [minStr, maxStr] = priceRange.split('-');
      const min = minStr !== 'undefined' ? parseInt(minStr, 10) : undefined;
      const max = maxStr !== 'undefined' ? parseInt(maxStr, 10) : undefined;
      
      results = results.filter(r => {
        if (r.baseRent == null) return false;
        if (min !== undefined && r.baseRent < min) return false;
        if (max !== undefined && r.baseRent > max) return false;
        return true;
      });
    }

    setFilteredRenthouses(results);
  }, [searchQuery, locationQuery, priceRange, allRenthouses]);

  const handleFavoriteToggle = async (renthouseId: number) => {
    setFavoriteLoading(prev => ({ ...prev, [renthouseId]: true }));
    const isCurrentlyFavorite = favoriteStates[renthouseId];
    
    try {
      if (isCurrentlyFavorite) {
        const response = await userService.removeRenthouseFromFavorites(renthouseId);
        if (response.success) {
          setFavoriteStates(prev => ({ ...prev, [renthouseId]: false }));
          toast.success('Removed from favorites');
        } else {
          toast.error(response.message || 'Failed to remove from favorites');
        }
      } else {
        const response = await userService.addRenthouseToFavorites(renthouseId);
        if (response.success) {
          setFavoriteStates(prev => ({ ...prev, [renthouseId]: true }));
          toast.success('Added to favorites');
        } else {
          toast.error(response.message || 'Failed to add to favorites');
        }
      }
    } catch (err) {
      toast.error('Failed to update favorites');
    } finally {
      setFavoriteLoading(prev => ({ ...prev, [renthouseId]: false }));
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setLocationQuery('');
    setPriceRange('');
  };
  
  const getAvailableRoomsCount = (renthouse: RenthouseDto) => {
    let available = 0;
    let total = 0;
    renthouse.floors?.forEach(floor => {
      floor.rooms?.forEach(room => {
        total++;
        if (room.status === 'AVAILABLE') available++;
      });
    });
    return { available, total };
  };

  const getAmenities = (renthouse: RenthouseDto) => {
    return ['WiFi', 'Parking', 'Security'];
  };

  const hasActiveFilters = searchQuery || locationQuery || priceRange;

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.back()}
        className="flex items-center gap-2 mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>
      
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Find Your Perfect Home</h1>
        <p className="text-muted-foreground">
          Search through all available rental properties.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <Search className="mr-2 h-5 w-5" />
            Search Filters
          </CardTitle>
          <CardDescription>
            Find your perfect rental property with our advanced search options
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Property Name</label>
              <Input
                placeholder="Search by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Location</label>
              <Input
                placeholder="Filter by location/address..."
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Price Range</label>
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select price range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-500">$0 - $500</SelectItem>
                  <SelectItem value="500-800">$500 - $800</SelectItem>
                  <SelectItem value="800-1200">$800 - $1200</SelectItem>
                  <SelectItem value="1200-undefined">$1200+</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {hasActiveFilters && (
            <div className="flex items-center justify-between pt-2 border-t">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Active filters:</span>
                <div className="flex gap-1">
                  {searchQuery && (
                    <Badge variant="secondary" className="text-xs">
                      Name: {searchQuery}
                    </Badge>
                  )}
                  {locationQuery && (
                    <Badge variant="secondary" className="text-xs">
                      Location: {locationQuery}
                    </Badge>
                  )}
                  {priceRange && (
                    <Badge variant="secondary" className="text-xs">
                      Price: ${priceRange.replace('-', ' - $').replace('undefined', '+')}
                    </Badge>
                  )}
                </div>
              </div>
              <Button 
                onClick={clearFilters}
                variant="outline"
                size="sm"
              >
                <X className="mr-2 h-4 w-4" />
                Clear All
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {hasActiveFilters ? 'Filtered Results' : 'All Properties'}
          </h2>
          <Badge variant="secondary">
            {loading ? '...' : filteredRenthouses.length} properties found
          </Badge>
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
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
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={fetchAllRenthouses}>Try Again</Button>
            </CardContent>
          </Card>
        ) : filteredRenthouses.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Properties Found</h3>
              <p className="text-gray-600 mb-6">
                No properties match your current filters. Try clearing them to see all properties.
              </p>
              <div className="flex gap-2 justify-center">
                <Button onClick={clearFilters}>
                  <X className="mr-2 h-4 w-4" /> Clear Filters
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => router.push('/user/dashboard')}
                >
                  <Home className="mr-2 h-4 w-4" /> Go to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredRenthouses.map((renthouse) => {
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
                      <Button 
                        className="w-full" 
                        size="sm"
                        onClick={() => router.push(`/user/renthouses/${renthouse.id}`)}
                      >
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}