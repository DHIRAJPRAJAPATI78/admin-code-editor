import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/authSlice';
import probemReducer from '../features/problemSlice';
import profileReducer from '../features/profileSlice';
const store = configureStore({
    reducer: {
        admin:authReducer,
        problem:probemReducer,
        profile:profileReducer
    }
})
export default store;