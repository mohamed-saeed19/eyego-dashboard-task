'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { logout } from '@/lib/features/authSlice';
import { OrdersTable } from '@/components/dashboard/OrdersTable';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import {
  LogOut,
  LayoutDashboard,
  TrendingUp,
  Package,
  DollarSign,
  Users,
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, token } = useAppSelector((state) => state.auth);
  const { data } = useAppSelector((state) => state.table);

  useEffect(() => {
    if (!token && typeof window !== 'undefined' && !localStorage.getItem('token')) {
      router.replace('/login');
    }
  }, [token, router]);

  const handleLogout = () => {
    dispatch(logout());
    router.replace('/login');
  };

  const totalRevenue = data
    .filter((d) => d.status === 'Completed')
    .reduce((sum, d) => sum + d.amount, 0);

  const completedOrders = data.filter((d) => d.status === 'Completed').length;
  const pendingOrders = data.filter((d) => d.status === 'Pending' || d.status === 'Processing').length;

  return (
    <div className="min-h-screen bg-muted/20 pb-12">
      <header className="sticky top-0 z-20 border-b border-border/80 bg-background/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-semibold shadow-sm">
              <LayoutDashboard className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-foreground sm:text-lg">
                Eyego Commerce
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                Operations & Analytics Overview
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-medium text-foreground">
                {user?.email || 'test@example.com'}
              </div>
              <div className="text-[10px] text-muted-foreground">Store Administrator</div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="h-8 gap-1.5 cursor-pointer text-xs"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign out</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="shadow-xs border-border/70">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs font-medium text-muted-foreground">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                ${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-emerald-600" />
                From completed orders
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-xs border-border/70">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs font-medium text-muted-foreground">
                Total Orders
              </CardTitle>
              <Package className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{data.length}</div>
              <p className="text-[11px] text-muted-foreground mt-1">Across all categories</p>
            </CardContent>
          </Card>

          <Card className="shadow-xs border-border/70">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs font-medium text-muted-foreground">
                Completed
              </CardTitle>
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{completedOrders}</div>
              <p className="text-[11px] text-muted-foreground mt-1">Fulfillment completed</p>
            </CardContent>
          </Card>

          <Card className="shadow-xs border-border/70">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs font-medium text-muted-foreground">
                In Pipeline
              </CardTitle>
              <div className="h-2 w-2 rounded-full bg-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{pendingOrders}</div>
              <p className="text-[11px] text-muted-foreground mt-1">Pending or processing</p>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-sm border-border/80">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold tracking-tight">Orders Registry</CardTitle>
            <CardDescription>
              Real-time records managed through Redux Toolkit and TanStack Table
            </CardDescription>
          </CardHeader>
          <CardContent>
            <OrdersTable />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
