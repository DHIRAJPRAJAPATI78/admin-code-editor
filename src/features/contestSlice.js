import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL =  "http://localhost:3000/contest";



// Create a new contest
export const createContest = createAsyncThunk(
  "contest/create",
  async (contestData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/admin/create`, contestData, {
        withCredentials: true,
      });
      return res.data.contest;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to create contest"
      );
    }
  }
);

// Get all contests (for admin or user dashboard)
export const getAllContests = createAsyncThunk(
  "contest/getAll",
  async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/user/AllContest?page=${page}&limit=${limit}`, {
        withCredentials: true,
      });
      console.log(res);
      return res.data; 
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to fetch contests"
      );
    }
  }
);


// Update a contest
export const updateContest = createAsyncThunk(
  "contest/update",
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${API_URL}/admin/update/${id}`, updatedData, {
        withCredentials: true,
      });
      return res.data.contest;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to update contest"
      );
    }
  }
);

// Delete a contest
export const deleteContest = createAsyncThunk(
  "contest/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/admin/delete/${id}`, {
        withCredentials: true,
      });
      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to delete contest"
      );
    }
  }
);


const contestSlice = createSlice({
  name: "contest",
  initialState: {
    contests: [],
    loading: false,
    error: null,
    success: null,
  },
  reducers: {
    clearContestState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      //  Create
      .addCase(createContest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createContest.fulfilled, (state, action) => {
        state.loading = false;
        state.success = "Contest created successfully";
        state.contests.push(action.payload);
      })
      .addCase(createContest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //  Get All
      .addCase(getAllContests.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllContests.fulfilled, (state, action) => {
        state.loading = false;
        state.contests = action.payload;
      })
      .addCase(getAllContests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //  Update
      .addCase(updateContest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateContest.fulfilled, (state, action) => {
        state.loading = false;
        state.success = "Contest updated successfully";
        state.contests = state.contests.map((c) =>
          c._id === action.payload._id ? action.payload : c
        );
      })
      .addCase(updateContest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //  Delete
      .addCase(deleteContest.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteContest.fulfilled, (state, action) => {
        state.loading = false;
        state.success = "Contest deleted successfully";
        state.contests = state.contests.filter((c) => c._id !== action.payload);
      })
      .addCase(deleteContest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearContestState } = contestSlice.actions;
export default contestSlice.reducer;
