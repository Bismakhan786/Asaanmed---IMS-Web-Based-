import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import _ from "lodash";

export const getProductsFromAPI = createAsyncThunk(
  "products/getProducts",
  async (arg, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/products`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "products/delete",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API_URL}/admin/product/modify/${id}`,
        { withCredentials: true }
      );
      console.log(response.data);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const addProduct = createAsyncThunk(
  "products/create",
  async (productData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/admin/product/create`,
        productData,
        { withCredentials: true }
      );
      console.log(response.data);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const updateProduct = createAsyncThunk(
  "products/update",
  async ({ id, newData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/admin/product/modify/${id}`,
        newData,
        { withCredentials: true }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const initialState = {
  loadingProducts: false,
  creationInProcess: false,
  deletionInProcess: false,
  updationInProcess: false,
  products: [],
  productsCount: null,
  mostSellingProducts: [],
  selectedProducts: [],
  updatedProduct: null,
  deletedProduct: null,
  selectFlag: false,
  error: null,
  creationError: null,
  deletionError: null,
  updationError: null,
};

const ProductsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    selectAll: (state, action) => {
      state.selectedProducts = action.payload;
      state.selectFlag = true;
    },
    unSelectAll: (state, action) => {
      state.selectedProducts = [];
      state.selectFlag = false;
    },
    selectProduct: (state, action) => {
      state.selectedProducts.push(action.payload);
    },
    UnselectProduct: (state, action) => {
      const index = state.selectedProducts.indexOf(action.payload);
      state.selectedProducts.splice(index, 1);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProductsFromAPI.pending, (state, action) => {
        state.loadingProducts = true;
      })
      .addCase(getProductsFromAPI.fulfilled, (state, action) => {
        state.products = action.payload.products;
        state.productsCount = action.payload.productCount;
        state.mostSellingProducts = _.orderBy(action.payload.products, "numOfOrders", "desc").slice(0, 5)
        state.loadingProducts = false;
      })
      .addCase(getProductsFromAPI.rejected, (state, action) => {
        state.loadingProducts = false;
        state.error = action.payload;
      })
      .addCase(deleteProduct.pending, (state, action) => {
        state.loadingProducts = true;
        state.deletionInProcess = true;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(
          (product) => product._id !== action.payload.product._id
        );
        state.loadingProducts = false;
        state.deletionInProcess = false;
        state.deletionError = null;
        state.deletedProduct = action.payload.product;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loadingProducts = false;
        state.deletionInProcess = false;
        state.deletionError = action.payload;
      })
      .addCase(addProduct.pending, (state, action) => {
        state.creationInProcess = true;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.creationInProcess = false;
        state.products.push(action.payload.product);
        state.creationError = null;
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.creationInProcess = false;
        state.creationError = action.payload;
      })
      .addCase(updateProduct.pending, (state, action) => {
        state.updationInProcess = true;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.updatedProduct = action.payload.product;
        state.updationInProcess = false;
        state.updationError = null;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.updationInProcess = false;
        state.updationError = action.payload;
      });
  },
});

export const { selectAll, selectProduct, UnselectProduct, unSelectAll } =
  ProductsSlice.actions;

export default ProductsSlice.reducer;
