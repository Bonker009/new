'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAuthStore } from '@/store/auth';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  Home,
  Heart,
  CreditCard,
  Building,
  DoorOpen,
  Receipt,
  TrendingUp,
  LogOut,
  Search,
  Users,
} from 'lucide-react';
import { suppressApiErrors } from '@/lib/api';

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const { user, logout } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutDialog(true);
  };

  const handleLogoutConfirm = () => {
    try {
      // Suppress API errors during logout
      suppressApiErrors(true);
      logout();
      router.push('/auth/login');
    } catch (error) {
      // Handle any logout errors silently
      router.push('/auth/login');
    } finally {
      setShowLogoutDialog(false);
      // Re-enable error logging after a short delay
      setTimeout(() => {
        suppressApiErrors(false);
      }, 1000);
    }
  };

  const handleLogoutCancel = () => {
    setShowLogoutDialog(false);
  };

  const userNavItems = [
    {
      title: 'Dashboard',
      href: '/user/dashboard',
      icon: Home,
    },
    {
      title: 'Search Properties',
      href: '/search',
      icon: Search,
    },
    {
      title: 'Favorites',
      href: '/user/favorites',
      icon: Heart,
    },
  ];

  const ownerNavItems = [
    {
      title: 'Dashboard',
      href: '/owner/dashboard',
      icon: Home,
    },
    {
      title: 'Properties',
      href: '/owner/renthouses',
      icon: Building,
    },
    {
      title: 'Rooms',
      href: '/owner/rooms',
      icon: DoorOpen,
    },
    {
      title: 'Tenants',
      href: '/owner/tenants',
      icon: Users,
    },
    // {
    //   title: 'Payments',
    //   href: '/owner/payments',
    //   icon: Receipt,
    // },
    // {
    //   title: 'Income',
    //   href: '/owner/income',
    //   icon: TrendingUp,
    // },
  ];

  const navItems = user?.role === 'OWNER' ? ownerNavItems : userNavItems;

  return (
    <div className={cn('pb-12', className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Renthouse
          </h2>
          <p className="px-4 text-sm text-muted-foreground">
            {user?.role === 'OWNER' ? 'Property Management' : 'Find Your Home'}
          </p>
        </div>
        <Separator />
        <div className="px-3">
          <div className="space-y-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={pathname === item.href ? 'secondary' : 'ghost'}
                  className="w-full justify-start"
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.title}
                </Button>
              </Link>
            ))}
          </div>
        </div>
        <Separator />
        <div className="px-3">
          <Button
            variant="ghost"
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={handleLogoutClick}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
            <DialogDescription>
              Are you sure you want to logout? You will need to login again to access your account.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleLogoutCancel}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleLogoutConfirm}>
              Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}