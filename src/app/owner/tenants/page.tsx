'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Users,
  Phone,
  Mail,
  MapPin,
  Calendar,
  DollarSign,
  Building,
  User,
  Eye,
  Loader2,
  RefreshCw,
  Home,
  CreditCard,
} from 'lucide-react';
import Link from 'next/link';
import { useApi } from '@/hooks/useApi';
import { ownerService } from '@/services/owner';

// Type definitions for tenant data
interface Tenant {
  id: number;
  username: string;
  fullName: string;
  email: string;
  phone: string;
  roomId: number;
  roomNumber: string;
  floorNumber: number;
  renthouseId: number;
  renthouseName: string;
  renthouseAddress: string;
  monthlyRent: number;
  deposit: number;
  moveInDate: string;
  lastPaymentDate?: string;
  nextPaymentDate?: string;
  paymentStatus: 'PAID' | 'UNPAID' | 'OVERDUE' | 'PENDING';
  totalPaid: number;
  outstandingBalance: number;
  isActive: boolean;
}

export default function OwnerTenantsPage() {
  const router = useRouter();
  const [searchParams, setSearchParams] = useState({
    searchTerm: '',
  });

  // Fetch tenants data using API
  const { data: tenantsData, loading, error, refetch } = useApi(
    () => ownerService.getAllTenants(),
    { autoFetch: true }
  );

  // Convert API data to local tenant format
  const tenants: Tenant[] = useMemo(() => {
    if (!tenantsData) return [];

    // Debug: Log the raw data to identify duplicates
    console.log('Raw tenants data:', tenantsData);

    // Convert all tenant data without deduplication to show all room rentals
    return tenantsData.map((tenant: any) => ({
      id: tenant.id,
      username: tenant.username,
      fullName: tenant.fullName,
      email: tenant.email,
      phone: tenant.phone,
      roomId: tenant.roomId,
      roomNumber: tenant.roomNumber,
      floorNumber: tenant.floorNumber,
      renthouseId: tenant.renthouseId,
      renthouseName: tenant.renthouseName,
      renthouseAddress: tenant.renthouseAddress,
      monthlyRent: tenant.monthlyRent,
      deposit: tenant.deposit,
      moveInDate: tenant.moveInDate,
      lastPaymentDate: tenant.lastPaymentDate,
      nextPaymentDate: tenant.nextPaymentDate,
      paymentStatus: tenant.paymentStatus,
      totalPaid: tenant.totalPaid,
      outstandingBalance: tenant.outstandingBalance,
      isActive: tenant.isActive,
    }));
  }, [tenantsData]);

  // Filter tenants based on search criteria
  const filteredTenants = useMemo(() => {
    return tenants.filter((tenant) => {
      const matchesSearch = searchParams.searchTerm === '' ||
        tenant.fullName.toLowerCase().includes(searchParams.searchTerm.toLowerCase()) ||
        tenant.username.toLowerCase().includes(searchParams.searchTerm.toLowerCase()) ||
        tenant.email.toLowerCase().includes(searchParams.searchTerm.toLowerCase()) ||
        tenant.roomNumber.includes(searchParams.searchTerm) ||
        tenant.renthouseName.toLowerCase().includes(searchParams.searchTerm.toLowerCase());

      return matchesSearch;
    });
  }, [tenants, searchParams]);

  const handleViewTenant = (tenant: Tenant) => {
    router.push(`/owner/room/${tenant.roomId}`);
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'bg-green-100 text-green-800';
      case 'UNPAID':
        return 'bg-red-100 text-red-800';
      case 'OVERDUE':
        return 'bg-orange-100 text-orange-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'Paid';
      case 'UNPAID':
        return 'Unpaid';
      case 'OVERDUE':
        return 'Overdue';
      case 'PENDING':
        return 'Pending';
      default:
        return 'Unknown';
    }
  };

  // Calculate statistics
  const stats = useMemo(() => {
    const totalTenants = tenants.length;
    const totalPaid = tenants.reduce((sum, t) => sum + t.totalPaid, 0);

    // Calculate total unpaid based on monthly rent for tenants with unpaid payments
    const totalUnpaid = tenants
      .filter(t => t.paymentStatus === 'UNPAID' || t.paymentStatus === 'OVERDUE' || t.paymentStatus === 'PENDING')
      .reduce((sum, t) => sum + t.monthlyRent, 0);

    return {
      totalTenants,
      totalPaid,
      totalUnpaid,
    };
  }, [tenants]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading tenants...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading tenants: {error}</p>
          <Button onClick={() => refetch()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">All Tenants</h1>
          <p className="text-muted-foreground">
            View all tenants who have rented or booked your properties
          </p>
        </div>
        <Button onClick={() => refetch()} disabled={loading}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tenants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTenants}</div>
            <p className="text-xs text-muted-foreground">
              All tenants who have rented
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${stats.totalPaid}</div>
            <p className="text-xs text-muted-foreground">
              Total payments received
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Unpaid</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">${stats.totalUnpaid}</div>
            <p className="text-xs text-muted-foreground">
              Monthly rent for unpaid tenants
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Search Tenants</CardTitle>
          <CardDescription>
            Search by name, username, email, room number, or property name
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Search tenants..."
            value={searchParams.searchTerm}
            onChange={(e) => setSearchParams(prev => ({ ...prev, searchTerm: e.target.value }))}
            className="max-w-full"
          />
        </CardContent>
      </Card>

      {/* Tenants Cards */}
      <Card>
        <CardHeader>
          <CardTitle>All Tenants</CardTitle>
          <CardDescription>
            {filteredTenants.length} tenant(s) found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredTenants.length === 0 ? (
            <div className="text-center py-8">
              <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Tenants Found</h3>
              <p className="text-muted-foreground">
                {searchParams.searchTerm
                  ? 'Try adjusting your search criteria'
                  : 'No tenants have rented your properties yet'}
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredTenants.map((tenant) => (
                <Card key={`${tenant.roomId}`} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{tenant.fullName}</CardTitle>
                        <CardDescription className="flex items-center mt-1">
                          <User className="mr-1 h-3 w-3" />
                          @{tenant.username}
                        </CardDescription>
                      </div>
                      <Badge className={getPaymentStatusColor(tenant.paymentStatus)}>
                        {getPaymentStatusText(tenant.paymentStatus)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Contact Information */}
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                        {tenant.email}
                      </div>
                      <div className="flex items-center text-sm">
                        <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                        {tenant.phone}
                      </div>
                    </div>

                    {/* Property & Room Information */}
                    <div className="space-y-2">
                      <div className="flex items-center text-sm font-medium">
                        <Building className="mr-2 h-4 w-4 text-muted-foreground" />
                        {tenant.renthouseName}
                      </div>
                      <div className="flex items-center text-sm">
                        <Home className="mr-2 h-4 w-4 text-muted-foreground" />
                        Floor {tenant.floorNumber}, Room {tenant.roomNumber}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="mr-2 h-4 w-4" />
                        {tenant.renthouseAddress}
                      </div>
                    </div>

                    {/* Financial Information */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Monthly Rent:</span>
                        <span className="font-medium">${tenant.monthlyRent}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Deposit:</span>
                        <span className="font-medium">${tenant.deposit}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Total Paid:</span>
                        <span className="font-medium text-green-600">${tenant.totalPaid}</span>
                      </div>
                      {tenant.outstandingBalance > 0 && (
                        <div className="flex justify-between text-sm">
                          <span>Outstanding:</span>
                          <span className="font-medium text-red-600">${tenant.outstandingBalance}</span>
                        </div>
                      )}
                    </div>

                    {/* Move-in Date */}
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="mr-2 h-4 w-4" />
                      Moved in: {new Date(tenant.moveInDate).toLocaleDateString()}
                    </div>

                    {/* Action Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => handleViewTenant(tenant)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View Room Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 