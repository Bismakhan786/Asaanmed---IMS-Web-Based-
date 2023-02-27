import { configureStore } from '@reduxjs/toolkit';
import ProductsSlice from "./slices/ProductsSlice";
import AdminLoginSlice from './slices/AdminLoginSlice';
import OrdersSlice from './slices/OrdersSlice';
import UsersSlice from './slices/UsersSlice';
import CategoriesSlice from './slices/CategoriesSlice'
import ProductDetails from './slices/ProductDetails';
import MediaSlice from './slices/MediaSlice';

const reducer = {
    products: ProductsSlice,
    categories: CategoriesSlice,
    admin: AdminLoginSlice,
    orders: OrdersSlice,
    users: UsersSlice,
    productDetail: ProductDetails,
    media: MediaSlice
}

const store = configureStore({
    reducer
})

export default store;