// features/coupons/couponsSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from '../../utils/axiosInstance';
import { CouponIn, CouponOut } from '../../interfaces/couponInterface';
import { AxiosResponse } from 'axios';

// Define the slice state type
interface CouponsState {
  activeCoupons: CouponIn[];
  expiredCoupons: CouponIn[];
  loading: boolean;
  error: string | null;

  // UI state variables to be shared across controller and view
  refreshData: number;
}

// Define the initial state
const initialState: CouponsState = {
  activeCoupons: [],
  expiredCoupons: [],
  loading: false,
  error: null,

  // Initialize your UI state variables
  refreshData: 0,
};

// Define the base URL for your API endpoint (adjust as needed)
const API_URL = `https://fruits-heaven-api.vercel.app/api/v1/coupon`;
// const API_URL = `${process.env.NEXT_PUBLIC_API_URL}coupon`;
// Fetch all coupons
export const fetchActiveCoupons = createAsyncThunk<
  CouponIn[], // Return type with coupons and total count
  void, // Arguments
  { rejectValue: string }
>(
  'coupons/fetchActiveCoupons',
  async (_, { rejectWithValue }) => {
    try {
      const url = new URL(API_URL);

      url.searchParams.set('deleted', 'false');
      url.searchParams.set('page', `1`);
      url.searchParams.set('isActive', "true");
      url.searchParams.set('PageCount', "100000");
      const response = await axios.get(url.href);
      const { data } = response.data;
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to fetch coupons'
      );
    }
  }
);

export const fetchExpiredCoupons = createAsyncThunk<
  CouponIn[], // Return type with coupons and total count
  void, // Arguments
  { rejectValue: string }
>(
  'coupons/fetchExpiredCoupons',
  async (_, { rejectWithValue }) => {
    try {
      const url = new URL(API_URL);

      url.searchParams.set('deleted', 'false');
      url.searchParams.set('page', `1`);
      url.searchParams.set('isActive', "false");
      url.searchParams.set('PageCount', "100000");
      const response = await axios.get(url.href);
      const { data } = response.data;
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to fetch coupons'
      );
    }
  }
);

// Add a new caCoupon
export const addCoupon = createAsyncThunk<
CouponIn,
CouponOut,
  { rejectValue: string }
>(
  'coupons/addCoupon',
  async (couponData, { rejectWithValue }) => {
      try {

    const response = await axios.post<CouponOut, AxiosResponse<{message: string, coupon: CouponIn}, any>>(API_URL, couponData);
    console.log(response)
      return response.data.coupon;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to add caCoupon'
      );
    }
  }
);

// Update an existing caCoupon
export const updateCoupon = createAsyncThunk<
  CouponIn,
  { id: string; updatedData: Partial<CouponOut> }, // Argument type
  { rejectValue: string }
>(
  'coupons/updateCoupon',
  async ({ id, updatedData }, { rejectWithValue }) => {
    console.log(id)
    try {
      const response = await axios.put<CouponOut, AxiosResponse<{message: string, coupon: CouponIn}, any>>(`${API_URL}/${id}`, updatedData);
      return response.data.coupon;
    } catch (error: any) {
      console.log( error.response)
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to update caCoupon'
      );
    }
  }
);

// Update an existing product
export const updateCouponOrder = createAsyncThunk<
  string, // Return type on success
  { id: string; order: number }, // Argument type
  { rejectValue: string }
>(
  'products/updateCouponOrder',
  async ({ id, order }, { rejectWithValue }) => {    
    try {
      const response = await axios.patch<CouponOut, AxiosResponse<{message: string}, any>>(`${API_URL}/${id}`, {order: order});
      return response.data.message;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to update product'
      );
    }
  }
);


// Delete a caCoupon
export const deleteCoupon = createAsyncThunk<
  string, // Return type: the id of the deleted caCoupon
  string, // Argument type: caCoupon id
  { rejectValue: string }
>(
  'coupons/deleteCoupon',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to delete caCoupon'
      );
    }
  }
);

const couponsSlice = createSlice({
    name: 'coupons',
    initialState,
    reducers: {
      setRefreshData: (state, action: PayloadAction<number>) => {
        state.refreshData = action.payload;
      },
    },
    
    extraReducers: (builder) => {
      // Fetch coupons
      builder
        .addCase(fetchActiveCoupons.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchActiveCoupons.fulfilled, (state, action) => {
          state.loading = false;
          state.activeCoupons = action.payload; // Store the coupons
        })
        .addCase(fetchActiveCoupons.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload || 'Failed to fetch coupons';
        });

      builder
        .addCase(fetchExpiredCoupons.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchExpiredCoupons.fulfilled, (state, action) => {
          state.loading = false;
          state.expiredCoupons = action.payload; // Store the coupons
        })
        .addCase(fetchExpiredCoupons.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload || 'Failed to fetch coupons';
        });
        
      // Add caCoupon
      builder
        .addCase(addCoupon.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(addCoupon.fulfilled, (state) => {
          state.loading = false;
        })
        .addCase(addCoupon.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload || 'Failed to add caCoupon';
        });
        
      // Update caCoupon
      builder
        .addCase(updateCoupon.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(updateCoupon.fulfilled, (state, action: PayloadAction<CouponIn>) => {
          state.loading = false;
        })
        .addCase(updateCoupon.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload || 'Failed to update caCoupon';
        });
        
      builder
        .addCase(updateCouponOrder.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(updateCouponOrder.fulfilled, (state) => {
          state.loading = false;
        })
        .addCase(updateCouponOrder.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload || 'Failed to update order';
        });

      // Delete caCoupon
      builder
        .addCase(deleteCoupon.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(deleteCoupon.fulfilled, (state, action: PayloadAction<string>) => {
          state.loading = false;
          state.activeCoupons = state.activeCoupons.filter((z) => z._id !== action.payload);
        })
        .addCase(deleteCoupon.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload || 'Failed to delete caCoupon';
        });
    },
    
  });
  
export const {
    setRefreshData,
  } = couponsSlice.actions;

  // Export the reducer to be used in the store
  export default couponsSlice.reducer;
  