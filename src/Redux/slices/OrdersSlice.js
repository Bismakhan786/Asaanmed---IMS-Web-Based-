import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getAllOrders = createAsyncThunk(
  "orders",
  async (arg, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/admin/orders`,
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


export const updateOrder = createAsyncThunk(
  "orders/update",
  async ({ id, orderStatus }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/admin/orders/${id}`,
        orderStatus,
        { withCredentials: true }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const deleteOrder = createAsyncThunk(
  "orders/delete",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API_URL}/admin/orders/${id}`,
        { withCredentials: true }
      );
      console.log(response.data);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const initialState = {
  loadingOrders: false,
  deletionInProcess: false,
  updationInProcess: false,
  orders: [],
  ordersCount: null,
  totalAmount: null,
  updatedOrder: null,
  deletedOrder: null,
  error: null,
  updationError: null,
  deletionError: null,
};

const OrdersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllOrders.pending, (state, action) => {
        state.loadingOrders = true;
      })
      .addCase(getAllOrders.fulfilled, (state, action) => {
        state.orders = action.payload.orders;
        state.ordersCount = action.payload.ordersCount;
        state.totalAmount = action.payload.totalAmount;
        state.loadingOrders = false;
      })
      .addCase(getAllOrders.rejected, (state, action) => {
        state.loadingOrders = false;
        state.error = action.payload;
      })
      .addCase(deleteOrder.pending, (state, action) => {
        state.loadingOrders = true;
        state.deletionInProcess = true;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.orders = state.orders.filter(
          (order) => order._id !== action.payload.order._id
        );
        state.loadingOrders = false;
        state.deletionInProcess = false;
        state.deletedOrder = action.payload.order
        state.deletionError = null
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.loadingOrders = false;
        state.deletionInProcess = false
        state.deletionError = action.payload;
      })
      .addCase(updateOrder.pending, (state, action) => {
        state.updationInProcess = true;
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        state.updatedOrder = action.payload.order;
        state.updationInProcess = false;
        state.updationError = null;
      })
      .addCase(updateOrder.rejected, (state, action) => {
        state.updationInProcess = false;
        state.updationError = action.payload;
      });
  },
});


export default OrdersSlice.reducer;
