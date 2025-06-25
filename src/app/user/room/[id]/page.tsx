"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
import { PaymentDto, RoomDto } from "@/types/property";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { QrCode, X } from "lucide-react";
import Image from "next/image";
import { getImageUrl } from "@/lib/utils";

const RoomDetailsPage = () => {
  const params = useParams();
  const roomId = params.id as string;

  const [room, setRoom] = useState<RoomDto | null>(null);
  const [payments, setPayments] = useState<PaymentDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState<PaymentDto | null>(null);
  const [qrCodeLoading, setQrCodeLoading] = useState(false);
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);

  useEffect(() => {
    if (!roomId) return;

    const fetchRoomData = async () => {
      try {
        const [roomRes, paymentsRes] = await Promise.all([
          userService.getRoomDetails(roomId),
          userService.getPaymentsForRoom(roomId),
        ]);

        if (roomRes.success && roomRes.data) {
          setRoom(roomRes.data);
        } else {
          toast.error(roomRes.message || "Failed to load room details.");
        }

        if (paymentsRes.success && paymentsRes.data) {
          setPayments(paymentsRes.data);
        } else {
          toast.error(paymentsRes.message || "Failed to load payments.");
        }
      } catch (error: any) {
        toast.error(error?.message || "An error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchRoomData();
  }, [roomId]);

  const handlePayNow = async (payment: PaymentDto) => {
    try {
      setQrCodeLoading(true);
      setSelectedPayment(payment);
      
      // If payment already has QR code data, use it
      if (payment.qrCodeData) {
        setQrCodeData(payment.qrCodeData);
      } else {
        // Fetch QR code from backend
        const response = await userService.getPaymentQRCode(payment.id);
        if (response.success && response.data) {
          setQrCodeData(response.data);
        } else {
          toast.error("Failed to load QR code");
          setSelectedPayment(null);
        }
      }
    } catch (error) {
      toast.error("Failed to load payment QR code");
      setSelectedPayment(null);
    } finally {
      setQrCodeLoading(false);
    }
  };

  const closePaymentDialog = () => {
    setSelectedPayment(null);
    setQrCodeData(null);
  };

  const renderSkeleton = () => (
    <div className="space-y-6">
      <Skeleton className="h-10 w-1/2" />
      <Skeleton className="h-4 w-3/4" />
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  if (loading) {
    return renderSkeleton();
  }

  if (!room) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold">Room Not Found</h3>
        <p className="text-muted-foreground mt-2">
          Could not retrieve details for this room.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-medium">
          Room {room.roomNumber} - {room.renthouseName}
        </h1>
        <p className="text-sm text-muted-foreground">
          View details and payment history for your booked room.
        </p>
      </div>
      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Room Information</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Monthly Rent:</span>
            <span className="font-medium">${room.monthlyRent?.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Deposit Paid:</span>
            <span className="font-medium">${room.deposit?.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Status:</span>
            <Badge
              variant={room.status === "OCCUPIED" ? "default" : "secondary"}
            >
              {room.status}
            </Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Booked On:</span>
            <span className="font-medium">
              {new Date(room.bookedAt).toLocaleDateString()}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>
            A record of all your payments for this room.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Payment Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Remark</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.length > 0 ? (
                payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>
                      {payment.paymentMonth
                        ? new Date(payment.paymentMonth).toLocaleDateString()
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      {typeof payment.totalAmount === "number"
                        ? `$${payment.totalAmount.toFixed(2)}`
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      {payment.type ? (
                        <Badge variant="outline">{payment.type}</Badge>
                      ) : (
                        "N/A"
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        {payment.otherChargesDescription ? (
                          <span className="text-sm text-gray-600" title={payment.otherChargesDescription}>
                            {payment.otherChargesDescription.length > 50 
                              ? `${payment.otherChargesDescription.substring(0, 50)}...` 
                              : payment.otherChargesDescription
                            }
                          </span>
                        ) : (
                          <span className="text-sm text-gray-400">No remarks</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {payment.status ? (
                        <Badge
                          variant={
                            payment.status === "PAID"
                              ? "default"
                              : "destructive"
                          }
                        >
                          {payment.status}
                        </Badge>
                      ) : (
                        "N/A"
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {payment.status !== "PAID" && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handlePayNow(payment)}
                          disabled={qrCodeLoading}
                        >
                          <QrCode className="h-4 w-4 mr-2" />
                          Pay Now
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-24">
                    No payment history found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Payment QR Code Dialog */}
      <Dialog open={!!selectedPayment} onOpenChange={closePaymentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Scan to Pay</DialogTitle>
            <DialogDescription>
              Scan this QR code with your payment app to complete the payment for Room {room.roomNumber}.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center p-4">
            {qrCodeLoading ? (
              <Skeleton className="h-64 w-64" />
            ) : (
              <Image
                src={getImageUrl(qrCodeData) || 'https://via.placeholder.com/300'}
                alt="Payment QR Code"
                width={300}
                height={300}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RoomDetailsPage; 