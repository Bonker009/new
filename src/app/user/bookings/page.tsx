"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { userService } from "@/services/user";
import { RenthouseDto, RoomDto } from "@/types/property";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarDays, Home, Search } from "lucide-react";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface BookedRoom extends RoomDto {
  renthouse?: RenthouseDto;
}

const MyBookingsPage = () => {
  const [bookedRooms, setBookedRooms] = useState<BookedRoom[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const bookingsRes = await userService.getAllMyBookings();
        if (bookingsRes.success && bookingsRes.data) {
          const roomPromises = bookingsRes.data.map(async (room) => {
            if (room.renthouseId) {
              const renthouseRes = await userService.getRenthouseDetails(
                room.renthouseId.toString()
              );
              if (renthouseRes.success && renthouseRes.data) {
                return { ...room, renthouse: renthouseRes.data };
              }
            }
            return { ...room, renthouse: undefined };
          });
          const populatedRooms = await Promise.all(roomPromises);
          setBookedRooms(populatedRooms);
        } else {
          toast.error(bookingsRes.message);
        }
      } catch (error: any) {
        toast.error(
          error?.message || "An error occurred while fetching bookings."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Bookings</h1>
          <p className="text-muted-foreground">
            A history of all your booked properties and rental agreements.
          </p>
        </div>
        {bookedRooms.length > 0 && (
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-sm">
              {bookedRooms.length} {bookedRooms.length === 1 ? 'booking' : 'bookings'}
            </Badge>
          </div>
        )}
      </div>
      <Separator />

      {loading ? (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          </CardContent>
        </Card>
      ) : bookedRooms.length > 0 ? (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="h-12 px-6 text-left font-semibold">Property</TableHead>
                    <TableHead className="h-12 px-4 text-left font-semibold">Room</TableHead>
                    <TableHead className="h-12 px-4 text-right font-semibold">Monthly Rent</TableHead>
                    <TableHead className="h-12 px-4 text-left font-semibold">Booked Date</TableHead>
                    <TableHead className="h-12 px-4 text-center font-semibold">Status</TableHead>
                    <TableHead className="h-12 px-6 text-right font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookedRooms.map((room, index) => (
                    <TableRow key={room.id} className="hover:bg-gray-50/50 transition-colors">
                      <TableCell className="px-6 py-4 font-medium">
                        <div className="max-w-[200px]">
                          <div className="font-semibold text-gray-900 truncate" title={room.renthouse?.name}>
                            {room.renthouse?.name || "N/A"}
                          </div>
                          {room.renthouse?.address && (
                            <div className="text-sm text-gray-500 truncate" title={room.renthouse.address}>
                              {room.renthouse.address}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-4">
                        <div className="font-medium text-gray-900">
                          Room {room.roomNumber}
                        </div>
                        <div className="text-sm text-gray-500">
                          Floor {room.floorNumber || 'N/A'}
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-4 text-right">
                        <div className="font-semibold text-gray-900">
                          ${room.monthlyRent?.toFixed(2) || "N/A"}
                        </div>
                        <div className="text-sm text-gray-500">
                          per month
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-4">
                        <div className="font-medium text-gray-900">
                          {room.bookedAt
                            ? new Date(room.bookedAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })
                            : "N/A"}
                        </div>
                        {room.bookedAt && (
                          <div className="text-sm text-gray-500">
                            {new Date(room.bookedAt).toLocaleDateString('en-US', {
                              weekday: 'long'
                            })}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="px-4 py-4 text-center">
                        <Badge
                          variant={
                            room.status === "OCCUPIED" ? "default" : 
                            room.status === "BOOKED" ? "secondary" : "outline"
                          }
                          className="text-xs font-medium"
                        >
                          {room.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-right">
                        {room.id && (
                          <Button asChild variant="outline" size="sm" className="min-w-[90px]">
                            <Link href={`/user/room/${room.id}`}>
                              View Details
                            </Link>
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CalendarDays className="mr-2 h-5 w-5" />
              Booking History
            </CardTitle>
            <CardDescription>
              Your rental bookings and property agreements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <CalendarDays className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No bookings yet</h3>
              <p className="text-muted-foreground mt-2 mb-4">
                You haven't booked any properties yet. Start exploring to find your perfect rental.
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
      )}
    </div>
  );
};

export default MyBookingsPage; 