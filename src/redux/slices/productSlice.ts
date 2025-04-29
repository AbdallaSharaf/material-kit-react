// features/products/productsSlice.ts

import { ProductIn, ProductOut } from '@/interfaces/productInterface';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';
import { MRT_ColumnFiltersState, MRT_PaginationState, MRT_SortingState } from 'material-react-table';

import axios from '../../utils/axiosInstance';

// Define the slice state type
interface ProductsState {
  products: ProductIn[];
  productsByCategory: ProductIn[];
  topProducts: ProductIn[];
  loading: boolean;
  error: string | null;
  totalCount: number; // Total number of products
  product: ProductIn | null;

  // UI state variables to be shared across controller and view
  refreshData: number;
  searchQuery: string;
  sorting: MRT_SortingState;
  pagination: MRT_PaginationState;
  columnFilters: MRT_ColumnFiltersState;
  rowCount: number;
}

// Define the initial state
const initialState: ProductsState = {
  products: [],
  productsByCategory: [],
  topProducts: [],
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
const API_URL = `https://fruits-heaven-api.onrender.com/api/v1/product`;

// Fetch all products
export const fetchProducts = createAsyncThunk<
  { products: ProductIn[]; totalCount: number }, // Return type with products and total count
  { id?: string; columnFilters: any; page: any; pageSize: any; sorting: any; globalFilter: any }, // Arguments
  { rejectValue: string }
>('products/fetchProducts', async (params, { rejectWithValue }) => {
  try {
    const { page } = params;

    const url = new URL(API_URL);
    {
      params.globalFilter && url.searchParams.set('_id', params.globalFilter ?? '');
    }
    url.searchParams.set('deleted', 'false');
    url.searchParams.set('PageCount', params.pageSize);
    url.searchParams.set('sort', 'order');
    url.searchParams.set('page', page + 1);
    if (params.columnFilters && params.columnFilters.length > 0) {
      params.columnFilters.forEach((filter: any) => {
        url.searchParams.append(filter.id, filter.value);
      });
    }
    {
      params.sorting &&
        params.sorting.length > 0 &&
        params.sorting.forEach((sort: any) => {
          url.searchParams.append('sort', sort.desc ? `-${sort.id}` : sort.id);
        });
    }
    const response = await axios.get(url.href);
    const { data, TotalCount } = response.data;
    return { products: data, totalCount: TotalCount };
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch products');
  }
});

// Fetch all products
export const fetchTopProducts = createAsyncThunk<
  { topProducts: ProductIn[] }, // Return type with products and total count
  void, // Arguments
  { rejectValue: string }
>('products/fetchTopProducts', async (_, { rejectWithValue }) => {
  try {
    console.log('Fetching top products');
    const url = new URL(API_URL);
    url.searchParams.set('deleted', 'false');
    url.searchParams.set('PageCount', '100');
    url.searchParams.set('isTopProduct', 'true');
    url.searchParams.set('sort', 'order');
    url.searchParams.set('page', '1');
    const response = await axios.get(url.href);
    const { data } = response.data;
    return { topProducts: data };
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch products');
  }
});

// Fetch all products
export const fetchProductsByCategory = createAsyncThunk<
  { products: ProductIn[]; totalCount: number }, // Return type with products and total count
  { id?: string; columnFilters: any; page: any; pageSize: any; sorting: any; globalFilter: any }, // Arguments
  { rejectValue: string }
>('products/fetchProductsByCategory', async (params, { rejectWithValue }) => {
  try {
    const { page } = params;
    const url = new URL(`${API_URL}/category/${params.id}`);
    url.searchParams.set('deleted', 'false');
    url.searchParams.set('PageCount', params.pageSize);
    // url.searchParams.set('sort', "order");
    url.searchParams.set('page', page + 1);
    if (params.columnFilters && params.columnFilters.length > 0) {
      params.columnFilters.forEach((filter: any) => {
        url.searchParams.append(filter.id, filter.value);
      });
    }
    {
      params.globalFilter && url.searchParams.set('_id', params.globalFilter ?? '');
    }
    {
      params.sorting &&
        params.sorting.length > 0 &&
        params.sorting.forEach((sort: any) => {
          url.searchParams.append('sort', sort.desc ? `-${sort.id}` : sort.id);
        });
    }
    const response = await axios.get(url.href);
    const { products, TotalCount } = response.data;
    return { products: products, totalCount: TotalCount };
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch products');
  }
});

// Add a new product
export const addProduct = createAsyncThunk<
  ProductIn, // Return type on success
  ProductOut, // Argument type (new product data without an id)
  { rejectValue: string }
>('products/addProduct', async (productData, { rejectWithValue }) => {
  try {
    const response = await axios.post<ProductOut, AxiosResponse<{ message: string; product: ProductIn }, any>>(
      API_URL,
      productData
    );
    return response.data.product;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message || 'Failed to add product');
  }
});

// Update an existing product
export const updateProduct = createAsyncThunk<
  ProductIn, // Return type on success
  { id: string; updatedData: Partial<ProductOut> }, // Argument type
  { rejectValue: string }
>('products/updateProduct', async ({ id, updatedData }, { rejectWithValue }) => {
  try {
    const response = await axios.put<ProductOut, AxiosResponse<{ message: string; Product: ProductIn }, any>>(
      `${API_URL}/${id}`,
      updatedData
    );
    // console.log(response.data.Product)
    return response.data.Product;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message || 'Failed to update product');
  }
});

// Update an existing product
export const updateProductOrder = createAsyncThunk<
  string, // Return type on success
  { id: string; order: number }, // Argument type
  { rejectValue: string }
>('products/updateProductOrder', async ({ id, order }, { rejectWithValue }) => {
  try {
    const response = await axios.put<ProductOut, AxiosResponse<{ message: string }, any>>(`${API_URL}/order/${id}`, {
      order: order,
    });
    return response.data.message;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message || 'Failed to update product');
  }
});

// Update an existing product
export const updateProductOrderInCategory = createAsyncThunk<
  string, // Return type on success
  { id: string; order: number; category: string }, // Argument type
  { rejectValue: string }
>('products/updateProductOrderInCategory', async ({ id, order, category }, { rejectWithValue }) => {
  try {
    console.log(id);
    const response = await axios.put<ProductOut, AxiosResponse<{ message: string }, any>>(`${API_URL}/category/${id}`, {
      order: order,
      Category: category,
    });
    return response.data.message;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message || 'Failed to update product');
  }
});

// Delete a product
export const deleteProduct = createAsyncThunk<
  string, // Return type: the id of the deleted product
  string, // Argument type: product id
  { rejectValue: string }
>('products/deleteProduct', async (id, { rejectWithValue }) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
    return id;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message || 'Failed to delete product');
  }
});

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

    builder
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.productsByCategory = action.payload.products; // Store the products
        state.totalCount = action.payload.totalCount; // Store the total count
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch products';
      });

    builder
      .addCase(fetchTopProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTopProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.topProducts = action.payload.topProducts; // Store the products
      })
      .addCase(fetchTopProducts.rejected, (state, action) => {
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
      .addCase(updateProductOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProductOrder.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateProductOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update order';
      });

    builder
      .addCase(updateProductOrderInCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProductOrderInCategory.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateProductOrderInCategory.rejected, (state, action) => {
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
export const { setRefreshData, setSearchQuery, setSorting, setPagination, setRowCount, setColumnFilters } =
  productsSlice.actions;

// Export the reducer to be used in the store
export default productsSlice.reducer;
