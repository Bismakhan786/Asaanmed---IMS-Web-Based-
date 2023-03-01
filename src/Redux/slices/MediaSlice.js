import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getMediaFromAPI = createAsyncThunk(
  "media/get",
  async (arg, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/admin/media`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const deleteMedia = createAsyncThunk(
  "media/delete",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API_URL}/admin/media/delete/${id}`,
        { withCredentials: true }
      );
      console.log(response.data);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const uploadMedia = createAsyncThunk(
  "media/upload",
  async (dataArray, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/admin/media/upload`,
        dataArray,
        { withCredentials: true }
      );
      console.log(response.data);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const deleteAllMedia = createAsyncThunk(
  "media/delete/all",
  async (args, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API_URL}/admin/media/delete/all/images`,
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
  loadingMedia: false,
  creationInProcess: false,
  deleteImageInProcess: false,
  deleteMediaInProcess: false,
  media: [],
  mediaCount: null,
  deletedCount: null,
  error: null,
  creationError: null,
  deleteImageError: null,
  deleteMediaError: null,
};

const MediaSlice = createSlice({
  name: "media",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getMediaFromAPI.pending, (state, action) => {
        state.loadingMedia = true;
      })
      .addCase(getMediaFromAPI.fulfilled, (state, action) => {
        state.media = action.payload.media;
        state.mediaCount = action.payload.mediaCount;
        state.loadingMedia = false;
      })
      .addCase(getMediaFromAPI.rejected, (state, action) => {
        state.loadingMedia = false;
        state.error = action.payload;
      })
      .addCase(deleteMedia.pending, (state, action) => {
        state.loadingMedia = true;
        state.deleteImageInProcess = true;
      })
      .addCase(deleteMedia.fulfilled, (state, action) => {
        state.media = action.payload.media;
        state.mediaCount = action.payload.mediaCount;
        state.loadingMedia = false;
        state.deleteImageInProcess = false;
        state.deleteImageError = null;
      })
      .addCase(deleteMedia.rejected, (state, action) => {
        state.loadingMedia = false;
        state.deleteImageInProcess = false;
        state.deleteImageError = action.payload;
      })
      .addCase(deleteAllMedia.pending, (state, action) => {
        state.loadingMedia = true;
        state.deleteMediaInProcess = true;
      })
      .addCase(deleteAllMedia.fulfilled, (state, action) => {
        state.media = [];
        state.deletedCount = action.payload.deletedCount;
        state.loadingMedia = false;
        state.deleteMediaInProcess = false;
        state.deleteMediaError = null;
      })
      .addCase(deleteAllMedia.rejected, (state, action) => {
        state.loadingMedia = false;
        state.deleteImageInProcess = false;
        state.deleteMediaError = action.payload;
      })
      .addCase(uploadMedia.pending, (state, action) => {
        state.creationInProcess = true;
      })
      .addCase(uploadMedia.fulfilled, (state, action) => {
        state.creationInProcess = false;
        state.media = action.payload.media;
        state.creationError = null;
      })
      .addCase(uploadMedia.rejected, (state, action) => {
        state.creationInProcess = false;
        state.creationError = action.payload;
      });
  },
});

export default MediaSlice.reducer;
