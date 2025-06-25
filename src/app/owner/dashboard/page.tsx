"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building, DoorOpen, TrendingUp, Receipt, Plus, Users } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useApi } from "@/hooks/useApi";
import { ownerService } from "@/services/owner";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

export default function OwnerDashboard() {
  // Fetch comprehensive analytics data
  const {
    data: analyticsData,
    loading: analyticsLoading,
    error: analyticsError,
  } = useApi(() => ownerService.getDashboardAnalytics(), { autoFetch: true });

  // Extract data from analytics response
  const monthlyIncome = useMemo(() => {
    if (!analyticsData?.monthlyIncome) return [];

    // Create a map of all 12 months with default values
    const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const monthMap = new Map();

    // Initialize all months with zero income
    monthNames.forEach((name, index) => {
      monthMap.set(index + 1, { name, income: 0 });
    });

    // Update with actual data from API
    analyticsData.monthlyIncome.forEach((item: any) => {
      if (item.month && item.name && item.income !== undefined) {
        monthMap.set(item.month, { name: item.name, income: item.income });
      }
    });

    // Convert map to array and sort by month
    return Array.from(monthMap.values()).sort((a, b) => {
      const monthOrder = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
      return monthOrder.indexOf(a.name) - monthOrder.indexOf(b.name);
    });
  }, [analyticsData]);

  const tenantsByStatus = useMemo(() => {
    if (!analyticsData?.tenantStats?.distribution) return [];
    return analyticsData.tenantStats.distribution.map((item: any) => ({
      name: item.name,
      value: item.value,
    }));
  }, [analyticsData]);

  // Dashboard stats from analytics
  const totalProperties = analyticsData?.summary?.totalProperties || 0;
  const activeRooms = analyticsData?.summary?.activeRooms || 0;
  const totalYearIncome = analyticsData?.summary?.totalYearIncome || 0;
  const pendingPayments = analyticsData?.summary?.pendingPayments || 0;

  // Loading and error states
  if (analyticsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        Loading dashboard...
      </div>
    );
  }
  if (analyticsError) {
    return <div className="text-red-600">Error loading dashboard data.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your property portfolio
          </p>
        </div>
        <Button asChild>
          <Link href="/owner/renthouses/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Property
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Properties
            </CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProperties}</div>
            <p className="text-xs text-muted-foreground">Managed properties</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Rooms</CardTitle>
            <DoorOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeRooms}</div>
            <p className="text-xs text-muted-foreground">Occupied rooms</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Yearly Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalYearIncome}</div>
            <p className="text-xs text-muted-foreground">This year's revenue</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Payments
            </CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingPayments}</div>
            <p className="text-xs text-muted-foreground">Awaiting payment</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Income (Bar Chart)</CardTitle>
            <CardDescription>
              Income for each month in {new Date().getFullYear()}
            </CardDescription>
          </CardHeader>
          <CardContent style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyIncome}
                margin={{ top: 20, right: 30, left: 30, bottom: 20 }}
              >
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12 }}
                  interval={0}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip
                  formatter={(value: any) => [`$${value}`, 'Income']}
                  labelFormatter={(label) => `${label} ${new Date().getFullYear()}`}
                />
                <Bar dataKey="income" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Tenants by Payment Status (Donut Chart)</CardTitle>
            <CardDescription>
              Distribution of tenants by their payment status
            </CardDescription>
          </CardHeader>
          <CardContent style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={tenantsByStatus}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={40}
                  fill="#82ca9d"
                  label
                >
                  {tenantsByStatus.map((entry: any, index: number) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={["#8884d8", "#82ca9d", "#ffc658", "#ff7300"][index % 4]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

      </div>



      <div>
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Manage your properties efficiently
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/owner/renthouses">
              <Button className="w-full justify-start">
                <Building className="mr-2 h-4 w-4" />
                Manage Properties
              </Button>
            </Link>
            <Link href="/owner/rooms">
              <Button variant="outline" className="w-full justify-start">
                <DoorOpen className="mr-2 h-4 w-4" />
                View All Rooms
              </Button>
            </Link>
            <Link href="/owner/tenants">
              <Button variant="outline" className="w-full justify-start">
                <Users className="mr-2 h-4 w-4" />
                Manage Tenants
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest property updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-muted-foreground">No recent activity</p>
              <p className="text-sm text-muted-foreground mt-2">
                Add your first property to get started
              </p>
            </div>
          </CardContent>
        </Card> */}
      </div>
    </div>
  );
}
