'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Building, Plus, MapPin, Edit, Trash2, Eye, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useApi, useApiMutation } from '@/hooks/useApi';
import { ownerService } from '@/services/owner';

export default function RenthousesPage() {
  const { data: properties, loading, refetch } = useApi(
    () => ownerService.getRenthouses(),
    { autoFetch: true }
  );

  const deleteMutation = useApiMutation(ownerService.deleteRenthouse);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<any>(null);
  const [deletingPropertyId, setDeletingPropertyId] = useState<number | null>(null);

  const handleDeleteClick = (property: any) => {
    setPropertyToDelete(property);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!propertyToDelete) return;

    try {
      setDeletingPropertyId(propertyToDelete.id);
      await deleteMutation.mutate(propertyToDelete.id);
      refetch(); // Refresh the properties list
      setDeleteDialogOpen(false);
      setPropertyToDelete(null);
    } catch (error) {
      console.error('Failed to delete property:', error);
    } finally {
      setDeletingPropertyId(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setPropertyToDelete(null);
  };

  const getTotalRooms = (property: any) => {
    if (!property.floors) return 0;
    return property.floors.reduce((total: number, floor: any) => {
      return total + (floor.rooms?.length || 0);
    }, 0);
  };

  const getOccupiedRooms = (property: any) => {
    if (!property.floors) return 0;
    return property.floors.reduce((total: number, floor: any) => {
      return total + (floor.rooms?.filter((room: any) => room.isOccupied).length || 0);
    }, 0);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Properties</h1>
            <p className="text-muted-foreground">
              Manage your rental properties
            </p>
          </div>
          <Button asChild>
            <Link href="/owner/renthouses/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Property
            </Link>
          </Button>
        </div>
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading properties...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Properties</h1>
          <p className="text-muted-foreground">
            Manage your rental properties
          </p>
        </div>
        <Button asChild>
          <Link href="/owner/renthouses/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Property
          </Link>
        </Button>
      </div>

      {!properties || properties.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building className="mr-2 h-5 w-5" />
              Your Properties
            </CardTitle>
            <CardDescription>
              All properties you own and manage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <Building className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No properties yet</h3>
              <p className="text-muted-foreground mt-2 mb-4">
                Add your first property to start managing rentals
              </p>
              <Button asChild>
                <Link href="/owner/renthouses/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Property
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {properties.map((property) => {
            const totalRooms = getTotalRooms(property);
            const occupiedRooms = getOccupiedRooms(property);
            const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

            return (
              <Card key={property.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-semibold">{property.name}</h3>
                        <Badge variant="secondary">
                          {occupancyRate}% occupied
                        </Badge>
                      </div>

                      <p className="text-gray-600 flex items-center mb-2">
                        <MapPin className="h-4 w-4 mr-1" />
                        {property.address}
                      </p>

                      {property.description && (
                        <p className="text-gray-700 mb-4">{property.description}</p>
                      )}

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Total Rooms</p>
                          <p className="text-lg font-semibold">{totalRooms}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Occupied</p>
                          <p className="text-lg font-semibold">{occupiedRooms}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Base Rent</p>
                          <p className="text-lg font-semibold">
                            {property.baseRent ? `$${property.baseRent}` : 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="ml-6 flex flex-col gap-2">
                      <Link href={`/owner/renthouses/${property.id}`}>
                        <Button size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </Link>
                      <Link href={`/owner/renthouses/new?edit=${property.id}`}>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteClick(property)}
                        disabled={deletingPropertyId === property.id}
                        className="text-red-600 hover:text-red-700"
                      >
                        {deletingPropertyId === property.id ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <Trash2 className="h-4 w-4 mr-2" />
                        )}
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={handleDeleteCancel}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-red-600" />
              Confirm Delete
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>"{propertyToDelete?.name}"</strong>?
              <br />
              This action cannot be undone and will permanently remove the property and all associated data.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleDeleteCancel}
              disabled={deletingPropertyId !== null}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={deletingPropertyId !== null}
            >
              {deletingPropertyId !== null ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Property
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}