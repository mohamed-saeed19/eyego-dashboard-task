'use client';

import * as React from 'react';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import {
  setGlobalFilter,
  setCategoryFilter,
  setStatusFilter,
  setSorting,
  setPageIndex,
  setPageSize,
  resetFilters,
} from '@/lib/features/tableSlice';
import type { OrderCategory, OrderStatus } from '@/types';
import { exportToExcel, exportToPDF } from '@/lib/exportUtils';
import { filterOrders } from '@/lib/utils';
import { orderColumns } from './OrdersTableColumns';
import { OrderMobileCard } from './OrderMobileCard';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Search,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Filter,
  FileSpreadsheet,
  FileText,
  Loader2,
  X,
} from 'lucide-react';

const CATEGORIES: ('All' | OrderCategory)[] = [
  'All',
  'Electronics',
  'Apparel',
  'Home & Kitchen',
  'Books',
  'Fitness',
];

const STATUSES: ('All' | OrderStatus)[] = [
  'All',
  'Completed',
  'Processing',
  'Pending',
  'Cancelled',
];

export function OrdersTable() {
  const dispatch = useAppDispatch();
  const { data, globalFilter, categoryFilter, statusFilter, sorting, pagination } =
    useAppSelector((state) => state.table);

  const [isExportingExcel, setIsExportingExcel] = React.useState(false);
  const [isExportingPdf, setIsExportingPdf] = React.useState(false);

  const filteredData = React.useMemo(
    () =>
      filterOrders(data, {
        global: globalFilter,
        category: categoryFilter,
        status: statusFilter,
      }),
    [data, globalFilter, categoryFilter, statusFilter]
  );

  const handleExport = async (type: 'excel' | 'pdf') => {
    const isExcel = type === 'excel';
    const setLoading = isExcel ? setIsExportingExcel : setIsExportingPdf;
    const fn = isExcel ? exportToExcel : exportToPDF;
    const date = new Date().toISOString().slice(0, 10);
    try {
      setLoading(true);
      await fn(filteredData, `eyego-orders-${date}.${isExcel ? 'xlsx' : 'pdf'}`);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const table = useReactTable({
    data: filteredData,
    columns: orderColumns,
    state: { sorting, pagination },
    onSortingChange: (updater) =>
      dispatch(setSorting(typeof updater === 'function' ? updater(sorting) : updater)),
    onPaginationChange: (updater) => {
      const next = typeof updater === 'function' ? updater(pagination) : updater;
      dispatch(setPageIndex(next.pageIndex));
      dispatch(setPageSize(next.pageSize));
    },
    getCoreRowModel: getCoreRowModel(),
    manualPagination: false,
    autoResetPageIndex: false,
  });

  const pageCount = Math.max(1, Math.ceil(filteredData.length / pagination.pageSize));
  const currentPage = Math.min(pagination.pageIndex, pageCount - 1);
  const paginatedRows = table
    .getRowModel()
    .rows.slice(
      currentPage * pagination.pageSize,
      (currentPage + 1) * pagination.pageSize
    );

  const hasFilters = Boolean(
    globalFilter || categoryFilter !== 'All' || statusFilter !== 'All'
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search orders, customers, country..."
            value={globalFilter}
            onChange={(e) => dispatch(setGlobalFilter(e.target.value))}
            className="pl-9 pr-8 h-9 text-xs bg-background/80"
          />
          {globalFilter && (
            <button
              type="button"
              onClick={() => dispatch(setGlobalFilter(''))}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/60 px-2.5 py-1 rounded-lg border border-border/60">
            <Filter className="h-3.5 w-3.5 text-primary" />
            <span className="font-medium text-[11px]">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => dispatch(setCategoryFilter(e.target.value))}
              className="bg-transparent text-xs text-foreground font-medium focus:outline-none cursor-pointer"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c} className="bg-popover text-popover-foreground">
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/60 px-2.5 py-1 rounded-lg border border-border/60">
            <span className="font-medium text-[11px]">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => dispatch(setStatusFilter(e.target.value))}
              className="bg-transparent text-xs text-foreground font-medium focus:outline-none cursor-pointer"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s} className="bg-popover text-popover-foreground">
                  {s}
                </option>
              ))}
            </select>
          </div>

          {hasFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => dispatch(resetFilters())}
              className="h-8 text-xs text-muted-foreground hover:text-foreground gap-1 cursor-pointer"
            >
              <RotateCcw className="h-3 w-3" />
              Reset
            </Button>
          )}

          <div className="flex items-center gap-1.5 ml-auto sm:ml-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport('excel')}
              disabled={isExportingExcel || filteredData.length === 0}
              className="h-8 text-xs gap-1.5 cursor-pointer bg-background hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 dark:hover:bg-emerald-950/30 transition-colors"
            >
              {isExportingExcel ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" />
              )}
              <span>Excel</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport('pdf')}
              disabled={isExportingPdf || filteredData.length === 0}
              className="h-8 text-xs gap-1.5 cursor-pointer bg-background hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300 dark:hover:bg-rose-950/30 transition-colors"
            >
              {isExportingPdf ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <FileText className="h-3.5 w-3.5 text-rose-600" />
              )}
              <span>PDF</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="hidden sm:block rounded-xl border border-border/80 bg-card shadow-xs overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/40">
            {table.getHeaderGroups().map((group) => (
              <TableRow key={group.id} className="hover:bg-transparent">
                {group.headers.map((header) => (
                  <TableHead key={header.id} className="py-3 px-4 text-xs font-semibold text-muted-foreground">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {paginatedRows.length > 0 ? (
              paginatedRows.map((row) => (
                <TableRow
                  key={row.id}
                  className="hover:bg-muted/30 transition-colors border-b border-border/60"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3 px-4">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={orderColumns.length} className="h-32 text-center text-xs text-muted-foreground">
                  No orders match the selected filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="sm:hidden space-y-3">
        {paginatedRows.length > 0 ? (
          paginatedRows.map((row) => (
            <OrderMobileCard key={row.id} order={row.original} />
          ))
        ) : (
          <div className="rounded-xl border border-dashed p-8 text-center text-xs text-muted-foreground">
            No orders match the selected filters.
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2 text-xs text-muted-foreground">
        <div>
          Showing{' '}
          <span className="font-semibold text-foreground">
            {filteredData.length === 0 ? 0 : currentPage * pagination.pageSize + 1}
          </span>{' '}
          to{' '}
          <span className="font-semibold text-foreground">
            {Math.min((currentPage + 1) * pagination.pageSize, filteredData.length)}
          </span>{' '}
          of <span className="font-semibold text-foreground">{filteredData.length}</span> records
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px]">Rows:</span>
            <select
              value={pagination.pageSize}
              onChange={(e) => dispatch(setPageSize(Number(e.target.value)))}
              className="h-7 rounded-md border border-input bg-background px-1.5 text-xs text-foreground focus:outline-none cursor-pointer"
            >
              {[4, 6, 8, 12].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1">
            {[
              { icon: ChevronsLeft, action: () => dispatch(setPageIndex(0)), disabled: currentPage === 0, label: 'First' },
              { icon: ChevronLeft, action: () => dispatch(setPageIndex(currentPage - 1)), disabled: currentPage === 0, label: 'Prev' },
            ].map(({ icon: Icon, action, disabled, label }) => (
              <Button
                key={label}
                variant="outline"
                size="icon-xs"
                onClick={action}
                disabled={disabled}
                aria-label={label}
                className="cursor-pointer h-7 w-7"
              >
                <Icon className="h-3.5 w-3.5" />
              </Button>
            ))}

            <span className="px-2 text-xs font-semibold text-foreground">
              {currentPage + 1} / {pageCount}
            </span>

            {[
              { icon: ChevronRight, action: () => dispatch(setPageIndex(currentPage + 1)), disabled: currentPage >= pageCount - 1, label: 'Next' },
              { icon: ChevronsRight, action: () => dispatch(setPageIndex(pageCount - 1)), disabled: currentPage >= pageCount - 1, label: 'Last' },
            ].map(({ icon: Icon, action, disabled, label }) => (
              <Button
                key={label}
                variant="outline"
                size="icon-xs"
                onClick={action}
                disabled={disabled}
                aria-label={label}
                className="cursor-pointer h-7 w-7"
              >
                <Icon className="h-3.5 w-3.5" />
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
