import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/authSlice';
import probemReducer from '../features/problemSlice';
import profileReducer from '../features/profileSlice';
import contestReducer from '../features/contestSlice';
const store = configureStore({
    reducer: {
        admin:authReducer,
        problem:probemReducer,
        profile:profileReducer,
        contest:contestReducer,
    }
})
export default store;