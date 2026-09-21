import { cn } from 'cn';
import type { OrderRecord, OrderStatus, OrderFilters, CategoryRevenueStat } from '@/types';

export { cn };

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
});

export const formatCurrency = (amount: number): string => currencyFormatter.format(amount);

export const filterOrders = (
  data: OrderRecord[],
  filters: OrderFilters
): OrderRecord[] => {
  const query = filters.global.trim().toLowerCase();

  return data.filter((item) => {
    if (filters.category !== 'All' && item.category !== filters.category) return false;
    if (filters.status !== 'All' && item.status !== filters.status) return false;

    if (!query) return true;

    return (
      item.customerName.toLowerCase().includes(query) ||
      item.customerEmail.toLowerCase().includes(query) ||
      item.orderNumber.toLowerCase().includes(query) ||
      item.country.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query)
    );
  });
};

export const getStatusBadgeStyles = (status: OrderStatus) => {
  switch (status) {
    case 'Completed':
      return {
        badge: 'bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60',
        dot: 'bg-emerald-500',
      };
    case 'Processing':
      return {
        badge: 'bg-sky-50 text-sky-700 border-sky-200/80 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800/60',
        dot: 'bg-sky-500',
      };
    case 'Pending':
      return {
        badge: 'bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60',
        dot: 'bg-amber-500',
      };
    case 'Cancelled':
      return {
        badge: 'bg-rose-50 text-rose-700 border-rose-200/80 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60',
        dot: 'bg-rose-500',
      };
  }
};

export const getCategoryStats = (data: OrderRecord[]): CategoryRevenueStat[] => {
  const map: Record<string, { totalAmount: number; count: number }> = {};

  data.forEach((order) => {
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
};
