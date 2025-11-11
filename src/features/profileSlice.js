import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:3000/user";

//  Get Admin Profile
export const getProfileAdmin = createAsyncThunk(
  "admin/getProfile",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/profile/admin`, {
        withCredentials: true,
      });
      console.log(res);
      return res.data.admin; 
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch profile"
      );
    }
  }
);

//  Update Admin Profile
export const updateProfileAdmin = createAsyncThunk(
  "admin/updateProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${API_URL}/profile/admin/update`, profileData, {
        withCredentials: true,
      });
      return res.data; 
    } catch (error) {
        console.log(error);
      return rejectWithValue(
        error.response?.data?.message || "Profile update failed"
      );
    }
  }
);

//  Slice
const profileSlice = createSlice({
  name: "profile",
  initialState: {
    user: null,
    loading: false,
    error: null,
    success: null,
  },
  reducers: {
    clearProfileState: (state) => {
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      //  Get Profile
      .addCase(getProfileAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProfileAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(getProfileAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //  Update Profile
      .addCase(updateProfileAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(updateProfileAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user; 
        state.success = action.payload.message || "Profile updated successfully";
      })
      .addCase(updateProfileAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearProfileState } = profileSlice.actions;
export default profileSlice.reducer;
