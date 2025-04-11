// features/orders/ordersSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from '../../utils/axiosInstance';

import { MRT_ColumnFiltersState, MRT_PaginationState, MRT_SortingState } from 'material-react-table';
import { OrderIn, OrderOut } from '@/interfaces/orderInterface';
import { AxiosResponse } from 'axios';


// Define the slice state type
interface OrdersState {
  orders: OrderIn[];
  loading: boolean;
  error: string | null;
  totalCount: number, // Total number of orders

  // UI state variables to be shared across controller and view
  refreshData: number;
  searchQuery: string;
  sorting: MRT_SortingState;
  pagination: MRT_PaginationState;
  columnFilters: MRT_ColumnFiltersState,
  rowCount: number;
}

// Define the initial state
const initialState: OrdersState = {
  orders: [],
  loading: false,
  error: null,
  totalCount: 0, // Total number of orders
  // Initialize your UI state variables
  refreshData: 0,
  searchQuery: '',
  sorting: [],
  pagination: {
    pageIndex: 0,
    pageSize: 10,
  },
  rowCount: 0,
  columnFilters: [],
};

// Define the base URL for your API endpoint (adjust as needed)
const API_URL = `https://fruits-heaven-api.vercel.app/api/v1/order`;

// Fetch all orders
export const fetchOrders = createAsyncThunk<
  { orders: OrderIn[]; totalCount: number }, // Return type with orders and total count
  { id?: string, columnFilters: any, page: any, pageSize: any, sorting: any, globalFilter: any }, // Arguments
  { rejectValue: string }
>(
  'orders/fetchOrders',
  async (params, { rejectWithValue }) => {
    try {
      const { page } = params;

      const url = new URL(API_URL);
      { params.globalFilter && url.searchParams.set('_id', params.globalFilter ?? '')}
      url.searchParams.set('PageCount', params.pageSize);
      url.searchParams.set('page', page+1);
      if (params.columnFilters && params.columnFilters.length > 0) {
        params.columnFilters.forEach((filter: any) => {
          url.searchParams.append(filter.id, filter.value);
        });
      }
      { params.sorting && params.sorting.length > 0 && params.sorting.forEach((sort:any) => {
        url.searchParams.append('sort', sort.desc ? `-${sort.id}` : sort.id);
      });}
      const response = await axios.get(url.href);
      const { data, TotalCount } = response.data;
      return { orders: data, totalCount: TotalCount };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to fetch orders'
      );
    }
  }
);


// Update an existing order
export const updateOrder = createAsyncThunk<
  OrderIn, // Return type on success
  { id: string; updatedData: Partial<OrderOut> }, // Argument type
  { rejectValue: string }
>(
  'orders/updateOrder',
  async ({ id, updatedData }, { rejectWithValue }) => {    
    try {
      const response = await axios.patch<OrderOut, AxiosResponse<{message: string, Order: OrderIn}, any>>(`${API_URL}/${id}`, updatedData);
      console.log(response.data.Order)
      return response.data.Order;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to update order'
      );
    }
  }
);


const ordersSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
      // Reducers to update UI state variables
      setRefreshData: (state, action: PayloadAction<number>) => {
        state.refreshData = action.payload;
      },
      setSearchQuery: (state, action: PayloadAction<string>) => {
        state.searchQuery = action.payload;
      },
      setSorting: (state, action: PayloadAction<MRT_SortingState>) => {
        state.sorting = action.payload;
      },
      setPagination: (state, action: PayloadAction<MRT_PaginationState>) => {
        state.pagination = action.payload;
      },
      setRowCount: (state, action: PayloadAction<number>) => {
        state.rowCount = action.payload;
      },
      setColumnFilters: (state, action: PayloadAction<MRT_ColumnFiltersState>) => {
        state.columnFilters = action.payload;
      },
    },
    
    extraReducers: (builder) => {
      // Fetch orders
      builder
        .addCase(fetchOrders.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchOrders.fulfilled, (state, action) => {
          state.loading = false;
          state.orders = action.payload.orders; // Store the orders
          state.totalCount = action.payload.totalCount; // Store the total count
        })
        .addCase(fetchOrders.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload || 'Failed to fetch orders';
        });
        
      // Update order
      builder
        .addCase(updateOrder.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(updateOrder.fulfilled, (state, action: PayloadAction<OrderIn>) => {
          state.loading = false;
          const index = state.orders.findIndex((order) => order._id === action.payload._id);
          if (index !== -1) {
            state.orders[index] = action.payload;
          }
        })
        .addCase(updateOrder.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload || 'Failed to update order';
        });
    },
  });
  
  // Export the UI actions so that you can dispatch them from your components
export const {
  setRefreshData,
  setSearchQuery,
  setSorting,
  setPagination,
  setRowCount,
  setColumnFilters
} = ordersSlice.actions;


  // Export the reducer to be used in the store
  export default ordersSlice.reducer;
  