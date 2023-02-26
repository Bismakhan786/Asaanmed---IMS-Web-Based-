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

export const deleteManyProducts = createAsyncThunk(
  "products/delete/many",
  async (productids, { rejectWithValue }) => {
    try {
      console.log(productids);
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/admin/products/delete/many`,
        { productids },
        { withCredentials: true }
      );
      console.log(response.data);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const updateStatusOfManyProducts = createAsyncThunk(
  "products/update/status",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/admin/products/update/status`,
        data,
        { withCredentials: true }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const updateStockOfManyProducts = createAsyncThunk(
  "products/update/stock",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/admin/products/update/stock`,
        data,
        { withCredentials: true }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const updateCategoryOfManyProducts = createAsyncThunk(
  "products/update/category",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/admin/products/update/category`,
        data,
        { withCredentials: true }
      );

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
  deleteManyInProcess: false,
  updationInProcess: false,
  updateStockInProcess: false,
  updateStatusInProcess: false,
  updateCategoryInProcess: false,
  products: [],
  deletedCount: null,
  updatedCount: null,
  productsCount: null,
  mostSellingProducts: [],
  selectedProducts: [],
  updatedProduct: null,
  selectFlag: false,
  error: null,
  creationError: null,
  deletionError: null,
  deleteManyError: null,
  updationError: null,
  updateStockError: null,
  updateStatusError: null,
  updateCategoryError: null,
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
        state.mostSellingProducts = _.orderBy(
          action.payload.products,
          "numOfOrders",
          "desc"
        ).slice(0, 5);
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
        state.products = action.payload.products;
        state.productsCount = action.payload.productCount;
        state.loadingProducts = false;
        state.deletionInProcess = false;
        state.deletionError = null;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loadingProducts = false;
        state.deletionInProcess = false;
        state.deletionError = action.payload;
      })
      .addCase(deleteManyProducts.pending, (state, action) => {
        state.loadingProducts = true;
        state.deleteManyInProcess = true;
      })
      .addCase(deleteManyProducts.fulfilled, (state, action) => {
        state.products = action.payload.products;
        state.productsCount = action.payload.productCount;
        state.deletedCount = action.payload.deletedCount;
        state.loadingProducts = false;
        state.deleteManyInProcess = false;
        state.deleteManyError = null;
      })
      .addCase(deleteManyProducts.rejected, (state, action) => {
        state.loadingProducts = false;
        state.deleteManyInProcess = false;
        state.deleteManyError = action.payload;
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
      })
      .addCase(updateStatusOfManyProducts.pending, (state, action) => {
        state.loadingProducts = true;
        state.updateStatusInProcess = true;
      })
      .addCase(updateStatusOfManyProducts.fulfilled, (state, action) => {
        state.products = action.payload.products;
        state.productsCount = action.payload.productCount;
        state.updatedCount = action.payload.updatedCount;
        state.loadingProducts = false;
        state.updateStatusInProcess = false;
        state.updateStatusError = null;
      })
      .addCase(updateStatusOfManyProducts.rejected, (state, action) => {
        state.loadingProducts = false;
        state.updateStatusInProcess = false;
        state.updateStatusError = action.payload;
      })
      .addCase(updateStockOfManyProducts.pending, (state, action) => {
        state.loadingProducts = true;
        state.updateStockInProcess = true;
      })
      .addCase(updateStockOfManyProducts.fulfilled, (state, action) => {
        state.products = action.payload.products;
        state.productsCount = action.payload.productCount;
        state.updatedCount = action.payload.updatedCount;
        state.loadingProducts = false;
        state.updateStockInProcess = false;
        state.updateStockError = null;
      })
      .addCase(updateStockOfManyProducts.rejected, (state, action) => {
        state.loadingProducts = false;
        state.updateStockInProcess = false;
        state.updateStockError = action.payload;
      })
      .addCase(updateCategoryOfManyProducts.pending, (state, action) => {
        state.loadingProducts = true;
        state.updateCategoryInProcess = true;
      })
      .addCase(updateCategoryOfManyProducts.fulfilled, (state, action) => {
        state.products = action.payload.products;
        state.productsCount = action.payload.productCount;
        state.updatedCount = action.payload.updatedCount;
        state.loadingProducts = false;
        state.updateCategoryInProcess = false;
        state.updateCategoryError = null;
      })
      .addCase(updateCategoryOfManyProducts.rejected, (state, action) => {
        state.loadingProducts = false;
        state.updateCategoryInProcess = false;
        state.updateCategoryError = action.payload;
      });
  },
});

export const { selectAll, selectProduct, UnselectProduct, unSelectAll } =
  ProductsSlice.actions;

export default ProductsSlice.reducer;
