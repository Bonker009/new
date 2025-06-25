'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ownerService } from '@/services/owner';
import { RoomDto, PaymentDto, CreatePaymentRequest } from '@/types/property';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ArrowLeft, DoorOpen, User, CreditCard, Edit, Receipt, Plus } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

// Payment form validation schema
const paymentFormSchema = z.object({
  paymentMonth: z.string().min(1, 'Payment month is required'),
  roomFee: z.number().min(0, 'Room fee must be 0 or greater'),
  electricityFee: z.union([
    z.number().min(0, 'Electricity fee must be 0 or greater'),
    z.string().length(0)
  ]),
  waterFee: z.union([
    z.number().min(0, 'Water fee must be 0 or greater'),
    z.string().length(0)
  ]),
  otherCharges: z.union([
    z.number().min(0, 'Other charges must be 0 or greater'),
    z.string().length(0)
  ]),
  otherChargesDescription: z.string().optional(),
});

type PaymentFormData = z.infer<typeof paymentFormSchema>;

export default function RoomDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [room, setRoom] = useState<RoomDto | null>(null);
  const [payments, setPayments] = useState<PaymentDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isCreatingPayment, setIsCreatingPayment] = useState(false);
  const [updatingPaymentStatus, setUpdatingPaymentStatus] = useState<number | null>(null);

  // Initialize react-hook-form
  const form = useForm<PaymentFormData>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      paymentMonth: '',
      roomFee: 0,
      electricityFee: '',
      waterFee: '',
      otherCharges: '',
      otherChargesDescription: '',
    },
  });

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        setLoading(true);
        const roomId = parseInt(params.id as string);

        const [roomResponse, paymentsResponse] = await Promise.all([
          ownerService.getRoomById(roomId),
          ownerService.getRoomPayments(roomId)
        ]);

        if (roomResponse.success && roomResponse.data) {
          setRoom(roomResponse.data);
          // Initialize form with room data
          form.reset({
            paymentMonth: '',
            roomFee: roomResponse.data!.monthlyRent || 0,
            electricityFee: '',
            waterFee: '',
            otherCharges: '',
            otherChargesDescription: '',
          });
        } else {
          setError(roomResponse.message || 'Failed to fetch room data');
        }

        if (paymentsResponse.success && paymentsResponse.data) {
          setPayments(paymentsResponse.data);
        } else {
          console.error('Failed to fetch payments:', paymentsResponse.message);
        }
      } catch (err) {
        console.error('Error fetching room data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load room data');
      } finally {
        setLoading(false);
      }
    };

    fetchRoomData();
  }, [params.id, form]);

  const fetchPayments = async () => {
    if (!room) return;

    try {
      const response = await ownerService.getRoomPayments(room.id);
      if (response.success && response.data) {
        setPayments(response.data);
      }
    } catch (err) {
      console.error('Error fetching payments:', err);
    }
  };

  const handleCreatePayment = async (data: PaymentFormData) => {
    if (!room) return;

    // Check if room is occupied
    if (!room.isOccupied || !room.renterId) {
      toast.error('Cannot create payment: Room is not occupied');
      return;
    }

    try {
      setIsCreatingPayment(true);

      // Convert month string to proper date format (YYYY-MM-01)
      const paymentMonthDate = data.paymentMonth + '-01';

      const paymentRequest: CreatePaymentRequest = {
        roomId: room.id,
        paymentMonth: paymentMonthDate,
        roomFee: data.roomFee,
        electricityFee: (typeof data.electricityFee === 'number' ? data.electricityFee : 0) as number,
        waterFee: (typeof data.waterFee === 'number' ? data.waterFee : 0) as number,
        otherCharges: (typeof data.otherCharges === 'number' ? data.otherCharges : 0) as number,
        otherChargesDescription: data.otherChargesDescription,
      };

      console.log('Sending payment request:', paymentRequest);

      const response = await ownerService.createPayment(paymentRequest);

      console.log('Payment response:', response);

      if (response.success) {
        toast.success('Payment created successfully');
        setIsPaymentModalOpen(false);
        // Reset form
        form.reset({
          paymentMonth: '',
          roomFee: room.monthlyRent || 0,
          electricityFee: '',
          waterFee: '',
          otherCharges: '',
          otherChargesDescription: '',
        });
        // Refresh payments
        await fetchPayments();
      } else {
        toast.error(response.message || 'Failed to create payment');
        console.error('Payment creation failed:', response);
      }
    } catch (err) {
      console.error('Error creating payment:', err);
      toast.error('Failed to create payment: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setIsCreatingPayment(false);
    }
  };

  const handleModalClose = () => {
    setIsPaymentModalOpen(false);
    form.reset({
      paymentMonth: '',
      roomFee: room?.monthlyRent || 0,
      electricityFee: '',
      waterFee: '',
      otherCharges: '',
      otherChargesDescription: '',
    });
  };

  const handleMarkAsPaid = async (paymentId: number) => {
    try {
      setUpdatingPaymentStatus(paymentId);

      const response = await ownerService.updatePaymentStatus(paymentId);

      if (response.success) {
        toast.success('Payment marked as paid successfully');
        // Refresh payments to show updated status
        await fetchPayments();
      } else {
        toast.error(response.message || 'Failed to update payment status');
      }
    } catch (err) {
      console.error('Error updating payment status:', err);
      toast.error('Failed to update payment status: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setUpdatingPaymentStatus(null);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (error || !room) {
    return <div className="flex justify-center items-center min-h-screen text-red-600">{error || 'Room not found'}</div>;
  }

  const validateRoomForPayment = () => {
    if (!room) {
      throw new Error('No room data available');
    }

    if (!room.isOccupied || !room.renterId) {
      throw new Error('Room is not occupied');
    }

    return true;
  };

  const createPayment = () => {
    try {
      validateRoomForPayment();
      // Navigate to payment creation form with room ID
      router.push(`/owner/payments/new?roomId=${room.id}`);
    } catch (error) {
      alert(`Cannot create payment: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/owner/rooms">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Rooms
            </Button>
          </Link>
        </div>
      </div>

      {/* Room Overview */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <DoorOpen className="mr-2 h-5 w-5" />
                    Room {room.roomNumber}
                  </CardTitle>
                  <CardDescription>
                    {room.renthouseName} • Floor {room.floorNumber}
                  </CardDescription>
                </div>
                <Badge variant={room.isOccupied ? "default" : "secondary"}>
                  {room.isOccupied ? "Occupied" : "Available"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">{room.description}</p>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Monthly Rent</p>
                  <p className="text-xl font-bold text-green-600">${room.monthlyRent}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Security Deposit</p>
                  <p className="text-lg font-semibold">${room.deposit}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tenant Info Card - Always show */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                {room.isOccupied ? "Current Tenant" : "Tenant Information"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {room.isOccupied && room.renterFullName ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">{room.renterFullName}</h3>
                    {room.renterUsername && <p className="text-gray-600">@{room.renterUsername}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {room.renterEmail && (
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{room.renterEmail}</p>
                      </div>
                    )}
                    {room.renterPhone && (
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-medium">{room.renterPhone}</p>
                      </div>
                    )}
                    {room.moveInDate && (
                      <div>
                        <p className="text-sm text-gray-500">Move-in Date</p>
                        <p className="font-medium">{new Date(room.moveInDate).toLocaleDateString()}</p>
                      </div>
                    )}
                    {room.bookedAt && (
                      <div>
                        <p className="text-sm text-gray-500">Booked At</p>
                        <p className="font-medium">{new Date(room.bookedAt).toLocaleDateString()}</p>
                      </div>
                    )}
                  </div>

                  {/* <div className="flex gap-2">
                    <Button variant="outline" size="sm">Contact Tenant</Button>
                    <Button variant="outline" size="sm">View Full Profile</Button>
                  </div> */}
                </div>
              ) : (
                <div className="text-center py-8">
                  <User className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500 text-lg font-medium">No Tenant Assigned</p>
                  <p className="text-sm text-gray-400 mt-2">
                    This room is currently available for booking
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Only show when room is occupied */}
        {room.isOccupied && (
          <div className="space-y-6">
            {/* <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full justify-start" onClick={createPayment}>
                  <Receipt className="mr-2 h-4 w-4" />
                  Create Payment
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Room Details
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <User className="mr-2 h-4 w-4" />
                  Manage Tenant
                </Button>
              </CardContent>
            </Card> */}

            <Card>
              <CardHeader>
                <CardTitle>Property Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <p className="text-sm text-gray-500">Property</p>
                  <p className="font-medium">{room.renthouseName}</p>
                </div>
                {room.renthouseAddress && (
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="text-sm">{room.renthouseAddress}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500">Floor</p>
                  <p className="font-medium">Floor {room.floorNumber}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Property Info Card - Show when room is not occupied */}
        {!room.isOccupied && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Property Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <p className="text-sm text-gray-500">Property</p>
                  <p className="font-medium">{room.renthouseName}</p>
                </div>
                {room.renthouseAddress && (
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="text-sm">{room.renthouseAddress}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500">Floor</p>
                  <p className="font-medium">Floor {room.floorNumber}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Payment History - Only show when room is occupied */}
      {room.isOccupied && (
        <Tabs defaultValue="payments" className="space-y-6">
          {/* <TabsList>
            <TabsTrigger value="payments">Payment History</TabsTrigger>
            <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          </TabsList> */}

          <TabsContent value="payments" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Payment History</h2>
              <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create New Payment
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Create New Payment</DialogTitle>
                    <DialogDescription>
                      Generate a new payment record for Room {room.roomNumber}
                    </DialogDescription>
                  </DialogHeader>

                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleCreatePayment)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="paymentMonth"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Payment Month *</FormLabel>
                            <FormControl>
                              <Input
                                type="month"
                                {...field}
                                className="w-full"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="roomFee"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Room Fee ($)</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  {...field}
                                  disabled
                                  className="w-full bg-gray-50"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="electricityFee"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Electricity Fee ($)</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  {...field}
                                  value={field.value === '' ? '' : field.value}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    field.onChange(value === '' ? '' : parseFloat(value) || 0);
                                  }}
                                  className="w-full"
                                  placeholder="0.00"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="waterFee"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Water Fee ($)</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  {...field}
                                  value={field.value === '' ? '' : field.value}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    field.onChange(value === '' ? '' : parseFloat(value) || 0);
                                  }}
                                  className="w-full"
                                  placeholder="0.00"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="otherCharges"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Other Charges ($)</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  {...field}
                                  value={field.value === '' ? '' : field.value}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    field.onChange(value === '' ? '' : parseFloat(value) || 0);
                                  }}
                                  className="w-full"
                                  placeholder="0.00"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="otherChargesDescription"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Other Charges Description</FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                placeholder="Describe any additional charges..."
                                className="w-full"
                                rows={3}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleModalClose}
                          disabled={isCreatingPayment}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          disabled={isCreatingPayment}
                        >
                          {isCreatingPayment ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                              Creating...
                            </>
                          ) : (
                            'Create Payment'
                          )}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-4">
              {payments.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-gray-500">No payment records found</p>
                    <p className="text-sm text-gray-400 mt-2">
                      Payment history will appear here once payments are created
                    </p>
                  </CardContent>
                </Card>
              ) : (
                payments.map((payment) => (
                  <Card key={payment.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">
                              {new Date(payment.paymentMonth).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long'
                              })}
                            </h3>
                            <Badge variant={payment.status === 'PAID' ? "default" : "destructive"}>
                              {payment.status === 'PAID' ? "Paid" : "Unpaid"}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-4 gap-4 mb-3">
                            <div>
                              <p className="text-sm text-gray-500">Room Fee</p>
                              <p className="font-medium">${payment.roomFee}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Electricity</p>
                              <p className="font-medium">${payment.electricityFee}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Water</p>
                              <p className="font-medium">${payment.waterFee}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Total</p>
                              <p className="text-lg font-bold text-green-600">${payment.totalAmount}</p>
                            </div>
                          </div>

                          {payment.status === 'PAID' && payment.paidAt && (
                            <p className="text-sm text-gray-500">
                              Paid on {new Date(payment.paidAt).toLocaleDateString()}
                            </p>
                          )}
                        </div>

                        <div className="ml-6 flex gap-2">
                          {payment.status === 'PAID' ? (
                            <Button variant="outline" size="sm" disabled>
                              <CreditCard className="h-4 w-4 mr-1" />
                              Paid
                            </Button>
                          ) : (
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => handleMarkAsPaid(payment.id)}
                              disabled={updatingPaymentStatus === payment.id}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              {updatingPaymentStatus === payment.id ? (
                                <>
                                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1" />
                                  Updating...
                                </>
                              ) : (
                                <>
                                  <CreditCard className="h-4 w-4 mr-1" />
                                  Mark as Paid
                                </>
                              )}
                            </Button>
                          )}
                          {/* <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button> */}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="maintenance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Maintenance Requests</CardTitle>
                <CardDescription>Track maintenance and repair requests for this room</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-gray-500">No maintenance requests</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Maintenance history will appear here
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}