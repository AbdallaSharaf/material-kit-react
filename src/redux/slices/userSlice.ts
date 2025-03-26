// features/users/usersSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from '../../utils/axiosInstance';

import { MRT_ColumnFiltersState, MRT_PaginationState, MRT_SortingState } from 'material-react-table';
import { User } from '@/types/user';

// Define the slice state type
interface usersState {
 users: User[];
  loading: boolean;
  error: string | null;
  totalCount: number
  user: User | null;
  // UI state variables to be shared across controller and view
  refreshData: number;
  searchQuery: string;
  sorting: MRT_SortingState;
  pagination: MRT_PaginationState;
  columnFilters: MRT_ColumnFiltersState,
  rowCount: number;
  shouldFetchOptions: boolean,
}

// Define the initial state
const initialState: usersState = {
 users: [],
  loading: false,
  error: null,
  totalCount: 0,
  user: null,

  // Initialize your UI state variables
  refreshData: 0,
  searchQuery: '',
  sorting: [],
  pagination: {
    pageIndex: 0,
    pageSize: 10,
  },
  columnFilters: [],
  rowCount: 0,
  shouldFetchOptions: false,
};

// Define the base URL for your API endpoint (adjust as needed)
const API_URL = `${process.env.VITE_BASE_URL}user`;

// Fetch allusers
export const fetchUsers = createAsyncThunk<
  { users: User[]; totalCount: number }, // Return type with users and total count
  { page: any, pageSize: any, sorting: any, globalFilter: any, columnFilters: any }, // Arguments
  { rejectValue: string }
>(
  'users/fetchUsers',
  async (params, { rejectWithValue }) => {
    try {

    const url = new URL(API_URL);
    { params.globalFilter && url.searchParams.set('name', params.globalFilter ?? '')}
    url.searchParams.set('deleted', 'false');
    url.searchParams.set('PageCount', `${params.pageSize}`);
    if (params.columnFilters && params.columnFilters.length > 0) {
      params.columnFilters.forEach((filter: any) => {
        url.searchParams.append(filter.id, filter.value);
      });
    }
    { params.sorting && params.sorting.length > 0 && params.sorting.forEach((sort:any) => {
      url.searchParams.append('sort', sort.desc ? `-${sort.id}` : sort.id);
    });}
    url.searchParams.set('page', `${params.page+1}`);
      const response = await axios.get(url.href);
      const { data, TotalCount } = response.data;
      return { users: data, totalCount: TotalCount };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to fetchusers'
      );
    }
  }
);

// Fetch allusers
export const fetchUserById = createAsyncThunk<
  {user: User;}, // Return type withusers and total count
  { id: string},
  { rejectValue: string }
>(
  'users/fetchUserById',
  async (params, { rejectWithValue }) => {
    try {
      const url = new URL(`${API_URL}/${params.id}`);

      const response = await axios.get(url.href);

      const { user } = response.data;
      return {user: user };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to fetchusers'
      );
    }
  }
);

// Add a new compUser
export const addUser = createAsyncThunk<
  User,         // Return type on success
  User,             // Argument type (new user data)
  { rejectValue: string }
>(
  'users/addUser',
  async (userData, { rejectWithValue }) => {
    try {

      // Destructure the properties you don't want to send
      // and extract the `city` property.
      const {_id, image, username, verified, isActive, smsDisabled, ...rest } = userData;

      // Transform the data:
      // - Create a new "cities" property that is an array containing the `city` string.
      // - Do not include the `photo` property in the new object.
      // Send the transformed data to your API.
      // Clone the data to safely manipulate it
      const transformedData = { ...rest };

      // If role doesn't require company, remove it from the payload

      const response = await axios.post<User>(API_URL, transformedData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
        error.message ||
        'Failed to add user'
      );
    }
  }
);


export const updateAccount = createAsyncThunk<
  any,        // ✅ Return type on success
  any,        // ✅ Argument type (account data to update)
  { rejectValue: string }
>(
  'account/updateAccount',
  async (accountData, { rejectWithValue }) => {
    try {
      // Destructure properties you don't want to send (example)
      const { image, ...rest } = accountData;

      // Call your update API (adjust endpoint if needed)
      const response = await axios.patch(`${API_URL}/updateMyData`, rest);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
        error.message ||
        'Failed to update account'
      );
    }
  }
);

// Update an existing compUser
export const updateUser = createAsyncThunk<
  any, // Return type on success
  { id: string; updatedData: Partial<User>;}, // Argument type
  { rejectValue: string }
>(
  'users/updateUser',
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      // Destructure to remove unwanted fields and extract the ones we need
      const {_id, image, username, isActive, smsDisabled, ...rest } = updatedData;
      // Clone the data to safely manipulate it
      const transformedData = { ...rest };

      // If role doesn't require company, remove it from the payload
      
      const response = await axios.put<any>(`${API_URL}/${id}`, transformedData);
      console.log(response)
      // Now send the transformedData as the payload
      return response.data.User;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to update user'
      );
    }
  }
);

// Delete a compUser
export const deleteUser = createAsyncThunk<
  string, // Return type: the id of the deleted compUser
  string, // Argument type: compUser id
  { rejectValue: string }
>(
  'users/deleteUser',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to delete compUser'
      );
    }
  }
);

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {  // Reducers to update UI state variables
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
          setShouldFetchOptions: (state, action: PayloadAction<boolean>) => {
            state.shouldFetchOptions = action.payload;
          },
        },
    
    extraReducers: (builder) => {
      // Fetchusers
      builder
        .addCase(fetchUsers.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchUsers.fulfilled, (state, action) => {
          state.loading = false;
          state.users = action.payload.users; // Store theusers
          state.totalCount = action.payload.totalCount; // Store the total count
        })
        .addCase(fetchUsers.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload || 'Failed to fetchusers';
        });

      builder
        .addCase(fetchUserById.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchUserById.fulfilled, (state, action) => {
          state.loading = false;
          state.user = action.payload.user; // Store theusers
        })
        .addCase(fetchUserById.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload || 'Failed to fetchusers';
        });
        
      // Add User
      builder
        .addCase(addUser.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(addUser.fulfilled, (state, action: PayloadAction<User>) => {
          state.loading = false;
          state.users.push(action.payload);
        })
        .addCase(addUser.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload || 'Failed to add compUser';
        });

      builder
        .addCase(updateAccount.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(updateAccount.fulfilled, (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.users.push(action.payload);
        })
        .addCase(updateAccount.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload || 'Failed to add compUser';
        });
        
      // Update User
      builder
        .addCase(updateUser.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(updateUser.fulfilled, (state, action: PayloadAction<User>) => {
          state.loading = false;
          const index = state.users.findIndex((user) => user._id === action.payload._id);
          if (index !== -1) {
            state.users[index] = action.payload;
          }
        })
        .addCase(updateUser.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload || 'Failed to update compUser';
        });
        
      // Delete compUser
      builder
        .addCase(deleteUser.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(deleteUser.fulfilled, (state, action: PayloadAction<string>) => {
          state.loading = false;
          state.users = state.users.filter((cat) => cat._id !== action.payload);
        })
        .addCase(deleteUser.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload || 'Failed to delete compUser';
        });
    },
  });
  

export const {
    setRefreshData,
    setSearchQuery,
    setSorting,
    setPagination,
    setRowCount,
    setColumnFilters,
    setShouldFetchOptions,
  } = usersSlice.actions;

  // Export the reducer to be used in the store
  export default usersSlice.reducer;
  