import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getProductDetails = createAsyncThunk(
  "product/get/details",
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/products/${id}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const getProductReviews = createAsyncThunk(
    "product/get/reviews",
    async ({ id }, { rejectWithValue }) => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/products/reviews/${id}`
        );
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response.data.message);
      }
    }
  );


const initialState = {
  loadingProduct: false,
  loadingReviews: false,
  product: null,
  reviews: null,
  productError: null,
  reviewsError: null,
};

const ProductDetails = createSlice({
  name: "productDetails",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProductDetails.pending, (state, action) => {
        state.loadingProduct = true;
      })
      .addCase(getProductDetails.fulfilled, (state, action) => {
        
        state.product = action.payload.product;
        state.loadingProduct = false;
      })
      .addCase(getProductDetails.rejected, (state, action) => {
        state.loadingProduct = false;
        state.productError = action.payload;
      })
      .addCase(getProductReviews.pending, (state, action) => {
        state.loadingReviews = true;
      })
      .addCase(getProductReviews.fulfilled, (state, action) => {
        
        state.reviews = action.payload.reviews;
        state.loadingReviews = false;
      })
      .addCase(getProductReviews.rejected, (state, action) => {
        state.loadingReviews = false;
        state.reviewsError = action.payload;
      })
  },
});

export default ProductDetails.reducer;
