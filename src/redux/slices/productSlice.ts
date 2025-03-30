// features/products/productsSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from '../../utils/axiosInstance';

import { MRT_ColumnFiltersState, MRT_PaginationState, MRT_SortingState } from 'material-react-table';
import { Product } from '@/components/dashboard/products/products-table';
import { ProductIn, ProductOut } from '@/interfaces/productInterface';
import { AxiosResponse } from 'axios';


// Define the slice state type
interface ProductsState {
  products: any[];
  loading: boolean;
  error: string | null;
  totalCount: number, // Total number of products
  product: any | null;

  // UI state variables to be shared across controller and view
  refreshData: number;
  searchQuery: string;
  sorting: MRT_SortingState;
  pagination: MRT_PaginationState;
  columnFilters: MRT_ColumnFiltersState,
  rowCount: number;
}

// Define the initial state
const initialState: ProductsState = {
  products: [],
  loading: false,
  error: null,
  totalCount: 0, // Total number of products
  product: null,
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
const API_URL = `https://fruits-heaven-api.vercel.app/api/v1/product`;

// Fetch all products
export const fetchProducts = createAsyncThunk<
  { products: Product[]; totalCount: number }, // Return type with products and total count
  { id?: string, columnFilters: any, page: any, pageSize: any, sorting: any, globalFilter: any }, // Arguments
  { rejectValue: string }
>(
  'products/fetchProducts',
  async (params, { rejectWithValue }) => {
    try {
      const { page } = params;

      const url = new URL(API_URL);
      { params.globalFilter && url.searchParams.set('_id', params.globalFilter ?? '')}
      url.searchParams.set('deleted', 'false');
      {params.id && url.searchParams.set('company', params.id);}
      url.searchParams.set('PageCount', params.pageSize);
      url.searchParams.set('sort', "order");
      url.searchParams.set('page', page+1);
      if (params.columnFilters && params.columnFilters.length > 0) {
        params.columnFilters.forEach((filter: any) => {
          url.searchParams.append(filter.id, filter.value);
        });
      }
      { params.globalFilter && url.searchParams.set('_id', params.globalFilter ?? '')}
      { params.sorting && params.sorting.length > 0 && params.sorting.forEach((sort:any) => {
        url.searchParams.append('sort', sort.desc ? `-${sort.id}` : sort.id);
      });}
      const response = await axios.get(url.href);
      const { data, TotalCount } = response.data;
      return { products: data, totalCount: TotalCount };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to fetch products'
      );
    }
  }
);

// Add a new product
export const addProduct = createAsyncThunk<
  ProductIn, // Return type on success
  ProductOut, // Argument type (new product data without an id)
  { rejectValue: string }
>(
  "products/addProduct",
  async (productData, { rejectWithValue }) => {
    try {

      const response = await axios.post<ProductOut, AxiosResponse<{message: string, product: ProductIn}, any>>(API_URL, productData);
      return response.data.product;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to add product"
      );
    }
  }
);

// Update an existing product
export const updateProduct = createAsyncThunk<
  ProductIn, // Return type on success
  { id: string; updatedData: Partial<ProductOut> }, // Argument type
  { rejectValue: string }
>(
  'products/updateProduct',
  async ({ id, updatedData }, { rejectWithValue }) => {    
    try {
      console.log(updatedData.order)
      const response = await axios.put<ProductOut, AxiosResponse<{message: string, Product: ProductIn}, any>>(`${API_URL}/${id}`, updatedData);
      console.log(response.data.Product)
      return response.data.Product;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to update product'
      );
    }
  }
);

// Update an existing product
export const updateOrder = createAsyncThunk<
  string, // Return type on success
  { id: string; order: number }, // Argument type
  { rejectValue: string }
>(
  'products/updateOrder',
  async ({ id, order }, { rejectWithValue }) => {    
    try {
      console.log(order)
      const response = await axios.put<ProductOut, AxiosResponse<{message: string}, any>>(`${API_URL}/order/${id}`, {order: order});
      return response.data.message;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to update product'
      );
    }
  }
);

// Delete a product
export const deleteProduct = createAsyncThunk<
  string, // Return type: the id of the deleted product
  string, // Argument type: product id
  { rejectValue: string }
>(
  'products/deleteProduct',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to delete product'
      );
    }
  }
);

const productsSlice = createSlice({
    name: 'products',
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
      // Fetch products
      builder
        .addCase(fetchProducts.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchProducts.fulfilled, (state, action) => {
          state.loading = false;
          state.products = action.payload.products; // Store the products
          state.totalCount = action.payload.totalCount; // Store the total count
        })
        .addCase(fetchProducts.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload || 'Failed to fetch products';
        });
        
      // Add product
      builder
        .addCase(addProduct.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(addProduct.fulfilled, (state) => {
          state.loading = false;
        })
        .addCase(addProduct.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload || 'Failed to add product';
        });
        
      // Update product
      builder
        .addCase(updateProduct.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(updateProduct.fulfilled, (state, action: PayloadAction<ProductIn>) => {
          state.loading = false;
          const index = state.products.findIndex((product) => product._id === action.payload._id);
          if (index !== -1) {
            state.products[index] = action.payload;
          }
        })
        .addCase(updateProduct.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload || 'Failed to update product';
        });

      builder
        .addCase(updateOrder.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(updateOrder.fulfilled, (state) => {
          state.loading = false;
        })
        .addCase(updateOrder.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload || 'Failed to update order';
        });
        
      // Delete product
      builder
        .addCase(deleteProduct.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(deleteProduct.fulfilled, (state, action: PayloadAction<string>) => {
          state.loading = false;
          state.products = state.products.filter((product) => product._id !== action.payload);
        })
        .addCase(deleteProduct.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload || 'Failed to delete product';
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
} = productsSlice.actions;


  // Export the reducer to be used in the store
  export default productsSlice.reducer;
  