import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { INITIAL_ORDERS, OrderRecord } from '../data/mockOrders';

export interface TableState {
  data: OrderRecord[];
  globalFilter: string;
  categoryFilter: string;
  statusFilter: string;
  sorting: {
    id: string;
    desc: boolean;
  }[];
  pagination: {
    pageIndex: number;
    pageSize: number;
  };
}

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
    setSorting: (
      state,
      action: PayloadAction<{ id: string; desc: boolean }[]>
    ) => {
      state.sorting = action.payload;
    },
    setPagination: (
      state,
      action: PayloadAction<{ pageIndex: number; pageSize: number }>
    ) => {
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
