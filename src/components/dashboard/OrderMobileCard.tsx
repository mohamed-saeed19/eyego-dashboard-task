import * as React from 'react';
import type { OrderRecord, OrderStatus } from '@/types';
import { formatCurrency, getStatusBadgeStyles } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { User, Globe, Calendar, CreditCard } from 'lucide-react';

export function OrderMobileCard({ order }: { order: OrderRecord }) {
  const styles = getStatusBadgeStyles(order.status as OrderStatus);

  return (
    <Card className="p-4 shadow-sm border-border/80 bg-card space-y-3">
      <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
        <span className="font-mono text-xs font-bold text-primary">
          {order.orderNumber}
        </span>
        <span
          className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium ${styles.badge}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${styles.dot}`} />
          {order.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <User className="h-3.5 w-3.5 text-muted-foreground/70 shrink-0" />
          <span className="truncate text-foreground font-medium">{order.customerName}</span>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Globe className="h-3.5 w-3.5 text-muted-foreground/70 shrink-0" />
          <span className="truncate">{order.country}</span>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Calendar className="h-3.5 w-3.5 text-muted-foreground/70 shrink-0" />
          <span>{order.date}</span>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
            {order.category}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-border/60">
        <span className="text-[11px] text-muted-foreground flex items-center gap-1">
          <CreditCard className="h-3 w-3" />
          Total
        </span>
        <span className="font-bold text-sm text-foreground">
          {formatCurrency(order.amount)}
        </span>
      </div>
    </Card>
  );
}
