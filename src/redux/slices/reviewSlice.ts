// features/reviews/reviewsSlice.ts

import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';

import { ReviewIn, ReviewOut } from '../../interfaces/reviewInterface';
import axios from '../../utils/axiosInstance';

// Define the slice state type
interface ReviewsState {
  reviews: ReviewIn[];
  loading: boolean;
  error: string | null;

  // UI state variables to be shared across controller and view
  refreshData: number;
}

// Define the initial state
const initialState: ReviewsState = {
  reviews: [],
  loading: false,
  error: null,

  // Initialize your UI state variables
  refreshData: 0,
};

// Define the base URL for your API endpoint (adjust as needed)
const API_URL = `https://fruits-heaven-api.onrender.com/api/v1/review`;
// const API_URL = `${process.env.NEXT_PUBLIC_API_URL}review`;
// Fetch all reviews
export const fetchReviews = createAsyncThunk<
  ReviewIn[], // Return type with reviews and total count
  void, // Arguments
  { rejectValue: string }
>('reviews/fetchReviews', async (_, { rejectWithValue }) => {
  try {
    const url = new URL(API_URL);

    url.searchParams.set('page', `1`);
    url.searchParams.set('sort', '-createdAt');
    url.searchParams.set('PageCount', 'all');
    const response = await axios.get(url.href);
    const { data } = response.data;
    return data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch reviews');
  }
});


// Update an existing Review
export const updateReview = createAsyncThunk<
  ReviewIn,
  { id: string; updatedData: Partial<ReviewOut> }, // Argument type
  { rejectValue: string }
>('reviews/updateReview', async ({ id, updatedData }, { rejectWithValue }) => {
  try {
    const response = await axios.put<ReviewOut, AxiosResponse<{ message: string; Review: ReviewIn }, any>>(
      `${API_URL}/${id}`,
      updatedData
    );
    return response.data.Review;
  } catch (error: any) {
    console.log(error.response);
    return rejectWithValue(error.response?.data?.message || error.message || 'Failed to update Review');
  }
});


// Delete a Review
export const deleteReview = createAsyncThunk<
  string, // Return type: the id of the deleted Review
  string, // Argument type: Review id
  { rejectValue: string }
>('reviews/deleteReview', async (id, { rejectWithValue }) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
    return id;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message || 'Failed to delete Review');
  }
});

const reviewsSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    setRefreshData: (state, action: PayloadAction<number>) => {
      state.refreshData = action.payload;
    },
  },

  extraReducers: (builder) => {
    // Fetch reviews
    builder
      .addCase(fetchReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload; // Store the reviews
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch reviews';
      });

    // Update Review
    builder
      .addCase(updateReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateReview.fulfilled, (state, action: PayloadAction<ReviewIn>) => {
        state.loading = false;
      })
      .addCase(updateReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update Review';
      });

    // Delete Review
    builder
      .addCase(deleteReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteReview.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.reviews = state.reviews.filter((z) => z._id !== action.payload);
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete Review';
      });
  },
});

export const { setRefreshData } = reviewsSlice.actions;

// Export the reducer to be used in the store
export default reviewsSlice.reducer;
