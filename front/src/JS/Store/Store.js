// redux/store.js

import { configureStore } from "@reduxjs/toolkit";

// Import reducers
import productReducer from "../Reducer/ProductReducer";
import orderReducer from "../Reducer/OrderReducer";
import adminReducer from "../Reducer/AdminReducer";
import basketReducer from "../Reducer/basketreducer";

// Create Redux store
const store = configureStore({
  reducer: {
    product: productReducer, // handles product list, create, update, delete
    order: orderReducer, // handles order creation and status
    admin: adminReducer, // handles admin login and session
    basket: basketReducer, // <-- Add this line
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Allows non-serializable values like FormData if needed
    }),
  devTools: process.env.NODE_ENV !== "production", // enable Redux DevTools in development
});

export default store;
