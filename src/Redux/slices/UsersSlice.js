import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getAllUsers = createAsyncThunk(
  "users",
  async (arg, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/admin/users`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const updateUser = createAsyncThunk(
  "users/update",
  async ({ id, isAdmin }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/admin/users/${id}`,
        {isAdmin},
        { withCredentials: true }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const deleteUser = createAsyncThunk(
  "users/delete",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API_URL}/admin/users/${id}`,
        { withCredentials: true }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const getUserOrders = createAsyncThunk(
  "users/order",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/admin/orders/user/${id}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const getOrdersAndReviews = createAsyncThunk(
  "users/orderAndReviews",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/admin/users/ordersAndReviews/${id}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const initialState = {
  loading: false,
  deletionInProcess: false,
  updationInProcess: false,
  loadingOrdersAndReviews: false,
  users: [],
  orders: [],
  reviews: [],
  updatedUser: null,
  deletedUser: null,
  error: null,
  errorOrdersAndReviews: null,
  updationError: null,
  deletionError: null,
};

const UsersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllUsers.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.users = action.payload.users;
        state.loading = false;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteUser.pending, (state, action) => {
        state.loading = true;
        state.deletionInProcess = true;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(
          (user) => user._id !== action.payload.user._id
        );
        state.loading = false;
        state.deletionInProcess = false;
        state.deletedUser = action.payload.user;
        state.deletionError = null;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.deletionInProcess = false;
        state.deletionError = action.payload;
      })
      .addCase(updateUser.pending, (state, action) => {
        state.updationInProcess = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.updatedUser = action.payload.user;
        state.updationInProcess = false;
        state.updationError = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.updationInProcess = false;
        state.updationError = action.payload;
      })
      .addCase(getOrdersAndReviews.pending, (state, action) => {
        state.loadingOrdersAndReviews = true;
      })
      .addCase(getOrdersAndReviews.fulfilled, (state, action) => {
        state.orders = action.payload.orders;
        state.reviews = action.payload.products;
        state.loadingOrdersAndReviews = false;
        state.errorOrdersAndReviews = null;
      })
      .addCase(getOrdersAndReviews.rejected, (state, action) => {
        state.loadingOrdersAndReviews = false;
        state.errorOrdersAndReviews = action.payload;
      });
  },
});

export default UsersSlice.reducer;
