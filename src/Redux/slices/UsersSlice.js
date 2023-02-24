import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import _ from "lodash";

export const getAllUsers = createAsyncThunk(
  "users",
  async (arg, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/admin/users`,
        {
          withCredentials: true,
        }
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
        `${process.env.REACT_APP_API_URL}/admin/users/orders/${id}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const initialState = {
  loadingUsers: false,
  deletionInProcess: false,
  loadingOrders: false,
  users: [],
  chasingUsers: [],
  usersCount: null,
  orders: [],
  deletedUser: null,
  error: null,
  errorOrders: null,
  deletionError: null,
};

const UsersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllUsers.pending, (state, action) => {
        state.loadingUsers = true;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.users = action.payload.users;
        state.usersCount = action.payload.usersCount;
        state.chasingUsers = _.orderBy(action.payload.users, "numOfOrders", "desc").slice(0, 3)
        state.loadingUsers = false;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.loadingUsers = false;
        state.error = action.payload;
      })
      .addCase(deleteUser.pending, (state, action) => {
        state.loadingUsers = true;
        state.deletionInProcess = true;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(
          (user) => user._id !== action.payload.user._id
        );
        state.loadingUsers = false;
        state.deletionInProcess = false;
        state.deletedUser = action.payload.user;
        state.deletionError = null;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loadingUsers = false;
        state.deletionInProcess = false;
        state.deletionError = action.payload;
      })
      .addCase(getUserOrders.pending, (state, action) => {
        state.loadingOrders = true;
      })
      .addCase(getUserOrders.fulfilled, (state, action) => {
        state.orders = action.payload.myOrders;
        state.loadingOrders = false;
        state.errorOrders = null;
      })
      .addCase(getUserOrders.rejected, (state, action) => {
        state.loadingOrders = false;
        state.errorOrders = action.payload;
      });
  },
});

export default UsersSlice.reducer;
