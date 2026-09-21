import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { INITIAL_ORDERS } from '../data/mockOrders';
import type { TableState, TableColumnSort, TablePagination } from '@/types';

export type { TableState, TableColumnSort, TablePagination };

const initialState: TableState = {
  data: INITIAL_ORDERS,
  globalFilter: '',
  categoryFilter: 'All',
  statusFilter: 'All',
  sorting: [{ id: 'date', desc: true }],
  pagination: {
    pageIndex: 0,
    pageSize: 6,
  },
};

const tableSlice = createSlice({
  name: 'table',
  initialState,
  reducers: {
    setGlobalFilter: (state, action: PayloadAction<string>) => {
      state.globalFilter = action.payload;
      state.pagination.pageIndex = 0;
    },
    setCategoryFilter: (state, action: PayloadAction<string>) => {
      state.categoryFilter = action.payload;
      state.pagination.pageIndex = 0;
    },
    setStatusFilter: (state, action: PayloadAction<string>) => {
      state.statusFilter = action.payload;
      state.pagination.pageIndex = 0;
    },
    setSorting: (state, action: PayloadAction<TableColumnSort[]>) => {
      state.sorting = action.payload;
    },
    setPagination: (state, action: PayloadAction<TablePagination>) => {
      state.pagination = action.payload;
    },
    setPageIndex: (state, action: PayloadAction<number>) => {
      state.pagination.pageIndex = action.payload;
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pagination.pageSize = action.payload;
      state.pagination.pageIndex = 0;
    },
    resetFilters: (state) => {
      state.globalFilter = '';
      state.categoryFilter = 'All';
      state.statusFilter = 'All';
      state.pagination.pageIndex = 0;
    },
  },
});

export const {
  setGlobalFilter,
  setCategoryFilter,
  setStatusFilter,
  setSorting,
  setPagination,
  setPageIndex,
  setPageSize,
  resetFilters,
} = tableSlice.actions;

export default tableSlice.reducer;
