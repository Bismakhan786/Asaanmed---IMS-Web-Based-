import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const adminLogin = createAsyncThunk(
  "/admin/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const config = {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      };
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/admin/login`,
        { email, password },
        config
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const logoutAdmin = createAsyncThunk(
  "/admin/logout",
  async (arg, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/admin/logout`,
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

export const loadAdmin = createAsyncThunk(
  "admin/verify",
  async (arg, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/admin/me`,
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

export const updateAdminPassword = createAsyncThunk(
  "/admin/update/password",
  async (
    { oldPassword, newPassword, confirmPassword },
    { rejectWithValue }
  ) => {
    try {
      const config = {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      };
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/admin/update/password`,
        { oldPassword, newPassword, confirmPassword },
        config
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const updateAdminProfile = createAsyncThunk(
  "/admin/update/profile",
  async ({ name, email }, { rejectWithValue }) => {
    try {
      const config = {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      };
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/admin/update/profile`,
        { name, email },
        config
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const initialState = {
  loading: false,
  userInfo: {},
  userToken: null,
  authError: null,
  success: false,
  isAdmin: false,
  accessError: null,
  updatePasswordInProcess: false,
  updateProfileInProcess: false,
};

const AdminLoginSlice = createSlice({
  name: "adminLogin",
  initialState,
  reducers: {},
  extraReducers: (builder) => [
    builder
      .addCase(adminLogin.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload.user;
        state.userToken = action.payload.token;
        state.success = true;
        state.isAdmin = true;
        state.authError = null;
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.authError = action.payload;
      })

      .addCase(logoutAdmin.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(logoutAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = {};
        state.userToken = null;
        state.success = true;
        state.isAdmin = false;
      })
      .addCase(logoutAdmin.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.authError = action.payload;
      })
      .addCase(loadAdmin.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(loadAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.isAdmin = true;
        state.userInfo = action.payload.user;
        state.accessError = null;
        state.success = true;
      })
      .addCase(loadAdmin.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.accessError = action.payload;
      })
      .addCase(updateAdminPassword.pending, (state, action) => {
        state.updatePasswordInProcess = true;
      })
      .addCase(updateAdminPassword.fulfilled, (state, action) => {
        state.updatePasswordInProcess = false;
        state.success = true;
        state.userInfo = action.payload.user;
        state.userToken = action.payload.token;
        state.authError = null;
      })
      .addCase(updateAdminPassword.rejected, (state, action) => {
        state.updatePasswordInProcess = false;
        state.success = false;
        state.authError = action.payload;
      })
      .addCase(updateAdminProfile.pending, (state, action) => {
        state.updateProfileInProcess = true;
      })
      .addCase(updateAdminProfile.fulfilled, (state, action) => {
        state.updateProfileInProcess = false;
        state.success = true;
        state.userInfo = action.payload.user;
        state.authError = null;
      })
      .addCase(updateAdminProfile.rejected, (state, action) => {
        state.updateProfileInProcess = false;
        state.success = false;
        state.authError = action.payload;
      }),
  ],
});

export default AdminLoginSlice.reducer;
