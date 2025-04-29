import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { User } from '@/types/user';

import axios from '../../utils/axiosInstance';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const API_URL = `${process.env.VITE_BASE_URL}auth`;

// ✅ Fetch User Data
export const fetchUserData = createAsyncThunk<User, void, { rejectValue: string }>(
  'auth/fetchUserData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('https://fruits-heaven-api.onrender.com/api/v1/user/myData');
      return response.data.user;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch user data');
    }
  }
);

export const changePassword = createAsyncThunk<
  any, // ✅ Return type on success
  any, // ✅ Argument type (account data to update)
  { rejectValue: string }
>('account/changePassword', async (accountData, { rejectWithValue }) => {
  try {
    // Call your update API (adjust endpoint if needed)
    const response = await axios.put(`${API_URL}/changeMyPassword`, accountData);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message || 'Failed to update account');
  }
});

// ✅ Login action
export const loginUser = createAsyncThunk<
  { token: string },
  { email: string; password: string },
  { rejectValue: string }
>('auth/loginUser', async ({ email, password }, { rejectWithValue, dispatch }) => {
  try {
    const response = await axios.post(`${API_URL}/SignIn`, { email, password });
    const { token } = response.data;

    localStorage.setItem('token', token);

    // ✅ Fetch user data after login
    await dispatch(fetchUserData());

    return { token };
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.error || 'Login failed');
  }
});

// ✅ Restore session
export const restoreSession = createAsyncThunk('auth/restoreSession', async (_, { rejectWithValue, dispatch }) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');

    // ✅ Fetch user data if token exists
    await dispatch(fetchUserData());

    return { token };
  } catch (error) {
    return rejectWithValue('Invalid token');
  }
});

// ✅ Logout action
export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
  localStorage.removeItem('token');
  return null;
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      // ✅ Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Login failed';
      });

    builder
      // ✅ Login
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.loading = false;
        console.log(action);
        // state.token = action.payload.token;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Password change failed';
      })

      // ✅ Fetch User Data
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchUserData.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      })

      // ✅ Restore session
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(restoreSession.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })

      // ✅ Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      });
  },
});

export default authSlice.reducer;
