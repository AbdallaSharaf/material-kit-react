// features/customers/customersSlice.ts

import { CustomerIn } from '@/interfaces/customerInterface';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';
import { MRT_ColumnFiltersState, MRT_PaginationState, MRT_SortingState } from 'material-react-table';

import axios from '../../utils/axiosInstance';

// Define the slice state type
interface CustomersState {
  customers: CustomerIn[];
  loading: boolean;
  error: string | null;
  totalCount: number; // Total number of customers

  // UI state variables to be shared across controller and view
  searchQuery: string;
  sorting: MRT_SortingState;
  pagination: MRT_PaginationState;
  columnFilters: MRT_ColumnFiltersState;
  rowCount: number;
}

// Define the initial state
const initialState: CustomersState = {
  customers: [],
  loading: false,
  error: null,
  totalCount: 0, // Total number of customers
  // Initialize your UI state variables
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
const API_URL = `https://fruits-heaven-api.onrender.com/api/v1/user`;

// Fetch all customers
export const fetchCustomers = createAsyncThunk<
  { customers: CustomerIn[]; totalCount: number }, // Return type with customers and total count
  { id?: string; columnFilters: any; page: any; pageSize: any; sorting: any; globalFilter: any }, // Arguments
  { rejectValue: string }
>('customers/fetchCustomers', async (params, { rejectWithValue }) => {
  try {
    const { page } = params;

    const url = new URL(API_URL);
    {
      params.globalFilter && url.searchParams.set('name', params.globalFilter ?? '');
    }
    url.searchParams.set('deleted', 'false');
    url.searchParams.set('PageCount', params.pageSize);
    url.searchParams.set('page', page + 1);
    if (params.columnFilters && params.columnFilters.length > 0) {
      params.columnFilters.forEach((filter: any) => {
        url.searchParams.append(filter.id, filter.value);
      });
    }
    {
        (params.sorting &&
        params.sorting.length > 0 ) ? 
        params.sorting.forEach((sort: any) => {
            url.searchParams.append('sort', sort.desc ? `-${sort.id}` : sort.id);
    }): url.searchParams.append('sort', '-createdAt');
    }
    const response = await axios.get(url.href);
    console.log(response)
    const { data, TotalCount } = response.data;
    return { customers: data, totalCount: TotalCount };
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch customers');
  }
});

const customersSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
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
    // Fetch customers
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = action.payload.customers; // Store the customers
        state.totalCount = action.payload.totalCount; // Store the total count
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch customers';
      });
  },
});

// Export the UI actions so that you can dispatch them from your components
export const { setSearchQuery, setSorting, setPagination, setRowCount, setColumnFilters } =
  customersSlice.actions;

// Export the reducer to be used in the store
export default customersSlice.reducer;
