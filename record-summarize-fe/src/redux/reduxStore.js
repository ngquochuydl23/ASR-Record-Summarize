import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import storeReducer from "./slices/storeSlice";


const store = configureStore({
  reducer: {
    user: userReducer,
    store: storeReducer 
  },
});

export default store;