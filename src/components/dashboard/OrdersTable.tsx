'use client';

import * as React from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  SortingState,
  PaginationState,
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
import type { OrderRecord, OrderStatus, OrderCategory } from '@/types';
import { exportToExcel, exportToPDF } from '@/lib/exportUtils';
import { filterOrders, formatCurrency, getStatusBadgeStyles } from '@/lib/utils';
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
import { Card } from '@/components/ui/card';
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
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
  CreditCard,
  User,
  Calendar,
  Globe,
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

  const filteredData = React.useMemo(() => {
    return filterOrders(data, {
      global: globalFilter,
      category: categoryFilter,
      status: statusFilter,
    });
  }, [data, globalFilter, categoryFilter, statusFilter]);

  const handleExportExcel = async () => {
    try {
      setIsExportingExcel(true);
      await exportToExcel(
        filteredData,
        `eyego-orders-${new Date().toISOString().slice(0, 10)}.xlsx`
      );
    } catch {
      // ignore
    } finally {
      setIsExportingExcel(false);
    }
  };

  const handleExportPDF = async () => {
    try {
      setIsExportingPdf(true);
      await exportToPDF(
        filteredData,
        `eyego-orders-${new Date().toISOString().slice(0, 10)}.pdf`
      );
    } catch {
      // ignore
    } finally {
      setIsExportingPdf(false);
    }
  };

  const columns = React.useMemo<ColumnDef<OrderRecord>[]>(
    () => [
      {
        accessorKey: 'orderNumber',
        header: ({ column }) => (
          <Button
            variant="ghost"
            size="sm"
            className="-ml-3 h-8 text-xs font-semibold text-foreground hover:bg-muted/80"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Order #
            {column.getIsSorted() === 'asc' ? (
              <ArrowUp className="ml-1 h-3.5 w-3.5 text-primary" />
            ) : column.getIsSorted() === 'desc' ? (
              <ArrowDown className="ml-1 h-3.5 w-3.5 text-primary" />
            ) : (
              <ArrowUpDown className="ml-1 h-3.5 w-3.5 opacity-40" />
            )}
          </Button>
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-semibold text-primary">
              {row.getValue('orderNumber')}
            </span>
          </div>
        ),
      },
      {
        accessorKey: 'customerName',
        header: ({ column }) => (
          <Button
            variant="ghost"
            size="sm"
            className="-ml-3 h-8 text-xs font-semibold text-foreground hover:bg-muted/80"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Customer
            {column.getIsSorted() === 'asc' ? (
              <ArrowUp className="ml-1 h-3.5 w-3.5 text-primary" />
            ) : column.getIsSorted() === 'desc' ? (
              <ArrowDown className="ml-1 h-3.5 w-3.5 text-primary" />
            ) : (
              <ArrowUpDown className="ml-1 h-3.5 w-3.5 opacity-40" />
            )}
          </Button>
        ),
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
        header: ({ column }) => (
          <div className="text-right">
            <Button
              variant="ghost"
              size="sm"
              className="-mr-3 h-8 text-xs font-semibold text-foreground hover:bg-muted/80"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
              Amount
              {column.getIsSorted() === 'asc' ? (
                <ArrowUp className="ml-1 h-3.5 w-3.5 text-primary" />
              ) : column.getIsSorted() === 'desc' ? (
                <ArrowDown className="ml-1 h-3.5 w-3.5 text-primary" />
              ) : (
                <ArrowUpDown className="ml-1 h-3.5 w-3.5 opacity-40" />
              )}
            </Button>
          </div>
        ),
        cell: ({ row }) => {
          const amount = parseFloat(row.getValue('amount'));
          return (
            <div className="text-right font-semibold text-xs text-foreground">
              {formatCurrency(amount)}
            </div>
          );
        },
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
        header: ({ column }) => (
          <Button
            variant="ghost"
            size="sm"
            className="-ml-3 h-8 text-xs font-semibold text-foreground hover:bg-muted/80"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Date
            {column.getIsSorted() === 'asc' ? (
              <ArrowUp className="ml-1 h-3.5 w-3.5 text-primary" />
            ) : column.getIsSorted() === 'desc' ? (
              <ArrowDown className="ml-1 h-3.5 w-3.5 text-primary" />
            ) : (
              <ArrowUpDown className="ml-1 h-3.5 w-3.5 opacity-40" />
            )}
          </Button>
        ),
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
    ],
    []
  );

  const tableSorting: SortingState = sorting;
  const tablePagination: PaginationState = pagination;

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting: tableSorting,
      pagination: tablePagination,
    },
    onSortingChange: (updater) => {
      const newSorting =
        typeof updater === 'function' ? updater(tableSorting) : updater;
      dispatch(setSorting(newSorting));
    },
    onPaginationChange: (updater) => {
      const newPagination =
        typeof updater === 'function' ? updater(tablePagination) : updater;
      dispatch(setPageIndex(newPagination.pageIndex));
      dispatch(setPageSize(newPagination.pageSize));
    },
    getCoreRowModel: getCoreRowModel(),
    manualPagination: false,
    autoResetPageIndex: false,
  });

  const pageCount = Math.max(1, Math.ceil(filteredData.length / pagination.pageSize));
  const currentPage = Math.min(pagination.pageIndex, pageCount - 1);

  const sortedRows = table.getRowModel().rows;
  const paginatedRows = sortedRows.slice(
    currentPage * pagination.pageSize,
    (currentPage + 1) * pagination.pageSize
  );

  const hasActiveFilters = Boolean(
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
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat} className="bg-popover text-popover-foreground">
                  {cat}
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
              {STATUSES.map((st) => (
                <option key={st} value={st} className="bg-popover text-popover-foreground">
                  {st}
                </option>
              ))}
            </select>
          </div>

          {hasActiveFilters && (
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
              onClick={handleExportExcel}
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
              onClick={handleExportPDF}
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
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="py-3 px-4 text-xs font-semibold text-muted-foreground">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
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
                <TableCell colSpan={columns.length} className="h-32 text-center text-xs text-muted-foreground">
                  No orders match the selected filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="sm:hidden space-y-3">
        {paginatedRows.length > 0 ? (
          paginatedRows.map((row) => {
            const styles = getStatusBadgeStyles(row.original.status);
            return (
              <Card key={row.id} className="p-4 shadow-sm border-border/80 bg-card space-y-3">
                <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
                  <span className="font-mono text-xs font-bold text-primary">
                    {row.original.orderNumber}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium ${styles.badge}`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${styles.dot}`} />
                    {row.original.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <User className="h-3.5 w-3.5 text-muted-foreground/70 shrink-0" />
                    <span className="truncate text-foreground font-medium">
                      {row.original.customerName}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Globe className="h-3.5 w-3.5 text-muted-foreground/70 shrink-0" />
                    <span className="truncate">{row.original.country}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground/70 shrink-0" />
                    <span>{row.original.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                      {row.original.category}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border/60">
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <CreditCard className="h-3 w-3" />
                    Total
                  </span>
                  <span className="font-bold text-sm text-foreground">
                    {formatCurrency(row.original.amount)}
                  </span>
                </div>
              </Card>
            );
          })
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
              {[4, 6, 8, 12].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon-xs"
              onClick={() => dispatch(setPageIndex(0))}
              disabled={currentPage === 0}
              aria-label="First page"
              className="cursor-pointer h-7 w-7"
            >
              <ChevronsLeft className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon-xs"
              onClick={() => dispatch(setPageIndex(currentPage - 1))}
              disabled={currentPage === 0}
              aria-label="Previous page"
              className="cursor-pointer h-7 w-7"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
            <span className="px-2 text-xs font-semibold text-foreground">
              {currentPage + 1} / {pageCount}
            </span>
            <Button
              variant="outline"
              size="icon-xs"
              onClick={() => dispatch(setPageIndex(currentPage + 1))}
              disabled={currentPage >= pageCount - 1}
              aria-label="Next page"
              className="cursor-pointer h-7 w-7"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon-xs"
              onClick={() => dispatch(setPageIndex(pageCount - 1))}
              disabled={currentPage >= pageCount - 1}
              aria-label="Last page"
              className="cursor-pointer h-7 w-7"
            >
              <ChevronsRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
