'use client';

import * as React from 'react';
import { useAppSelector } from '@/lib/hooks';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { BarChart3 } from 'lucide-react';

export function AnalyticsCharts() {
  const { data, globalFilter, categoryFilter, statusFilter } = useAppSelector(
    (state) => state.table
  );

  const filteredData = React.useMemo(() => {
    return data.filter((item) => {
      if (categoryFilter !== 'All' && item.category !== categoryFilter) {
        return false;
      }
      if (statusFilter !== 'All' && item.status !== statusFilter) {
        return false;
      }
      if (globalFilter.trim()) {
        const query = globalFilter.toLowerCase().trim();
        const matchesName = item.customerName.toLowerCase().includes(query);
        const matchesEmail = item.customerEmail.toLowerCase().includes(query);
        const matchesOrder = item.orderNumber.toLowerCase().includes(query);
        const matchesCountry = item.country.toLowerCase().includes(query);
        const matchesCategory = item.category.toLowerCase().includes(query);
        if (!matchesName && !matchesEmail && !matchesOrder && !matchesCountry && !matchesCategory) {
          return false;
        }
      }
      return true;
    });
  }, [data, globalFilter, categoryFilter, statusFilter]);

  const categoryRevenueData = React.useMemo(() => {
    const map: Record<string, { totalAmount: number; count: number }> = {};

    filteredData.forEach((order) => {
      if (!map[order.category]) {
        map[order.category] = { totalAmount: 0, count: 0 };
      }
      map[order.category].totalAmount += order.amount;
      map[order.category].count += 1;
    });

    return Object.entries(map)
      .map(([category, stats]) => ({
        category,
        revenue: Math.round(stats.totalAmount),
        orders: stats.count,
      }))
      .sort((a, b) => b.revenue - a.revenue);
  }, [filteredData]);

  const totalFilteredRevenue = React.useMemo(() => {
    return filteredData.reduce((acc, order) => acc + order.amount, 0);
  }, [filteredData]);

  return (
    <Card className="shadow-sm border-border/80">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <CardTitle className="text-base font-semibold tracking-tight">
              Revenue by Category
            </CardTitle>
          </div>
          <CardDescription className="text-xs text-muted-foreground mt-0.5">
            Real-time visualization linked to current table filters ({filteredData.length} records)
          </CardDescription>
        </div>
        <div className="rounded-lg bg-muted/60 px-3 py-1.5 text-right sm:text-left self-start sm:self-auto">
          <span className="text-[11px] text-muted-foreground block">Filtered Total</span>
          <span className="text-sm font-bold text-foreground">
            ${totalFilteredRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        {categoryRevenueData.length > 0 ? (
          <div className="h-[280px] w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={categoryRevenueData}
                margin={{ top: 10, right: 10, left: -10, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.25} />
                <XAxis
                  dataKey="category"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `$${val}`}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0].payload;
                      return (
                        <div className="rounded-lg border border-border bg-background p-2.5 shadow-md text-xs">
                          <p className="font-semibold text-foreground mb-1">{item.category}</p>
                          <p className="text-muted-foreground">
                            Revenue:{' '}
                            <span className="font-medium text-foreground">
                              ${item.revenue.toLocaleString()}
                            </span>
                          </p>
                          <p className="text-muted-foreground">
                            Orders: <span className="font-medium text-foreground">{item.orders}</span>
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar
                  dataKey="revenue"
                  fill="currentColor"
                  radius={[6, 6, 0, 0]}
                  className="fill-primary"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex h-[280px] items-center justify-center rounded-lg border border-dashed text-xs text-muted-foreground">
            No chart data available for current filter selection.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
