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


export const updateOrderStatusMany = createAsyncThunk(
  "orders/update/status/many",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/admin/orders/update/status/many`,
        data,
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

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const deleteManyOrders = createAsyncThunk(
  "orders/delete/many",
  async (orderids, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/admin/orders/delete/many`,
        {orderids},
        { withCredentials: true }
      );

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
  updateManyInProcess: false,
  deleteManyInProcess: false,
  orders: [],
  ordersCount: null,
  updatedCount: null,
  deletedCount: null,
  totalAmount: null,
  updatedOrder: null,
  error: null,
  updationError: null,
  updateManyError: null,
  deleteManyError: null,
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
        state.orders = action.payload.orders;
        state.ordersCount = action.payload.ordersCount;
        state.totalAmount = action.payload.totalAmount;
        state.loadingOrders = false;
        state.deletionInProcess = false;
        state.deletionError = null
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.loadingOrders = false;
        state.deletionInProcess = false
        state.deletionError = action.payload;
      })
      .addCase(deleteManyOrders.pending, (state, action) => {
        state.loadingOrders = true;
        state.deleteManyInProcess = true;
      })
      .addCase(deleteManyOrders.fulfilled, (state, action) => {
        state.orders = action.payload.orders;
        state.ordersCount = action.payload.ordersCount;
        state.totalAmount = action.payload.totalAmount;
        state.deletedCount = action.payload.deletedCount;
        state.loadingOrders = false;
        state.deleteManyInProcess = false;
        state.deleteManyError = null;
      })
      .addCase( deleteManyOrders.rejected, (state, action) => {
        state.deleteManyInProcess = false;
        state.deleteManyError = action.payload;
      })
      .addCase(updateOrderStatusMany.pending, (state, action) => {
        state.loadingOrders = true;
        state.updateManyInProcess = true;
      })
      .addCase(updateOrderStatusMany.fulfilled, (state, action) => {
        state.orders = action.payload.orders;
        state.ordersCount = action.payload.ordersCount;
        state.totalAmount = action.payload.totalAmount;
        state.updatedCount = action.payload.updatedCount;
        state.loadingOrders = false;
        state.updateManyInProcess = false;
        state.updateManyError = null;
      })
      .addCase(updateOrderStatusMany.rejected, (state, action) => {
        state.updateManyInProcess = false;
        state.updateManyError = action.payload;
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
