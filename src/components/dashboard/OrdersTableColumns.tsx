'use client';

import * as React from 'react';
import { Column, ColumnDef } from '@tanstack/react-table';
import type { OrderRecord, OrderStatus } from '@/types';
import { formatCurrency, getStatusBadgeStyles } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

function SortHeader({
  column,
  title,
  align = 'left',
}: {
  column: Column<OrderRecord, unknown>;
  title: string;
  align?: 'left' | 'right';
}) {
  const sorted = column.getIsSorted();
  return (
    <div className={align === 'right' ? 'text-right' : 'text-left'}>
      <Button
        variant="ghost"
        size="sm"
        className={`h-8 text-xs font-semibold text-foreground hover:bg-muted/80 ${
          align === 'right' ? '-mr-3' : '-ml-3'
        }`}
        onClick={() => column.toggleSorting(sorted === 'asc')}
      >
        {title}
        {sorted === 'asc' ? (
          <ArrowUp className="ml-1 h-3.5 w-3.5 text-primary" />
        ) : sorted === 'desc' ? (
          <ArrowDown className="ml-1 h-3.5 w-3.5 text-primary" />
        ) : (
          <ArrowUpDown className="ml-1 h-3.5 w-3.5 opacity-40" />
        )}
      </Button>
    </div>
  );
}

export const orderColumns: ColumnDef<OrderRecord>[] = [
  {
    accessorKey: 'orderNumber',
    header: ({ column }) => <SortHeader column={column} title="Order #" />,
    cell: ({ row }) => (
      <span className="font-mono text-xs font-semibold text-primary">
        {row.getValue('orderNumber')}
      </span>
    ),
  },
  {
    accessorKey: 'customerName',
    header: ({ column }) => <SortHeader column={column} title="Customer" />,
    cell: ({ row }) => (
      <div>
        <div className="font-medium text-xs text-foreground">
          {row.original.customerName}
        </div>
        <div className="text-[11px] text-muted-foreground">
          {row.original.customerEmail}
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'category',
    header: 'Category',
    cell: ({ row }) => (
      <span className="inline-flex items-center rounded-md bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground border border-border/50">
        {row.getValue('category')}
      </span>
    ),
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => <SortHeader column={column} title="Amount" align="right" />,
    cell: ({ row }) => (
      <div className="text-right font-semibold text-xs text-foreground">
        {formatCurrency(row.getValue('amount'))}
      </div>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as OrderStatus;
      const styles = getStatusBadgeStyles(status);
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${styles.badge}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${styles.dot}`} />
          {status}
        </span>
      );
    },
  },
  {
    accessorKey: 'date',
    header: ({ column }) => <SortHeader column={column} title="Date" />,
    cell: ({ row }) => (
      <span className="text-xs text-muted-foreground">{row.getValue('date')}</span>
    ),
  },
  {
    accessorKey: 'country',
    header: 'Country',
    cell: ({ row }) => (
      <span className="text-xs text-muted-foreground">{row.getValue('country')}</span>
    ),
  },
];
