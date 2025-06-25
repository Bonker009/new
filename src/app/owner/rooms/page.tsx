'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { DoorOpen, Search, Edit, Eye, Loader2, Building, Users } from 'lucide-react';
import { useApi, useApiMutation } from '@/hooks/useApi';
import { ownerService } from '@/services/owner';
import { RoomDto } from '@/types/property';
import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

// Validation schema for room editing
const editRoomSchema = z.object({
  roomNumber: z.string().min(1, "Room number is required"),
  description: z.string().min(1, "Description is required"),
  monthlyRent: z.number({ required_error: "Monthly rent is required" }).min(1, "Monthly rent must be greater than 0"),
  deposit: z.number({ required_error: "Security deposit is required" }).min(1, "Security deposit must be greater than 0"),
});

type EditRoomFormData = z.infer<typeof editRoomSchema>;

export default function RoomsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedRoomForEdit, setSelectedRoomForEdit] = useState<RoomDto | null>(null);
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);

  const { data: rooms, loading, error, refetch } = useApi(
    () => ownerService.getAllRooms(),
    { autoFetch: true }
  );

  const roomsList = rooms || [];

  // Form for editing room details
  const editRoomForm = useForm<EditRoomFormData>({
    resolver: zodResolver(editRoomSchema),
    defaultValues: {
      roomNumber: "",
      description: "",
      monthlyRent: undefined as any,
      deposit: undefined as any,
    },
  });

  // Filter rooms based on search term
  const filteredRooms = roomsList.filter((room: RoomDto) =>
    room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.renterFullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.renterUsername?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (isOccupied: boolean) => {
    return isOccupied ? (
      <Badge variant="destructive" className="text-red-600 bg-red-50 border-red-200">
        Occupied
      </Badge>
    ) : (
      <Badge variant="secondary" className="text-green-600 bg-green-50 border-green-200">
        Available
      </Badge>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const handleEditRoom = (room: RoomDto) => {
    setSelectedRoomForEdit(room);

    // Reset form first to ensure clean state
    editRoomForm.reset();

    // Populate the edit form with current room data
    editRoomForm.setValue("roomNumber", room.roomNumber);
    editRoomForm.setValue("description", room.description || "");
    editRoomForm.setValue("monthlyRent", room.monthlyRent || 0);
    editRoomForm.setValue("deposit", room.deposit || 0);

    setIsEditDialogOpen(true);
  };

  const onSubmitEditRoom = async (data: EditRoomFormData) => {
    try {
      setIsSubmittingEdit(true);

      if (!selectedRoomForEdit) {
        console.error("No room selected for editing");
        return;
      }

      const updateData = {
        roomNumber: data.roomNumber,
        description: data.description,
        monthlyRent: data.monthlyRent,
        deposit: data.deposit,
      };

      await ownerService.updateRoom(selectedRoomForEdit.id, updateData);

      // Reset form and close dialog
      editRoomForm.reset();
      setIsEditDialogOpen(false);
      setSelectedRoomForEdit(null);

      // Refresh data
      refetch();

      console.log("Room updated successfully!");
    } catch (error: any) {
      console.error("Error updating room:", error);
      console.error(`Failed to update room: ${error.response?.data?.message || error.message || 'Unknown error'}`);
    } finally {
      setIsSubmittingEdit(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Rooms</h1>
        <p className="text-muted-foreground">
          View and manage all your rental rooms
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <DoorOpen className="mr-2 h-5 w-5" />
                All Rooms
              </CardTitle>
              <CardDescription>
                Search and manage rooms across all properties
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search rooms..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading rooms...</span>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="text-red-800 font-medium">Error loading rooms</h3>
              <p className="text-red-600 text-sm mt-1">
                {error || "Failed to load rooms. Please try again."}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                className="mt-2"
              >
                Retry
              </Button>
            </div>
          )}

          {!loading && !error && filteredRooms.length === 0 && (
            <div className="text-center py-12">
              <DoorOpen className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">
                {searchTerm ? 'No rooms found' : 'No rooms yet'}
              </h3>
              <p className="text-muted-foreground mt-2">
                {searchTerm
                  ? 'Try adjusting your search terms'
                  : 'Add properties and floors to create rooms'
                }
              </p>
            </div>
          )}

          {!loading && !error && filteredRooms.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing {filteredRooms.length} of {roomsList.length} rooms
                </p>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Room Number</TableHead>
                    <TableHead>Property</TableHead>
                    <TableHead>Floor</TableHead>
                    <TableHead>Monthly Rent</TableHead>
                    <TableHead>Deposit</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Renter</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRooms.map((room: RoomDto) => (
                    <TableRow key={room.id}>
                      <TableCell className="font-medium">
                        {room.roomNumber}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                          {room.renthouseName || 'N/A'}
                        </div>
                      </TableCell>
                      <TableCell>Floor {room.floorNumber}</TableCell>
                      <TableCell>
                        {room.monthlyRent ? formatCurrency(room.monthlyRent) : 'N/A'}
                      </TableCell>
                      <TableCell>
                        {room.deposit ? formatCurrency(room.deposit) : 'N/A'}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(room.isOccupied)}
                      </TableCell>
                      <TableCell>
                        {room.isOccupied && room.renterFullName ? (
                          <div className="flex items-center">
                            {/* <Users className="h-4 w-4 mr-2 text-muted-foreground" /> */}
                            <div>
                              <p className="font-medium">{room.renterFullName}</p>
                              {room.moveInDate && (
                                <p className="text-xs text-blue-600">
                                  Moved in: {new Date(room.moveInDate).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">Vacant</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Link href={`/owner/room/${room.id}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditRoom(room)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Room Editing Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent key={selectedRoomForEdit?.id}>
          <DialogHeader>
            <DialogTitle>Edit Room Details</DialogTitle>
            <DialogDescription>
              Update the room information for Room {selectedRoomForEdit?.roomNumber}
            </DialogDescription>
          </DialogHeader>
          <Form {...editRoomForm}>
            <form onSubmit={editRoomForm.handleSubmit(onSubmitEditRoom)} className="space-y-4">
              <FormField
                control={editRoomForm.control}
                name="roomNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room Number</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter room number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editRoomForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter room description"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editRoomForm.control}
                name="monthlyRent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monthly Rent</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter monthly rent"
                        {...field}
                        value={field.value === undefined || field.value === 0 ? "" : field.value}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === "") {
                            field.onChange(undefined);
                          } else {
                            const numValue = Number(value);
                            field.onChange(numValue);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editRoomForm.control}
                name="deposit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Security Deposit</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter security deposit"
                        {...field}
                        value={field.value === undefined || field.value === 0 ? "" : field.value}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === "") {
                            field.onChange(undefined);
                          } else {
                            const numValue = Number(value);
                            field.onChange(numValue);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditDialogOpen(false);
                    setSelectedRoomForEdit(null);
                    editRoomForm.reset();
                  }}
                  disabled={isSubmittingEdit}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmittingEdit}>
                  {isSubmittingEdit ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Room"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}