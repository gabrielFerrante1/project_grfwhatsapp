import { configureStore } from '@reduxjs/toolkit'
import authSlice from './slices/authSlice';
import appSlice from './slices/appSlice';
import chatSlice from './slices/chatSlice';

export const store = configureStore({
    reducer: {
        app: appSlice,
        auth: authSlice,
        chat: chatSlice
    }
});

export type RootState = ReturnType<typeof store.getState>;