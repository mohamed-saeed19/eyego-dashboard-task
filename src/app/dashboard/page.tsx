'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { logout } from '@/lib/features/authSlice';
import { OrdersTable } from '@/components/dashboard/OrdersTable';
import { AnalyticsCharts } from '@/components/dashboard/AnalyticsCharts';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import {
  LogOut,
  TrendingUp,
  Package,
  DollarSign,
  CheckCircle2,
  Clock,
  Sparkles,
  BarChart2,
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
  const pendingOrders = data.filter(
    (d) => d.status === 'Pending' || d.status === 'Processing'
  ).length;
  const completionRate =
    data.length > 0 ? Math.round((completedOrders / data.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-background pb-16">
      <header className="sticky top-0 z-30 border-b border-border/70 bg-card/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold shadow-md shadow-primary/25">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-bold tracking-tight text-foreground">
                  Eyego Commerce
                </span>
                <span className="rounded-full bg-primary/10 text-primary px-2 py-0.5 text-[10px] font-semibold">
                  Live
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground hidden sm:block">
                Operations, Orders Management & Analytics
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-border/60 bg-muted/30">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <div className="text-right">
                <div className="text-xs font-semibold text-foreground leading-none">
                  {user?.email || 'test@example.com'}
                </div>
                <div className="text-[10px] text-muted-foreground mt-0.5">Admin Session</div>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="h-9 gap-1.5 text-xs cursor-pointer hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign out</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="shadow-xs hover:shadow-sm transition-all border-border/80 bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs font-medium text-muted-foreground">
                Total Realized Revenue
              </CardTitle>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <DollarSign className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tracking-tight text-foreground">
                {formatCurrency(totalRevenue)}
              </div>
              <div className="flex items-center gap-1.5 mt-2 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                <TrendingUp className="h-3.5 w-3.5" />
                <span>Active portfolio performance</span>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-xs hover:shadow-sm transition-all border-border/80 bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs font-medium text-muted-foreground">
                Total Orders
              </CardTitle>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Package className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tracking-tight text-foreground">
                {data.length}
              </div>
              <p className="mt-2 text-[11px] text-muted-foreground">
                Across 5 product categories
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-xs hover:shadow-sm transition-all border-border/80 bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs font-medium text-muted-foreground">
                Fulfilled Orders
              </CardTitle>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tracking-tight text-foreground">
                {completedOrders}
              </div>
              <div className="flex items-center gap-1.5 mt-2 text-[11px] text-muted-foreground">
                <span className="font-semibold text-foreground">{completionRate}%</span>
                <span>fulfillment completion rate</span>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-xs hover:shadow-sm transition-all border-border/80 bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs font-medium text-muted-foreground">
                Orders in Pipeline
              </CardTitle>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600">
                <Clock className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tracking-tight text-foreground">
                {pendingOrders}
              </div>
              <p className="mt-2 text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                Pending fulfillment or verification
              </p>
            </CardContent>
          </Card>
        </div>

        <AnalyticsCharts />

        <Card className="shadow-sm border-border/80 bg-card overflow-hidden">
          <CardHeader className="pb-4 border-b border-border/60 bg-muted/20">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <BarChart2 className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold tracking-tight text-foreground">
                  Orders Registry
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  Interactive dataset with instant filtering, sorting, pagination, and data export
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <OrdersTable />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
