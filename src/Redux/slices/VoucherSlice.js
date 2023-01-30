import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getAllVouchers = createAsyncThunk(
  "vouchers/get",
  async (arg, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/admin/vouchers`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const addVoucher = createAsyncThunk(
  "vouchers/create",
  async (voucherData, { rejectWithValue }) => {
    try {
      
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/admin/vouchers/new/create`,
        voucherData,
        {withCredentials: true}
      );
      console.log(response.data);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const updateVoucher = createAsyncThunk(
  "vouchers/update",
  async ({ id, newData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/admin/vouchers/${id}`,
        newData,
        { withCredentials: true }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const deleteVoucher = createAsyncThunk(
  "vouchers/delete",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API_URL}/admin/vouchers/${id}`,
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
  loading: false,
  creationInProcess: false,
  deletionInProcess: false,
  updationInProcess: false,
  vouchers: [],
  updatedVoucher: null,
  deletedvoucher: null,
  error: null,
  creationError: null,
  updationError: null,
  deletionError: null,
};

const VoucherSlice = createSlice({
  name: "vouchers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllVouchers.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getAllVouchers.fulfilled, (state, action) => {
        state.vouchers = action.payload.vouchers;
        state.loading = false;
      })
      .addCase(getAllVouchers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteVoucher.pending, (state, action) => {
        state.loading = true;
        state.deletionInProcess = true;
      })
      .addCase(deleteVoucher.fulfilled, (state, action) => {
        state.vouchers = state.vouchers.filter(
          (voucher) => voucher._id !== action.payload.voucher._id
        );
        state.loading = false;
        state.deletionInProcess = false;
        state.deletedvoucher = action.payload.voucher;
        state.deletionError = null;
      })
      .addCase(deleteVoucher.rejected, (state, action) => {
        state.loading = false;
        state.deletionInProcess = false;
        state.deletionError = action.payload;
      })
      .addCase(addVoucher.pending, (state, action) => {
        state.creationInProcess = true;
      })
      .addCase(addVoucher.fulfilled, (state, action) => {
        state.creationInProcess = false;
        state.vouchers.push(action.payload.voucher);
        state.creationError = null;
      })
      .addCase(addVoucher.rejected, (state, action) => {
        state.creationInProcess = false;
        state.creationError = action.payload;
      })
      .addCase(updateVoucher.pending, (state, action) => {
        state.updationInProcess = true;
      })
      .addCase(updateVoucher.fulfilled, (state, action) => {
        state.updationInProcess = false;
        state.updatedVoucher = action.payload.voucher;
        state.updationError = null;
      })
      .addCase(updateVoucher.rejected, (state, action) => {
        state.updationInProcess = false;
        state.updationError = action.payload;
      });
  },
});

export default VoucherSlice.reducer;
