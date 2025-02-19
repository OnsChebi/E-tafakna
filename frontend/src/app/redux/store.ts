import {configureStore}from '@reduxjs/toolkit';
import foldersReducer from './slices/foldersSlice'
export const store = configureStore({
    reducer:{
        folders:foldersReducer,
    },
    middleware: getDefaultMiddleware =>getDefaultMiddleware(),

});

export type RootState = ReturnType <typeof store.getState>;
export type AppDispatch = typeof store.dispatch;