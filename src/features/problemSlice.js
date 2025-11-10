import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:3000/admin";

// Create Problem
export const createProblem = createAsyncThunk(
  "problem/create",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/create`, data, { withCredentials: true });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || "Failed to create problem");
    }
  }
);

// Get All Problems
export const getAllProblems = createAsyncThunk(
  "problem/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/getAllProblem`, { withCredentials: true });
      return res.data.problems;
    } catch (err) {
      return rejectWithValue("Failed to fetch problems");
    }
  }
);

// Delete Problem
export const deleteProblem = createAsyncThunk(
  "problem/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/delete/${id}`, { withCredentials: true });
      return id;
    } catch (err) {
      return rejectWithValue("Failed to delete problem");
    }
  }
);

// Update Problem
export const updateProblem = createAsyncThunk(
  "problem/update",
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${API_URL}/update/${id}`, updatedData, {
        withCredentials: true,
      });
      return res.data.problem;
    } catch (error) {
      return rejectWithValue("Failed to update problem");
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
      // Create Problem
      .addCase(createProblem.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
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

      // Get All Problems
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

      // Delete Problem
      .addCase(deleteProblem.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteProblem.fulfilled, (state, action) => {
        state.loading = false;
        state.problems = state.problems.filter((p) => p._id !== action.payload);
        state.success = "Problem deleted successfully!";
      })
      .addCase(deleteProblem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Problem
      .addCase(updateProblem.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProblem.fulfilled, (state, action) => {
        state.loading = false;
        state.success = "Problem updated successfully!";
        const index = state.problems.findIndex((p) => p._id === action.payload._id);
        if (index !== -1) state.problems[index] = action.payload;
      })
      .addCase(updateProblem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearProblemState } = problemSlice.actions;
export default problemSlice.reducer;
