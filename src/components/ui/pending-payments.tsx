'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, QrCode, Calendar, AlertCircle, ExternalLink } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PaymentDto } from '@/types/property';
import Link from 'next/link';

interface PendingPaymentsProps {
  payments: PaymentDto[];
  loading?: boolean;
  error?: string | null;
  onPaymentAction?: (paymentId: number) => void;
  showActions?: boolean;
  maxItems?: number;
  compact?: boolean;
  onRefresh?: () => void;
}

export function PendingPayments({ 
  payments, 
  loading = false,
  error = null,
  onPaymentAction,
  showActions = true,
  maxItems,
  compact = false,
  onRefresh
}: PendingPaymentsProps) {
  const displayPayments = maxItems ? payments.slice(0, maxItems) : payments;
  const hasMorePayments = maxItems && payments.length > maxItems;

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="mr-2 h-5 w-5" />
            Pending Payments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertCircle className="mr-2 h-5 w-5 text-red-600" />
            Pending Payments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <AlertCircle className="mx-auto h-8 w-8 text-red-600 mb-2" />
            <p className="text-sm text-red-700 font-medium mb-2">Failed to load payments</p>
            <p className="text-xs text-muted-foreground mb-3">{error}</p>
            {onRefresh && (
              <Button onClick={onRefresh} size="sm" variant="outline">
                Try Again
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (payments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="mr-2 h-5 w-5 text-green-600" />
            Pending Payments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <CreditCard className="mx-auto h-8 w-8 text-green-600 mb-2" />
            <p className="text-sm text-green-700 font-medium">All caught up!</p>
            <p className="text-xs text-muted-foreground">No pending payments</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatPaymentMonth = (paymentMonth: string) => {
    return new Date(paymentMonth).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    });
  };

  const getStatusColor = (status?: string) => {
    switch (status?.toUpperCase()) {
      case 'OVERDUE':
        return 'destructive';
      case 'PENDING':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const getUrgencyLevel = (payment: PaymentDto) => {
    const paymentDate = new Date(payment.paymentMonth);
    const currentDate = new Date();
    const currentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const paymentMonthDate = new Date(paymentDate.getFullYear(), paymentDate.getMonth(), 1);
    
    const monthsDiff = (currentMonth.getTime() - paymentMonthDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
    
    if (monthsDiff > 1) return 'overdue'; // More than 1 month past
    if (monthsDiff >= 0 && monthsDiff <= 1) return 'due'; // Current month or just past
    return 'upcoming'; // Future months
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <AlertCircle className="mr-2 h-5 w-5 text-orange-600" />
            <CardTitle className="text-lg">Pending Payments</CardTitle>
          </div>
          <Badge variant="destructive" className="text-xs">
            {payments.length} outstanding
          </Badge>
        </div>
        {!compact && (
          <CardDescription>
            Review and pay your outstanding bills
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Alert Banner */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-orange-600" />
            <p className="text-sm font-medium text-orange-900">Action Required</p>
          </div>
          <p className="text-xs text-orange-800 mt-1">
            You have {payments.length} pending payment{payments.length !== 1 ? 's' : ''} that need attention.
          </p>
        </div>

        {/* Payment Items */}
        <div className="space-y-3">
          {displayPayments.map((payment) => {
            const urgency = getUrgencyLevel(payment);
            
            return (
              <div 
                key={payment.id} 
                className={`border rounded-lg p-3 ${
                  urgency === 'overdue' ? 'border-red-200 bg-red-50/50' : 
                  urgency === 'due' ? 'border-orange-200 bg-orange-50/50' : 
                  'border-gray-200 bg-gray-50/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-semibold truncate">
                        {formatPaymentMonth(payment.paymentMonth)}
                      </h4>
                      <Badge variant={getStatusColor(payment.status)} className="text-xs">
                        {payment.status || 'Pending'}
                      </Badge>
                      {urgency === 'overdue' && (
                        <Badge variant="destructive" className="text-xs">
                          Overdue
                        </Badge>
                      )}
                    </div>
                    
                    {!compact && (
                      <p className="text-xs text-muted-foreground mb-2">
                        Room {payment.roomNumber || payment.room?.roomNumber || 'N/A'}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="text-sm">
                        <span className="font-bold text-orange-700">
                          ${payment.totalAmount?.toFixed(2) || '0.00'}
                        </span>
                        {!compact && (
                          <span className="text-xs text-muted-foreground ml-1">
                            due
                          </span>
                        )}
                      </div>
                      
                      {showActions && (
                        <div className="flex gap-1">
                          {payment.qrCodeData && (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="h-7 px-2 text-xs"
                                >
                                  <QrCode className="h-3 w-3 mr-1" />
                                  Pay
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Payment QR Code</DialogTitle>
                                  <DialogDescription>
                                    Scan this QR code to make your payment for {formatPaymentMonth(payment.paymentMonth)}
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
                                <div className="text-center">
                                  <p className="text-sm font-medium">Amount: ${payment.totalAmount}</p>
                                  <p className="text-xs text-muted-foreground">
                                    Room {payment.roomNumber || payment.room?.roomNumber || 'N/A'} • {formatPaymentMonth(payment.paymentMonth)}
                                  </p>
                                </div>
                              </DialogContent>
                            </Dialog>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="pt-2 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-xs text-muted-foreground">
              Total outstanding: <span className="font-semibold text-orange-700">
                ${payments.reduce((sum, p) => sum + (p.totalAmount || 0), 0).toFixed(2)}
              </span>
            </div>
            
            <Link href="/user/payments">
              <Button variant="outline" size="sm" className="h-7 text-xs">
                View All
                <ExternalLink className="h-3 w-3 ml-1" />
              </Button>
            </Link>
          </div>
          
          {hasMorePayments && (
            <p className="text-xs text-muted-foreground mt-1">
              +{payments.length - maxItems!} more payments
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}