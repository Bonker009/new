"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  MapPin,
  Edit,
  Plus,
  DollarSign,
  Building,
  Users,
  TrendingUp,
  Loader2,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { useApi } from "@/hooks/useApi";
import { ownerService } from "@/services/owner";
import { RenthouseDto } from "@/types/property";

// Validation schema for floor creation
const createFloorSchema = z.object({
  floorNumber: z.number().min(1, "Floor number must be positive"),
});

// Validation schema for room creation
const createRoomSchema = z.object({
  roomNumber: z.string().min(1, "Room number is required"),
  description: z.string().min(1, "Description is required"),
  monthlyRent: z.number().min(1, "Monthly rent is required"),
  deposit: z.number().min(1, "Security deposit is required"),
});

// Validation schema for property editing
const editPropertySchema = z.object({
  name: z.string().min(1, "Property name is required"),
  address: z.string().min(1, "Address is required"),
  description: z.string().min(1, "Description is required"),
  baseRent: z.number().min(0, "Base rent is required"),
});

type CreateFloorFormData = z.infer<typeof createFloorSchema>;
type CreateRoomFormData = z.infer<typeof createRoomSchema>;
type EditPropertyFormData = z.infer<typeof editPropertySchema>;

// Type definitions for the property structure
interface Room {
  id: number;
  roomNumber: string;
  description: string;
  monthlyRent: number;
  deposit: number;
  isOccupied: boolean;
  renterUsername?: string;
  renterFullName?: string;
}

interface Floor {
  id: number;
  floorNumber: number;
  description: string;
  rooms: Room[];
}

interface Property {
  id: number;
  name: string;
  address: string;
  description: string;
  baseRent: number;
  imageUrl: string;
  floors: Floor[];
}

export default function OwnerRenthouseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [isCreateFloorDialogOpen, setIsCreateFloorDialogOpen] = useState(false);
  const [isCreateRoomDialogOpen, setIsCreateRoomDialogOpen] = useState(false);
  const [isEditPropertyDialogOpen, setIsEditPropertyDialogOpen] = useState(false);
  const [isEditRoomDialogOpen, setIsEditRoomDialogOpen] = useState(false);
  const [selectedFloorId, setSelectedFloorId] = useState<number | null>(null);
  const [selectedRoomForEdit, setSelectedRoomForEdit] = useState<Room | null>(null);
  const [isSubmittingFloor, setIsSubmittingFloor] = useState(false);
  const [isSubmittingRoom, setIsSubmittingRoom] = useState(false);
  const [isSubmittingProperty, setIsSubmittingProperty] = useState(false);
  const [isSubmittingRoomEdit, setIsSubmittingRoomEdit] = useState(false);

  // Fetch property data using API
  const { data: propertyData, loading, error, refetch } = useApi(
    () => ownerService.getRenthouseById(parseInt(params.id as string)),
    { autoFetch: true }
  );

  // Convert API data to local property format using useMemo to prevent infinite re-renders
  const property: Property = useMemo(() => {
    if (!propertyData) {
      return {
        id: parseInt(params.id as string),
        name: "Loading...",
        address: "Loading...",
        description: "Loading...",
        baseRent: 0,
        imageUrl: "/placeholder-property.jpg",
        floors: [],
      };
    }

    return {
      id: propertyData.id,
      name: propertyData.name || "New Property",
      address: propertyData.address || "Address to be set",
      description: propertyData.description || "Property description to be set",
      baseRent: propertyData.baseRent || 0,
      imageUrl: propertyData.imageUrl || "/placeholder-property.jpg",
      floors: propertyData.floors?.map(floor => ({
        id: floor.id,
        floorNumber: floor.floorNumber,
        description: floor.description || `Floor ${floor.floorNumber}`,
        rooms: floor.rooms?.map(room => ({
          id: room.id,
          roomNumber: room.roomNumber,
          description: room.description || "",
          monthlyRent: room.monthlyRent || 0,
          deposit: room.deposit || 0,
          isOccupied: room.isOccupied || false,
          renterUsername: room.renterUsername,
          renterFullName: room.renterFullName,
        })) || [],
      })) || [],
    };
  }, [propertyData, params.id]);

  // Form for creating a new floor
  const createFloorForm = useForm<CreateFloorFormData>({
    resolver: zodResolver(createFloorSchema),
    defaultValues: {
      floorNumber: 1,
    },
  });

  // Form for creating a new room
  const createRoomForm = useForm<CreateRoomFormData>({
    resolver: zodResolver(createRoomSchema),
    defaultValues: {
      roomNumber: "1",
      description: "",
      monthlyRent: undefined as any,
      deposit: undefined as any,
    },
  });

  // Form for editing property details
  const editPropertyForm = useForm<EditPropertyFormData>({
    resolver: zodResolver(editPropertySchema),
    defaultValues: {
      name: "",
      address: "",
      description: "",
      baseRent: 0,
    },
  });

  // Form for editing room details
  const editRoomForm = useForm<CreateRoomFormData>({
    resolver: zodResolver(createRoomSchema),
    defaultValues: {
      roomNumber: "",
      description: "",
      monthlyRent: undefined as any,
      deposit: undefined as any,
    },
  });

  // Update form values when property data loads
  useEffect(() => {
    if (propertyData) {
      editPropertyForm.setValue("name", propertyData.name || "");
      editPropertyForm.setValue("address", propertyData.address || "");
      editPropertyForm.setValue("description", propertyData.description || "");
      editPropertyForm.setValue("baseRent", propertyData.baseRent || 0);
    }
  }, [propertyData]);

  const onSubmitCreateFloor = async (data: CreateFloorFormData) => {
    try {
      setIsSubmittingFloor(true);
      console.log("Creating floor:", data);

      await ownerService.createFloor(property.id, {
        floorNumber: data.floorNumber,
        description: `Floor ${data.floorNumber}`,
      });

      // Reset form and close dialog
      createFloorForm.reset();
      setIsCreateFloorDialogOpen(false);

      // Refresh data
      refetch();

      // Show success message (you can add a toast notification here)
      console.log("Floor created successfully!");
    } catch (error) {
      console.error("Error creating floor:", error);
      // Show error message (you can add a toast notification here)
      console.error("Failed to create floor. Please try again.");
    } finally {
      setIsSubmittingFloor(false);
    }
  };

  const onSubmitCreateRoom = async (data: CreateRoomFormData) => {
    try {
      setIsSubmittingRoom(true);
      console.log("Creating room:", data);

      if (!selectedFloorId) return;

      await ownerService.createRoom(selectedFloorId, {
        roomNumber: data.roomNumber,
        description: data.description,
        monthlyRent: data.monthlyRent,
        deposit: data.deposit,
      });

      // Reset form and close dialog
      createRoomForm.reset();
      setIsCreateRoomDialogOpen(false);
      setSelectedFloorId(null);

      // Refresh data
      refetch();

      // Show success message (you can add a toast notification here)
      console.log("Room created successfully!");
    } catch (error) {
      console.error("Error creating room:", error);
      // Show error message (you can add a toast notification here)
      console.error("Failed to create room. Please try again.");
    } finally {
      setIsSubmittingRoom(false);
    }
  };

  const onSubmitEditProperty = async (data: EditPropertyFormData) => {
    try {
      setIsSubmittingProperty(true);
      console.log("Updating property:", data);

      await ownerService.updateRenthouse(property.id, {
        name: data.name,
        address: data.address,
        description: data.description,
        baseRent: data.baseRent,
        waterFee: "0", // You might want to add these fields to the form
        electricityFee: "0", // You might want to add these fields to the form
      });

      // Reset form and close dialog
      setIsEditPropertyDialogOpen(false);

      // Refresh data
      refetch();

      // Show success message (you can add a toast notification here)
      console.log("Property updated successfully!");
    } catch (error) {
      console.error("Error updating property:", error);
      // Show error message (you can add a toast notification here)
      console.error("Failed to update property. Please try again.");
    } finally {
      setIsSubmittingProperty(false);
    }
  };

  const onSubmitEditRoom = async (data: CreateRoomFormData) => {
    try {
      setIsSubmittingRoomEdit(true);
      console.log("Updating room:", data);
      console.log("Selected room for edit:", selectedRoomForEdit);

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

      console.log("Sending update data:", updateData);

      const response = await ownerService.updateRoom(selectedRoomForEdit.id, updateData);
      console.log("Update response:", response);

      // Reset form and close dialog
      editRoomForm.reset();
      setIsEditRoomDialogOpen(false);
      setSelectedRoomForEdit(null);

      // Refresh data
      refetch();

      // Show success message (you can add a toast notification here)
      console.log("Room updated successfully!");
    } catch (error: any) {
      console.error("Error updating room:", error);
      console.error("Error details:", {
        message: error.message,
        response: error.response,
        status: error.response?.status,
        data: error.response?.data
      });
      // Show error message (you can add a toast notification here)
      console.error(`Failed to update room: ${error.response?.data?.message || error.message || 'Unknown error'}`);
    } finally {
      setIsSubmittingRoomEdit(false);
    }
  };

  const handleCreateRoom = (floorId: number) => {
    setSelectedFloorId(floorId);
    setIsCreateRoomDialogOpen(true);
  };

  // Utility functions for better data handling
  const getFloorById = useCallback((floorId: number) => {
    return property.floors.find(floor => floor.id === floorId);
  }, [property.floors]);

  const getRoomById = useCallback((roomId: number) => {
    for (const floor of property.floors) {
      const room = floor.rooms.find(room => room.id === roomId);
      if (room) return room;
    }
    return null;
  }, [property.floors]);

  const refreshData = useCallback(() => {
    refetch();
  }, [refetch]);

  // Handle room status changes (for future implementation)
  const handleRoomStatusChange = useCallback(async (roomId: number, isOccupied: boolean) => {
    try {
      // TODO: Implement room status update API call
      console.log(`Updating room ${roomId} status to ${isOccupied ? 'occupied' : 'vacant'}`);

      // For now, just refresh the data
      refreshData();
    } catch (error) {
      console.error('Error updating room status:', error);
      console.error("Failed to update room status. Please try again.");
    }
  }, [refreshData]);

  // Handle room editing (for future implementation)
  const handleEditRoom = useCallback((roomId: number) => {
    const room = getRoomById(roomId);
    if (room) {
      console.log('Editing room:', room);
      setSelectedRoomForEdit(room);

      // Populate the edit form with current room data
      editRoomForm.setValue("roomNumber", room.roomNumber);
      editRoomForm.setValue("description", room.description);
      editRoomForm.setValue("monthlyRent", room.monthlyRent);
      editRoomForm.setValue("deposit", room.deposit);

      // Open the edit dialog
      setIsEditRoomDialogOpen(true);
    }
  }, [getRoomById, editRoomForm]);

  // Handle floor editing (for future implementation)
  const handleEditFloor = useCallback((floorId: number) => {
    const floor = getFloorById(floorId);
    if (floor) {
      console.log('Editing floor:', floor);
      // TODO: Implement floor editing functionality
    }
  }, [getFloorById]);

  // Calculate dynamic statistics
  const propertyStats = useMemo(() => {
    const totalRooms = property.floors.reduce(
      (acc, floor) => acc + floor.rooms.length,
      0
    );
    const occupiedRooms = property.floors.reduce(
      (acc, floor) => acc + floor.rooms.filter((room) => room.isOccupied).length,
      0
    );
    const monthlyIncome = property.floors.reduce(
      (acc, floor) =>
        acc +
        floor.rooms
          .filter((room) => room.isOccupied)
          .reduce((sum, room) => sum + (room.monthlyRent || 0), 0),
      0
    );
    const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

    return {
      totalRooms,
      occupiedRooms,
      monthlyIncome,
      occupancyRate,
      vacantRooms: totalRooms - occupiedRooms,
    };
  }, [property.floors]);

  return (
    <div className="space-y-6">
      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading property details...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-medium">Error loading property</h3>
          <p className="text-red-600 text-sm mt-1">
            {error || "Failed to load property details. Please try again."}
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

      {/* Content - only show when not loading and no error */}
      {!loading && !error && (
        <>
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/owner/renthouses">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Properties
                </Button>
              </Link>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={refreshData}
                disabled={loading}
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button variant="outline" onClick={() => setIsEditPropertyDialogOpen(true)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Property
              </Button>
              <Dialog open={isCreateFloorDialogOpen} onOpenChange={setIsCreateFloorDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Floor
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Floor</DialogTitle>
                    <DialogDescription>
                      Create a new floor for this property
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...createFloorForm}>
                    <form onSubmit={createFloorForm.handleSubmit(onSubmitCreateFloor)} className="space-y-4">
                      <FormField
                        control={createFloorForm.control}
                        name="floorNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Floor Number</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="Enter floor number"
                                {...field}
                                value={field.value || ""}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  field.onChange(value === "" ? undefined : parseInt(value));
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
                          onClick={() => setIsCreateFloorDialogOpen(false)}
                          disabled={isSubmittingFloor}
                        >
                          Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmittingFloor}>
                          {isSubmittingFloor ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Creating...
                            </>
                          ) : (
                            "Create Floor"
                          )}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Property Overview */}
          <div>
            <h1 className="text-3xl font-bold mb-2">{property.name}</h1>
            <p className="text-gray-600 flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              {property.address}
            </p>
          </div>

          {/* Key Metrics */}
          <div className="grid gap-4 md:grid-cols-5">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Rooms</CardTitle>
                <Building className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{propertyStats.totalRooms}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Occupied</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{propertyStats.occupiedRooms}</div>
                <p className="text-xs text-muted-foreground">
                  {propertyStats.occupancyRate}% occupancy
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Vacant</CardTitle>
                <Building className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{propertyStats.vacantRooms}</div>
                <p className="text-xs text-muted-foreground">
                  Available for rent
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Monthly Income
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${propertyStats.monthlyIncome}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Floors</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{property.floors.length}</div>
              </CardContent>
            </Card>
          </div>

          {/* Property Details */}
          <Tabs defaultValue="floors" className="space-y-6">
            <TabsList>
              <TabsTrigger value="floors">Floors & Rooms</TabsTrigger>
              {/* <TabsTrigger value="tenants">Tenants</TabsTrigger> */}
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="floors" className="space-y-6">
              {property.floors.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Building className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Floors Yet</h3>
                    <p className="text-muted-foreground text-center mb-4">
                      Get started by creating your first floor for this property.
                    </p>
                    <Button onClick={() => setIsCreateFloorDialogOpen(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Create First Floor
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                property.floors.map((floor) => (
                  <Card key={floor.id}>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <div>
                          <CardTitle>Floor {floor.floorNumber}</CardTitle>
                          <CardDescription>{floor.description}</CardDescription>
                        </div>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" onClick={() => handleCreateRoom(floor.id)}>
                              <Plus className="mr-2 h-4 w-4" />
                              Add Room
                            </Button>
                          </DialogTrigger>
                        </Dialog>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4">
                        {floor.rooms.map((room) => (
                          <div key={room.id} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h4 className="font-semibold">
                                    Room {room.roomNumber}
                                  </h4>
                                  <Badge
                                    variant={
                                      room.isOccupied ? "default" : "secondary"
                                    }
                                  >
                                    {room.isOccupied ? "Occupied" : "Vacant"}
                                  </Badge>
                                </div>

                                <p className="text-gray-600 mb-2">
                                  {room.description}
                                </p>

                                {room.isOccupied && room.renterFullName && (
                                  <div className="mb-3">
                                    <p className="text-sm font-medium">Tenant:</p>
                                    <p className="text-sm text-gray-600">
                                      {room.renterFullName} (@{room.renterUsername})
                                    </p>
                                  </div>
                                )}

                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm text-gray-500">
                                      Monthly Rent
                                    </p>
                                    <p className="font-semibold">
                                      ${room.monthlyRent}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500">
                                      Security Deposit
                                    </p>
                                    <p className="font-semibold">${room.deposit}</p>
                                  </div>
                                </div>
                              </div>

                              <div className="ml-6 flex gap-2">
                                <Button variant="outline" size="sm" onClick={() => handleEditRoom(room.id)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Link href={`/owner/room/${room.id}`}>
                                  <Button size="sm">View Details</Button>
                                </Link>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            {/* <TabsContent value="tenants" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Current Tenants</CardTitle>
                  <CardDescription>Manage your property tenants</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {property.floors
                      .flatMap((floor) =>
                        floor.rooms.filter((room) => room.isOccupied)
                      )
                      .map((room) => (
                        <div
                          key={room.id}
                          className="flex justify-between items-center p-4 border rounded-lg"
                        >
                          <div>
                            <h4 className="font-semibold">{room.renterFullName}</h4>
                            <p className="text-sm text-gray-600">
                              Room {room.roomNumber} • ${room.monthlyRent}/month
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              Contact
                            </Button>
                            <Button size="sm">View Details</Button>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent> */}

            <TabsContent value="settings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Property Settings</CardTitle>
                  <CardDescription>Manage property configuration</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Description</h4>
                      <p className="text-gray-600">{property.description}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Base Rent</h4>
                      <p className="text-gray-600">${property.baseRent}/month</p>
                    </div>
                    {/* <Button variant="outline">Edit Property Details</Button> */}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Room Creation Dialog */}
          <Dialog open={isCreateRoomDialogOpen} onOpenChange={setIsCreateRoomDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Room</DialogTitle>
                <DialogDescription>
                  Create a new room on Floor {property.floors.find(f => f.id === selectedFloorId)?.floorNumber}
                </DialogDescription>
              </DialogHeader>
              <Form {...createRoomForm}>
                <form onSubmit={createRoomForm.handleSubmit(onSubmitCreateRoom)} className="space-y-4">
                  <FormField
                    control={createRoomForm.control}
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
                    control={createRoomForm.control}
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
                    control={createRoomForm.control}
                    name="monthlyRent"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Monthly Rent</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter monthly rent"
                            {...field}
                            value={field.value || ""}
                            onChange={(e) => {
                              const value = e.target.value;
                              field.onChange(value === "" ? undefined : parseInt(value));
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={createRoomForm.control}
                    name="deposit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Security Deposit</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter security deposit"
                            {...field}
                            value={field.value || ""}
                            onChange={(e) => {
                              const value = e.target.value;
                              field.onChange(value === "" ? undefined : parseInt(value));
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
                        setIsCreateRoomDialogOpen(false);
                        setSelectedFloorId(null);
                      }}
                      disabled={isSubmittingRoom}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmittingRoom}>
                      {isSubmittingRoom ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        "Create Room"
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>

          {/* Property Editing Dialog */}
          <Dialog open={isEditPropertyDialogOpen} onOpenChange={setIsEditPropertyDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Property Details</DialogTitle>
                <DialogDescription>
                  Update the property information
                </DialogDescription>
              </DialogHeader>
              <Form {...editPropertyForm}>
                <form onSubmit={editPropertyForm.handleSubmit(onSubmitEditProperty)} className="space-y-4">
                  <FormField
                    control={editPropertyForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Property Name</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Enter property name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={editPropertyForm.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Enter property address"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={editPropertyForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Enter property description"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={editPropertyForm.control}
                    name="baseRent"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Base Rent</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter base rent"
                            {...field}
                            value={field.value || ""}
                            onChange={(e) => {
                              const value = e.target.value;
                              field.onChange(value === "" ? undefined : parseInt(value));
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
                      onClick={() => setIsEditPropertyDialogOpen(false)}
                      disabled={isSubmittingProperty}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmittingProperty}>
                      {isSubmittingProperty ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        "Update Property"
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>

          {/* Room Editing Dialog */}
          <Dialog open={isEditRoomDialogOpen} onOpenChange={setIsEditRoomDialogOpen}>
            <DialogContent>
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
                            value={field.value || ""}
                            onChange={(e) => {
                              const value = e.target.value;
                              field.onChange(value === "" ? undefined : parseInt(value));
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
                            value={field.value || ""}
                            onChange={(e) => {
                              const value = e.target.value;
                              field.onChange(value === "" ? undefined : parseInt(value));
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
                        setIsEditRoomDialogOpen(false);
                        setSelectedRoomForEdit(null);
                        editRoomForm.reset();
                      }}
                      disabled={isSubmittingRoomEdit}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmittingRoomEdit}>
                      {isSubmittingRoomEdit ? (
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
        </>
      )}
    </div>
  );
}
