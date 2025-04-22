// features/uiSettings/uiSettingsSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from '../../utils/axiosInstance';
import { SettingIn, SettingOut } from '../../interfaces/uiSettingsInterface';
import { AxiosResponse } from 'axios';
import { uploadPhoto } from '@/cloudinary';

// Define the slice state type
interface UiSettingsState {
    homeSlider: SettingIn[];
    offersFirstSlider: SettingIn[];
    offersLastSlider: SettingIn[];
    loading: boolean;
    error: string | null;
    refreshData: number;
  }
  

// Define the initial state
const initialState: UiSettingsState = {
    homeSlider: [],
    offersFirstSlider: [],
    offersLastSlider: [],
    loading: false,
    error: null,
    refreshData: 0,
  };
  

// Define the base URL for your API endpoint (adjust as needed)
const API_URL = `https://fruits-heaven-api.vercel.app/api/v1/siteSettings/slider`;
// const API_URL = `${process.env.NEXT_PUBLIC_API_URL}setting`;
// Fetch all uiSettings
export const fetchUiSettings = createAsyncThunk<
  SettingIn[], // Return type with uiSettings and total count
  {key: string}, // Arguments
  { rejectValue: string }
>(
  'uiSettings/fetchUiSettings',
  async (params, { rejectWithValue }) => {
    try {
      const url = new URL(`${API_URL}/${params.key}`);

      url.searchParams.set('deleted', 'false');
      const response = await axios.get(url.href);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to fetch uiSettings'
      );
    }
  }
);

// Add a new caSetting
export const addSetting = createAsyncThunk<
SettingIn,
{settingData: SettingOut, key: string},
  { rejectValue: string }
>(
  'uiSettings/addSetting',
  async (params, { rejectWithValue }) => {
      try {
        let imageUrl = params.settingData.url && await uploadPhoto(params.settingData.url);
        if (params.settingData.url && !imageUrl) throw new Error("Image upload failed");
    const response = await axios.post<SettingOut, AxiosResponse<{message: string, setting: SettingIn}, any>>(`${API_URL}/${params.key}`, {url: imageUrl, redirectUrl: params.settingData.redirectUrl});
      return response.data.setting;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to add caSetting'
      );
    }
  }
);

// Update an existing caSetting
export const updateSetting = createAsyncThunk<
  SettingIn,
  { id: string; updatedData: Partial<SettingOut>, key: string }, // Argument type
  { rejectValue: string }
>(
  'uiSettings/updateSetting',
  async ({ id, updatedData , key}, { rejectWithValue }) => {
    console.log(id)
    try {
        let imageUrl = updatedData.url && await uploadPhoto(updatedData.url);

        if (updatedData.url && !imageUrl) throw new Error("Image upload failed");
      const response = await axios.put<SettingOut, AxiosResponse<{message: string, setting: SettingIn}, any>>(`${API_URL}/${key}/${id}`, {url: imageUrl});
      return response.data.setting;
    } catch (error: any) {
      console.log( error.response)
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to update caSetting'
      );
    }
  }
);


// Delete a caSetting
export const deleteSetting = createAsyncThunk<
  {idx: number, key: string}, // Return type: the id of the deleted caSetting
  {key: string, idx: number}, // Argument type: caSetting id
  { rejectValue: string }
>(
  'uiSettings/deleteSetting',
  async ({key, idx}, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/${key}/${idx}`);
      return {idx, key};
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to delete caSetting'
      );
    }
  }
);

const uiSettingsSlice = createSlice({
    name: 'uiSettings',
    initialState,
    reducers: {
      setRefreshData: (state, action: PayloadAction<number>) => {
        state.refreshData = action.payload;
      },
    },
    
    extraReducers: (builder) => {
      // Fetch uiSettings
      builder
        .addCase(fetchUiSettings.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchUiSettings.fulfilled, (state, action) => {
            state.loading = false;

            // Determine which array to store the data in based on the `key`
            const key = action.meta.arg.key;
          
            if (key === 'homeSlider') {
              state.homeSlider = action.payload;
            } else if (key === 'offersFirstSlider') {
              state.offersFirstSlider = action.payload;
            } else if (key === 'offersLastSlider') {
              state.offersLastSlider = action.payload;
            }
        })
        .addCase(fetchUiSettings.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload || 'Failed to fetch uiSettings';
        });
        
      // Add caSetting
      builder
        .addCase(addSetting.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(addSetting.fulfilled, (state) => {
          state.loading = false;
        })
        .addCase(addSetting.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload || 'Failed to add caSetting';
        });
        
      // Update caSetting
      builder
        .addCase(updateSetting.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(updateSetting.fulfilled, (state, action: PayloadAction<SettingIn>) => {
            state.loading = false;
            const updatedSetting = action.payload;
          
            const updateArray = (arr: SettingIn[]) => {
              const index = arr.findIndex((z) => z._id === updatedSetting._id);
              if (index !== -1) {
                arr[index] = updatedSetting;
              }
            };
          
            // Try to update in all arrays
            updateArray(state.homeSlider);
            updateArray(state.offersFirstSlider);
            updateArray(state.offersLastSlider);
        })
        .addCase(updateSetting.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload || 'Failed to update caSetting';
        });

      // Delete Setting
      builder
        .addCase(deleteSetting.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(deleteSetting.fulfilled, (state, action: PayloadAction<{ idx: number, key: string }>) => {
          state.loading = false;
      
          // Remove the item by index from the corresponding array
          if (action.payload.key === 'homeSlider') {
            state.homeSlider.splice(action.payload.idx, 1);
          } else if (action.payload.key === 'offersFirstSlider') {
            state.offersFirstSlider.splice(action.payload.idx, 1);
          } else if (action.payload.key === 'offersLastSlider') {
            state.offersLastSlider.splice(action.payload.idx, 1);
          }
        })
        .addCase(deleteSetting.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload || 'Failed to delete caSetting';
          console.log(state.error)
        });
    },
    
  });
  
export const {
    setRefreshData,
  } = uiSettingsSlice.actions;

  // Export the reducer to be used in the store
  export default uiSettingsSlice.reducer;
  