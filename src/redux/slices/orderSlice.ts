import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';
import { MRT_ColumnFiltersState, MRT_PaginationState, MRT_SortingState } from 'material-react-table';
import axios from '../../utils/axiosInstance';
import { OrderIn, OrderOut } from '@/interfaces/orderInterface';

// ------------------------
// Slice State Definition
// ------------------------

interface OrdersState {
  orders: OrderIn[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  refreshData: number;
  searchQuery: string;
  sorting: MRT_SortingState;
  pagination: MRT_PaginationState;
  columnFilters: MRT_ColumnFiltersState;
  rowCount: number;
  lastKnownCount: number | null;
}

const initialState: OrdersState = {
  orders: [],
  loading: false,
  error: null,
  totalCount: 0,
  refreshData: 0,
  searchQuery: '',
  sorting: [],
  pagination: {
    pageIndex: 0,
    pageSize: 10,
  },
  columnFilters: [],
  rowCount: 0,
  lastKnownCount: null,
};

const API_URL = `https://fruits-heaven-api.onrender.com/api/v1/order`;

// ------------------------
// Thunks
// ------------------------

// Fetch orders
export const fetchOrders = createAsyncThunk<
  { orders: OrderIn[]; totalCount: number },
  {
    id?: string;
    columnFilters: any;
    page: number;
    pageSize: number;
    sorting: any;
    globalFilter: string;
  },
  { rejectValue: string }
>('orders/fetchOrders', async (params, { rejectWithValue }) => {
  try {
    const { page, pageSize, columnFilters, sorting, globalFilter } = params;
    const url = new URL(API_URL);

    if (globalFilter) {
      url.searchParams.set('_id', globalFilter);
    }
    url.searchParams.set('PageCount', String(pageSize));
    url.searchParams.set('page', String(page + 1));

    if (columnFilters?.length > 0) {
      columnFilters.forEach((filter: any) => {
        url.searchParams.append(filter.id, filter.value);
      });
    }

    if (sorting?.length > 0) {
      sorting.forEach((sort: any) => {
        url.searchParams.append('sort', sort.desc ? `-${sort.id}` : sort.id);
      });
    } else {
      url.searchParams.append('sort', '-createdAt');
    }

    const response = await axios.get(url.href);
    const { data, TotalCount } = response.data;

    return { orders: data, totalCount: TotalCount };
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch orders');
  }
});

// Update order
export const updateOrder = createAsyncThunk<
  OrderIn,
  { id: string; updatedData: Partial<OrderOut> },
  { rejectValue: string }
>('orders/updateOrder', async ({ id, updatedData }, { rejectWithValue }) => {
  try {
    const response = await axios.patch<OrderOut, AxiosResponse<{ message: string; Order: OrderIn }>>(
      `${API_URL}/${id}`,
      updatedData
    );
    return response.data.Order;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message || 'Failed to update order');
  }
});

// Fetch order count
export const fetchOrderCount = createAsyncThunk<
  number,
  void,
  { rejectValue: string }
>('orders/fetchOrderCount', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${API_URL}/count`);
    return response.data.count;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch order count');
  }
});

// ------------------------
// Slice
// ------------------------

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
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
    setLastKnownCount: (state, action: PayloadAction<number>) => {
      state.lastKnownCount = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch orders';
      });

    builder
      .addCase(updateOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrder.fulfilled, (state, action: PayloadAction<OrderIn>) => {
        state.loading = false;
      })
      .addCase(updateOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update order';
      });

    builder
      .addCase(fetchOrderCount.fulfilled, (state, action: PayloadAction<number>) => {
        state.lastKnownCount = action.payload;
      });
  },
});

// ------------------------
// Exports
// ------------------------

export const {
  setRefreshData,
  setSearchQuery,
  setSorting,
  setPagination,
  setRowCount,
  setColumnFilters,
  setLastKnownCount,
} = ordersSlice.actions;

export default ordersSlice.reducer;
