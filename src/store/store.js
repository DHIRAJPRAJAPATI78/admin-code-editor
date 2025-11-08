import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/authSlice';
import probemReducer from '../features/problemSlice';
const store = configureStore({
    reducer: {
        admin:authReducer,
        problem:probemReducer
    }
})
export default store;