import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getAllCategories = createAsyncThunk(
  "categories/get",
  async (arg, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/admin/categories`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);


export const addCategory = createAsyncThunk(
  "categories/create",
  async (categoryData, { rejectWithValue }) => {
    try {
      
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/admin/categories/new/create`,
        categoryData,
        {withCredentials: true}
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const updateCategory = createAsyncThunk(
  "categories/update",
  async ({ id, newData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/admin/categories/${id}`,
        newData,
        { withCredentials: true }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const deleteCategory = createAsyncThunk(
  "categories/delete",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API_URL}/admin/categories/${id}`,
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
  categories: [],
  deletedCategory: null,
  updatedCategory: null,
  error: null,
  creationError: null,
  updationError: null,
  deletionError: null,
};

const CategoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllCategories.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getAllCategories.fulfilled, (state, action) => {
        state.categories = action.payload.categories;
        state.loading = false;
      })
      .addCase(getAllCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteCategory.pending, (state, action) => {
        state.loading = true;
        state.deletionInProcess = true;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter(
          (category) => category._id !== action.payload.category._id
        );
        state.loading = false;
        state.deletionInProcess = false;
        state.deletedCategory = action.payload.category
        state.deletionError = null
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading = false;
        state.deletionInProcess = false
        state.deletionError = action.payload;
      })
      .addCase(addCategory.pending, (state, action) => {
        state.creationInProcess = true;
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        state.creationInProcess = false;
        state.categories.push(action.payload.category);
        state.creationError = null;
      })
      .addCase(addCategory.rejected, (state, action) => {
        state.creationInProcess = false;
        state.creationError = action.payload;
      })
      .addCase(updateCategory.pending, (state, action) => {
        state.updationInProcess = true;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.updatedCategory = action.payload.category;
        state.updationInProcess = false;
        state.updationError = null;
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.updationInProcess = false;
        state.updationError = action.payload;
      });
  },
});


export default CategoriesSlice.reducer;
