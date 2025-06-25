'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Loader2, QrCode, Calendar, Filter } from 'lucide-react';
import { useApi, useApiMutation } from '@/hooks/useApi';
import { userService } from '@/services/user';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function UserPaymentsPage() {
  const { data: payments, loading, error, refetch } = useApi(
    () => userService.getPayments(),
    { autoFetch: true }
  );
  
  const { data: pendingPayments, loading: pendingLoading, refetch: refetchPending } = useApi(
    () => userService.getPendingPayments(),
    { autoFetch: true }
  );
  
  // Remove the problematic API call for now and filter from all payments
  const paidPayments = payments?.filter(p => p.status === "PAID") || [];
  const paidLoading = false;
  
  const [activeTab, setActiveTab] = useState("all");

  const qrCodeMutation = useApiMutation(userService.getPaymentQRCode);

  const handleViewQRCode = async (paymentId: number) => {
    try {
      await qrCodeMutation.mutate(paymentId);
      // QR code data would be displayed in a dialog
    } catch (error) {
      console.error('Failed to load QR code:', error);
    }
  };

  if (loading || pendingLoading || paidLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payment History</h1>
          <p className="text-muted-foreground">
            View your rental payments and QR codes
          </p>
        </div>
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading payments...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payment History</h1>
          <p className="text-muted-foreground">
            View your rental payments and QR codes
          </p>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">Failed to load payment history</p>
              <Button onClick={refetch}>
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Use API data for pending payments, filtered data for paid payments
  const actualPendingPayments = pendingPayments || [];
  const actualPaidPayments = paidPayments;

  const paymentStats = payments ? {
    total: payments.length,
    paid: actualPaidPayments.length,
    unpaid: actualPendingPayments.length,
    totalAmount: payments.reduce((sum, p) => sum + (p.totalAmount || 0), 0),
    paidAmount: actualPaidPayments.reduce((sum, p) => sum + (p.totalAmount || 0), 0)
  } : null;

  const renderPaymentCard = (payment: any) => (
    <Card key={payment.id} className={payment.status !== "PAID" ? "border-orange-200 bg-orange-50/30" : ""}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold">
                {new Date(payment.paymentMonth).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long' 
                })}
              </h3>
              <Badge variant={payment.status === "PAID" ? "default" : "destructive"}>
                {payment.status || "Pending"}
              </Badge>
              {payment.status !== "PAID" && (
                <Badge variant="outline" className="bg-orange-100 text-orange-800">
                  Action Required
                </Badge>
              )}
            </div>
            
            <p className="text-gray-600 mb-3">
              Room {payment.room?.roomNumber || 'N/A'}
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">Room Fee</p>
                <p className="font-medium">${payment.roomFee || 0}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Electricity</p>
                <p className="font-medium">${payment.electricityFee || 0}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Water</p>
                <p className="font-medium">${payment.waterFee || 0}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total</p>
                <p className="text-lg font-bold text-green-600">${payment.totalAmount}</p>
              </div>
            </div>
            
            {payment.otherCharges && payment.otherCharges > 0 && (
              <div className="mb-3">
                <p className="text-sm text-gray-500">Other Charges</p>
                <p className="font-medium">${payment.otherCharges}</p>
                {payment.otherChargesDescription && (
                  <p className="text-sm text-gray-400">{payment.otherChargesDescription}</p>
                )}
              </div>
            )}
            
            {payment.status === "PAID" && payment.paidAt && (
              <div className="flex items-center text-sm text-green-600">
                <Calendar className="h-4 w-4 mr-1" />
                Paid on {new Date(payment.paidAt).toLocaleDateString()}
              </div>
            )}
          </div>
          
          <div className="ml-6 flex flex-col gap-2">
            {payment.qrCodeData && payment.status !== "PAID" && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    variant="default" 
                    size="sm"
                    onClick={() => handleViewQRCode(payment.id)}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    <QrCode className="h-4 w-4 mr-2" />
                    Pay Now
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Payment QR Code</DialogTitle>
                    <DialogDescription>
                      Scan this QR code to make your payment
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex justify-center p-6">
                    <div className="bg-gray-100 p-4 rounded">
                      <p className="text-center text-gray-600">
                        QR Code: {payment.qrCodeData}
                      </p>
                      <p className="text-xs text-center text-gray-500 mt-2">
                        QR code visualization would appear here
                      </p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Payment History</h1>
        <p className="text-muted-foreground">
          View your rental payments and QR codes
        </p>
      </div>

      {paymentStats && payments && payments.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{paymentStats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Paid</CardTitle>
              <Badge variant="default" className="text-xs">{paymentStats.paid}</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">${paymentStats.paidAmount.toFixed(2)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unpaid</CardTitle>
              <Badge variant="destructive" className="text-xs">{paymentStats.unpaid}</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">${(paymentStats.totalAmount - paymentStats.paidAmount).toFixed(2)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${paymentStats.totalAmount.toFixed(2)}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {!payments || payments.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="mr-2 h-5 w-5" />
              Payment Records
            </CardTitle>
            <CardDescription>
              Monthly payments and transaction history
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <CreditCard className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No payments yet</h3>
              <p className="text-muted-foreground mt-2">
                Your payment history will appear here once you book a room
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All Payments ({payments?.length || 0})</TabsTrigger>
            <TabsTrigger value="pending" className="data-[state=active]:bg-orange-100 data-[state=active]:text-orange-900">
              Pending ({actualPendingPayments.length})
            </TabsTrigger>
            <TabsTrigger value="paid" className="data-[state=active]:bg-green-100 data-[state=active]:text-green-900">
              Paid ({actualPaidPayments.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            {payments.map(renderPaymentCard)}
          </TabsContent>
          
          <TabsContent value="pending" className="space-y-4">
            {actualPendingPayments.length === 0 ? (
              <Card>
                <CardContent className="p-6">
                  <div className="text-center py-8">
                    <CreditCard className="mx-auto h-12 w-12 text-green-600" />
                    <h3 className="mt-4 text-lg font-semibold text-green-600">All caught up!</h3>
                    <p className="text-muted-foreground mt-2">
                      You have no pending payments at this time.
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-orange-600" />
                    <h3 className="font-semibold text-orange-900">Action Required</h3>
                  </div>
                  <p className="text-orange-800 text-sm mt-1">
                    You have {actualPendingPayments.length} pending payment{actualPendingPayments.length !== 1 ? 's' : ''} that require your attention.
                  </p>
                </div>
                {actualPendingPayments.map(renderPaymentCard)}
              </>
            )}
          </TabsContent>
          
          <TabsContent value="paid" className="space-y-4">
            {actualPaidPayments.length === 0 ? (
              <Card>
                <CardContent className="p-6">
                  <div className="text-center py-8">
                    <CreditCard className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-semibold">No payment history</h3>
                    <p className="text-muted-foreground mt-2">
                      Your completed payments will appear here.
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              actualPaidPayments.map(renderPaymentCard)
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}