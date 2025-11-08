import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Base URL for your backend
const API_URL = "http://localhost:3000/admin/problems";

// ✅ Create Problem
export const createProblem = createAsyncThunk(
  "problem/create",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}`, data, { withCredentials: true });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || "Failed to create problem");
    }
  }
);

// ✅ Get All Problems
export const getAllProblems = createAsyncThunk(
  "problem/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}`, { withCredentials: true });
      return res.data.problems;
    } catch (err) {
      return rejectWithValue("Failed to fetch problems");
    }
  }
);

// ✅ Delete Problem
export const deleteProblem = createAsyncThunk(
  "problem/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/${id}`, { withCredentials: true });
      return id;
    } catch (err) {
      return rejectWithValue("Failed to delete problem");
    }
  }
);

const problemSlice = createSlice({
  name: "problem",
  initialState: {
    problems: [],
    loading: false,
    error: null,
    success: null,
  },
  reducers: {
    clearProblemState: (state) => {
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ✅ Create Problem
      .addCase(createProblem.pending, (state) => {
        state.loading = true;
      })
      .addCase(createProblem.fulfilled, (state, action) => {
        state.loading = false;
        state.problems.push(action.payload.problem);
        state.success = "Problem created successfully!";
      })
      .addCase(createProblem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ Get All Problems
      .addCase(getAllProblems.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllProblems.fulfilled, (state, action) => {
        state.loading = false;
        state.problems = action.payload;
      })
      .addCase(getAllProblems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ Delete Problem
      .addCase(deleteProblem.fulfilled, (state, action) => {
        state.problems = state.problems.filter((p) => p._id !== action.payload);
      });
  },
});

export const { clearProblemState } = problemSlice.actions;
export default problemSlice.reducer;
