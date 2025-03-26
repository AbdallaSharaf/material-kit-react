// features/categories/categoriesSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from '../../utils/axiosInstance';
import { CategoryIn, CategoryOut } from '../../interfaces/categoryInterface';
import { AxiosResponse } from 'axios';

// Define the slice state type
interface CategoriesState {
  categories: CategoryIn[];
  loading: boolean;
  error: string | null;

  // UI state variables to be shared across controller and view
  refreshData: number;
}

// Define the initial state
const initialState: CategoriesState = {
  categories: [],
  loading: false,
  error: null,

  // Initialize your UI state variables
  refreshData: 0,
};

// Define the base URL for your API endpoint (adjust as needed)
const API_URL = `https://fruits-heaven-api.vercel.app/api/v1/category`;
// const API_URL = `${process.env.NEXT_PUBLIC_API_URL}category`;
// Fetch all categories
export const fetchCategories = createAsyncThunk<
  CategoryIn[], // Return type with categories and total count
  void, // Arguments
  { rejectValue: string }
>(
  'categories/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const url = new URL(API_URL);

      url.searchParams.set('deleted', 'false');
      url.searchParams.set('page', `1`);
      url.searchParams.set('PageCount', "1000");
      const response = await axios.get(url.href);
      const { data } = response.data;
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to fetch categories'
      );
    }
  }
);

// Add a new caCategory
export const addCategory = createAsyncThunk<
CategoryIn,
CategoryOut,
  { rejectValue: string }
>(
  'categories/addCategory',
  async (categoryData, { rejectWithValue }) => {
      try {

    const transformedData: CategoryOut = {
      name: {ar: categoryData.name?.ar, en: categoryData.name?.en},
      description: {ar: categoryData.description?.ar, en: categoryData.description?.en},
      order: categoryData.order,
      available: categoryData.available
    }

    const response = await axios.post<CategoryOut, AxiosResponse<{message: string, category: CategoryIn}, any>>(API_URL, transformedData);
      return response.data.category;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to add caCategory'
      );
    }
  }
);

// Update an existing caCategory
export const updateCategory = createAsyncThunk<
  CategoryIn,
  { id: string; updatedData: Partial<CategoryOut> }, // Argument type
  { rejectValue: string }
>(
  'categories/updateCategory',
  async ({ id, updatedData }, { rejectWithValue }) => {
    
    const transformedData: CategoryOut = {
      name: {ar: updatedData.name?.ar, en: updatedData.name?.en},
      description: {ar: updatedData.description?.ar, en: updatedData.description?.en},
      order: updatedData.order,
      available: updatedData.available
    }

    try {
      const response = await axios.put<CategoryOut, AxiosResponse<{message: string, category: CategoryIn}, any>>(`${API_URL}/${id}`, transformedData);
      return response.data.category;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to update caCategory'
      );
    }
  }
);

// Delete a caCategory
export const deleteCategory = createAsyncThunk<
  string, // Return type: the id of the deleted caCategory
  string, // Argument type: caCategory id
  { rejectValue: string }
>(
  'categories/deleteCategory',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to delete caCategory'
      );
    }
  }
);

const categoriesSlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {
      setRefreshData: (state, action: PayloadAction<number>) => {
        state.refreshData = action.payload;
      },
    },
    
    extraReducers: (builder) => {
      // Fetch categories
      builder
        .addCase(fetchCategories.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchCategories.fulfilled, (state, action) => {
          state.loading = false;
          state.categories = action.payload; // Store the categories
        })
        .addCase(fetchCategories.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload || 'Failed to fetch categories';
        });
        
      // Add caCategory
      builder
        .addCase(addCategory.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(addCategory.fulfilled, (state) => {
          state.loading = false;
        })
        .addCase(addCategory.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload || 'Failed to add caCategory';
        });
        
      // Update caCategory
      builder
        .addCase(updateCategory.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(updateCategory.fulfilled, (state, action: PayloadAction<CategoryIn>) => {
          state.loading = false;
          const index = state.categories.findIndex((z) => z._id === action.payload._id);
          if (index !== -1) {
            state.categories[index] = action.payload;
          }
        })
        .addCase(updateCategory.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload || 'Failed to update caCategory';
        });
        
      // Delete caCategory
      builder
        .addCase(deleteCategory.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(deleteCategory.fulfilled, (state, action: PayloadAction<string>) => {
          state.loading = false;
          state.categories = state.categories.filter((z) => z._id !== action.payload);
        })
        .addCase(deleteCategory.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload || 'Failed to delete caCategory';
        });
    },
    
  });
  
export const {
    setRefreshData,
  } = categoriesSlice.actions;

  // Export the reducer to be used in the store
  export default categoriesSlice.reducer;
  