import { configureStore } from '@reduxjs/toolkit';
import productsReducer from '../slices/productSlice';
import categoriesReducer from '../slices/categorySlice';
import usersReducer from '../slices/userSlice';
import authReducer from '../slices/authSlice';
import couponsReducer from '../slices/couponSlice';
import ordersReducer from '../slices/orderSlice';
import uiSettingsReducer from '../slices/uiSettingsSlice';
import reviewsReducer from '../slices/reviewSlice';
import customersReducer from '../slices/customerSlice';

// import Cookies from 'js-cookie';
import { User } from '../../types/user';

// Get user data & token from cookies
// const userData = Cookies.get('userData');
// const token = Cookies.get('token');

const userData = typeof window !== 'undefined' ? localStorage.getItem('userData') : null;
const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

const initialUser = userData ? (JSON.parse(userData) as User) : null;
const store = configureStore({
  reducer: {
    products: productsReducer,
    coupons: couponsReducer,
    categories: categoriesReducer,
    users: usersReducer,
    reviews: reviewsReducer,
    uiSettings: uiSettingsReducer,
    auth: authReducer,
    orders: ordersReducer,
    customers: customersReducer,
  },
  preloadedState: {
    auth: {
      user: initialUser,
      token: token || null, // Ensure token is loaded from cookies
      isAuthenticated: !!token, // Check if the user is authenticated
      loading: false,
      error: null,
    },
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
