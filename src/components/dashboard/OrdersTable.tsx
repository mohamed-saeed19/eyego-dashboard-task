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
import { OrderRecord } from '@/lib/data/mockOrders';
import { exportToExcel, exportToPDF } from '@/lib/exportUtils';
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
} from 'lucide-react';

const CATEGORIES = ['All', 'Electronics', 'Apparel', 'Home & Kitchen', 'Books', 'Fitness'] as const;
const STATUSES = ['All', 'Completed', 'Processing', 'Pending', 'Cancelled'] as const;

export function OrdersTable() {
  const dispatch = useAppDispatch();
  const { data, globalFilter, categoryFilter, statusFilter, sorting, pagination } =
    useAppSelector((state) => state.table);

  const [isExportingExcel, setIsExportingExcel] = React.useState(false);
  const [isExportingPdf, setIsExportingPdf] = React.useState(false);

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

  const handleExportExcel = async () => {
    try {
      setIsExportingExcel(true);
      await exportToExcel(filteredData, `orders-${new Date().toISOString().slice(0, 10)}.xlsx`);
    } catch {
      // ignore
    } finally {
      setIsExportingExcel(false);
    }
  };

  const handleExportPDF = async () => {
    try {
      setIsExportingPdf(true);
      await exportToPDF(filteredData, `orders-${new Date().toISOString().slice(0, 10)}.pdf`);
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
            className="-ml-3 h-8 font-semibold text-foreground hover:text-foreground"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Order #
            {column.getIsSorted() === 'asc' ? (
              <ArrowUp className="ml-1 h-3.5 w-3.5" />
            ) : column.getIsSorted() === 'desc' ? (
              <ArrowDown className="ml-1 h-3.5 w-3.5" />
            ) : (
              <ArrowUpDown className="ml-1 h-3.5 w-3.5 opacity-40" />
            )}
          </Button>
        ),
        cell: ({ row }) => (
          <span className="font-mono font-medium text-foreground">
            {row.getValue('orderNumber')}
          </span>
        ),
      },
      {
        accessorKey: 'customerName',
        header: ({ column }) => (
          <Button
            variant="ghost"
            size="sm"
            className="-ml-3 h-8 font-semibold text-foreground hover:text-foreground"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Customer
            {column.getIsSorted() === 'asc' ? (
              <ArrowUp className="ml-1 h-3.5 w-3.5" />
            ) : column.getIsSorted() === 'desc' ? (
              <ArrowDown className="ml-1 h-3.5 w-3.5" />
            ) : (
              <ArrowUpDown className="ml-1 h-3.5 w-3.5 opacity-40" />
            )}
          </Button>
        ),
        cell: ({ row }) => (
          <div>
            <div className="font-medium text-foreground">{row.original.customerName}</div>
            <div className="text-xs text-muted-foreground">{row.original.customerEmail}</div>
          </div>
        ),
      },
      {
        accessorKey: 'category',
        header: 'Category',
        cell: ({ row }) => (
          <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
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
              className="-mr-3 h-8 font-semibold text-foreground hover:text-foreground"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
              Amount
              {column.getIsSorted() === 'asc' ? (
                <ArrowUp className="ml-1 h-3.5 w-3.5" />
              ) : column.getIsSorted() === 'desc' ? (
                <ArrowDown className="ml-1 h-3.5 w-3.5" />
              ) : (
                <ArrowUpDown className="ml-1 h-3.5 w-3.5 opacity-40" />
              )}
            </Button>
          </div>
        ),
        cell: ({ row }) => {
          const amount = parseFloat(row.getValue('amount'));
          const formatted = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
          }).format(amount);
          return <div className="text-right font-medium text-foreground">{formatted}</div>;
        },
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
          const status = row.getValue('status') as OrderRecord['status'];
          const colorMap: Record<OrderRecord['status'], string> = {
            Completed: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
            Processing: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20',
            Pending: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
            Cancelled: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
          };
          return (
            <span
              className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${colorMap[status]}`}
            >
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
            className="-ml-3 h-8 font-semibold text-foreground hover:text-foreground"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Date
            {column.getIsSorted() === 'asc' ? (
              <ArrowUp className="ml-1 h-3.5 w-3.5" />
            ) : column.getIsSorted() === 'desc' ? (
              <ArrowDown className="ml-1 h-3.5 w-3.5" />
            ) : (
              <ArrowUpDown className="ml-1 h-3.5 w-3.5 opacity-40" />
            )}
          </Button>
        ),
        cell: ({ row }) => <span className="text-muted-foreground">{row.getValue('date')}</span>,
      },
      {
        accessorKey: 'country',
        header: 'Country',
        cell: ({ row }) => <span className="text-muted-foreground">{row.getValue('country')}</span>,
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

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search by order, customer, country..."
            value={globalFilter}
            onChange={(e) => dispatch(setGlobalFilter(e.target.value))}
            className="pl-9 h-9"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Filter className="h-3.5 w-3.5" />
            <span>Category:</span>
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => dispatch(setCategoryFilter(e.target.value))}
            className="h-9 rounded-md border border-input bg-background px-2.5 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-1.5 text-xs text-muted-foreground ml-2">
            <span>Status:</span>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => dispatch(setStatusFilter(e.target.value))}
            className="h-9 rounded-md border border-input bg-background px-2.5 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          >
            {STATUSES.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>

          {(globalFilter || categoryFilter !== 'All' || statusFilter !== 'All') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => dispatch(resetFilters())}
              className="h-9 text-xs text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="mr-1 h-3.5 w-3.5" />
              Reset
            </Button>
          )}

          <div className="flex items-center gap-1.5 ml-auto sm:ml-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportExcel}
              disabled={isExportingExcel || filteredData.length === 0}
              className="h-9 text-xs gap-1.5 cursor-pointer"
            >
              {isExportingExcel ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              )}
              <span>Excel</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleExportPDF}
              disabled={isExportingPdf || filteredData.length === 0}
              className="h-9 text-xs gap-1.5 cursor-pointer"
            >
              {isExportingPdf ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <FileText className="h-3.5 w-3.5 text-rose-600 dark:text-rose-400" />
              )}
              <span>PDF</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="hidden sm:block rounded-xl border border-border/80 bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="py-3 px-4">
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
                <TableRow key={row.id} className="hover:bg-muted/40 transition-colors">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3 px-4">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-32 text-center text-muted-foreground">
                  No orders found matching the filter criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="sm:hidden space-y-3">
        {paginatedRows.length > 0 ? (
          paginatedRows.map((row) => (
            <Card key={row.id} className="p-4 shadow-sm border-border/70">
              <div className="flex items-center justify-between border-b pb-2 mb-2">
                <span className="font-mono text-sm font-semibold">{row.original.orderNumber}</span>
                <span
                  className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${
                    row.original.status === 'Completed'
                      ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                      : row.original.status === 'Processing'
                      ? 'bg-sky-500/10 text-sky-600 border-sky-500/20'
                      : row.original.status === 'Pending'
                      ? 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                      : 'bg-rose-500/10 text-rose-600 border-rose-500/20'
                  }`}
                >
                  {row.original.status}
                </span>
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Customer:</span>
                  <span className="font-medium text-foreground">{row.original.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Category:</span>
                  <span className="font-medium text-foreground">{row.original.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Country:</span>
                  <span className="font-medium text-foreground">{row.original.country}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date:</span>
                  <span className="font-medium text-foreground">{row.original.date}</span>
                </div>
                <div className="flex justify-between pt-1 border-t mt-2">
                  <span className="font-medium text-foreground">Amount:</span>
                  <span className="font-bold text-foreground">
                    ${row.original.amount.toFixed(2)}
                  </span>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
            No orders found matching the filter criteria.
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-1 text-xs text-muted-foreground">
        <div>
          Showing{' '}
          <span className="font-medium text-foreground">
            {filteredData.length === 0 ? 0 : currentPage * pagination.pageSize + 1}
          </span>{' '}
          to{' '}
          <span className="font-medium text-foreground">
            {Math.min((currentPage + 1) * pagination.pageSize, filteredData.length)}
          </span>{' '}
          of <span className="font-medium text-foreground">{filteredData.length}</span> orders
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <span>Rows:</span>
            <select
              value={pagination.pageSize}
              onChange={(e) => dispatch(setPageSize(Number(e.target.value)))}
              className="h-7 rounded border border-input bg-background px-1 text-xs text-foreground focus:outline-none"
            >
              {[4, 6, 8, 12].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1 ml-2">
            <Button
              variant="outline"
              size="icon-xs"
              onClick={() => dispatch(setPageIndex(0))}
              disabled={currentPage === 0}
              aria-label="First page"
            >
              <ChevronsLeft className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon-xs"
              onClick={() => dispatch(setPageIndex(currentPage - 1))}
              disabled={currentPage === 0}
              aria-label="Previous page"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
            <span className="px-2 text-foreground font-medium">
              {currentPage + 1} / {pageCount}
            </span>
            <Button
              variant="outline"
              size="icon-xs"
              onClick={() => dispatch(setPageIndex(currentPage + 1))}
              disabled={currentPage >= pageCount - 1}
              aria-label="Next page"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon-xs"
              onClick={() => dispatch(setPageIndex(pageCount - 1))}
              disabled={currentPage >= pageCount - 1}
              aria-label="Last page"
            >
              <ChevronsRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
