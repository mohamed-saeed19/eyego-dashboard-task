'use client';

import * as React from 'react';
import { useAppSelector } from '@/lib/hooks';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { filterOrders, getCategoryStats, formatCurrency } from '@/lib/utils';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { BarChart3, TrendingUp, Layers, DollarSign } from 'lucide-react';

export function AnalyticsCharts() {
  const { data, globalFilter, categoryFilter, statusFilter } = useAppSelector(
    (state) => state.table
  );

  const filteredData = React.useMemo(() => {
    return filterOrders(data, {
      global: globalFilter,
      category: categoryFilter,
      status: statusFilter,
    });
  }, [data, globalFilter, categoryFilter, statusFilter]);

  const categoryRevenueData = React.useMemo(() => {
    return getCategoryStats(filteredData);
  }, [filteredData]);

  const totalFilteredRevenue = React.useMemo(() => {
    return filteredData.reduce((acc, order) => acc + order.amount, 0);
  }, [filteredData]);

  const topCategory = categoryRevenueData[0]?.category || 'N/A';
  const avgOrderValue =
    filteredData.length > 0 ? totalFilteredRevenue / filteredData.length : 0;

  return (
    <Card className="shadow-sm border-border/80 bg-card overflow-hidden">
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between pb-4 gap-4 border-b border-border/60 bg-muted/20">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <BarChart3 className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold tracking-tight text-foreground">
                Revenue by Product Category
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Synchronized with table filters ({filteredData.length} records active)
              </CardDescription>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border/80 bg-background shadow-2xs">
            <DollarSign className="h-3.5 w-3.5 text-emerald-500" />
            <div>
              <span className="text-[10px] text-muted-foreground block leading-none">Filtered Total</span>
              <span className="font-semibold text-foreground text-xs">
                {formatCurrency(totalFilteredRevenue)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border/80 bg-background shadow-2xs">
            <TrendingUp className="h-3.5 w-3.5 text-blue-500" />
            <div>
              <span className="text-[10px] text-muted-foreground block leading-none">Avg / Order</span>
              <span className="font-semibold text-foreground text-xs">
                {formatCurrency(avgOrderValue)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border/80 bg-background shadow-2xs">
            <Layers className="h-3.5 w-3.5 text-indigo-500" />
            <div>
              <span className="text-[10px] text-muted-foreground block leading-none">Top Category</span>
              <span className="font-semibold text-foreground text-xs">{topCategory}</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        {categoryRevenueData.length > 0 ? (
          <div className="h-72.5 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={categoryRevenueData}
                margin={{ top: 15, right: 15, left: 5, bottom: 20 }}
              >
                <defs>
                  <linearGradient id="primaryBarGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#1d4ed8" stopOpacity={0.7} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.6} />
                <XAxis
                  dataKey="category"
                  stroke="#94a3b8"
                  fontSize={12}
                  tickLine={false}
                  axisLine={{ stroke: '#e2e8f0' }}
                  dy={10}
                />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `$${val.toLocaleString()}`}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(59, 130, 246, 0.06)' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0].payload;
                      return (
                        <div className="rounded-xl border border-border/80 bg-popover/95 p-3 shadow-lg backdrop-blur-sm text-xs space-y-1.5">
                          <p className="font-semibold text-popover-foreground">{item.category}</p>
                          <div className="flex items-center justify-between gap-4 text-muted-foreground">
                            <span>Revenue:</span>
                            <span className="font-semibold text-foreground">
                              ${item.revenue.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-4 text-muted-foreground">
                            <span>Orders:</span>
                            <span className="font-semibold text-foreground">{item.orders}</span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar
                  dataKey="revenue"
                  fill="url(#primaryBarGradient)"
                  radius={[8, 8, 0, 0]}
                  maxBarSize={56}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex h-[280px] flex-col items-center justify-center rounded-xl border border-dashed text-xs text-muted-foreground gap-2">
            <Layers className="h-6 w-6 text-muted-foreground/50" />
            <span>No chart records match the active filters.</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
