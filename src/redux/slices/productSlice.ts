// features/products/productsSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from '../../utils/axiosInstance';

import { MRT_ColumnFiltersState, MRT_PaginationState, MRT_SortingState } from 'material-react-table';
import { Product } from '@/components/dashboard/products/products-table';


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
const API_URL = `${process.env.VITE_BASE_URL}product`;

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
  any, // Return type on success
  Product, // Argument type (new product data without an id)
  { rejectValue: string }
>(
  "products/addProduct",
  async (productData, { rejectWithValue }) => {
    try {
      const { _id, ...dataWithoutId } = productData;

      // Prepare the new product data
      const newProductData: Record<string, any> = {
        ...dataWithoutId,
        branch: "65e2c7f4d5a4c9b0f1a2d3e4", // Valid 24-character ObjectId
        size: "MD",  // At least 2 characters long
        color: "Black",
      };

      const response = await axios.post<Product>(API_URL, newProductData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to add product"
      );
    }
  }
);

// Fetch allcompanies
export const fetchProductById = createAsyncThunk<
  {product: Product;}, // Return type withcompanies and total count
  { id: string},
  { rejectValue: string }
>(
  'companies/fetchProductById',
  async (params, { rejectWithValue }) => {
    try {
      const url = new URL(`${API_URL}/${params.id}`);

      const response = await axios.get(url.href);

      const { product } = response.data;
      return {product: product };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to fetchcompanies'
      );
    }
  }
);

// Update an existing product
export const updateProduct = createAsyncThunk<
  Product, // Return type on success
  { id: number; updatedData: Partial<Product> }, // Argument type
  { rejectValue: string }
>(
  'products/updateProduct',
  async ({ id, updatedData }, { rejectWithValue }) => {    

    try {
      const { _id, ...dataWithoutId } = updatedData;

      // Prepare the new product data
      const newProductData: Record<string, any> = {
        ...dataWithoutId,
        branch: "65e2c7f4d5a4c9b0f1a2d3e4", // Valid 24-character ObjectId
        size: "MD",  // At least 2 characters long
        color: "Black",
      };

      const response = await axios.put<Product>(`${API_URL}/${id}`, newProductData);
      return response.data;
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
        
      // Fetch product by ID
      builder
        .addCase(fetchProductById.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchProductById.fulfilled, (state, action) => {
          state.loading = false;
          state.product = action.payload.product; // Store the product
        })
        .addCase(fetchProductById.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload || 'Failed to fetch product';
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
        .addCase(updateProduct.fulfilled, (state, action: PayloadAction<Product>) => {
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
  