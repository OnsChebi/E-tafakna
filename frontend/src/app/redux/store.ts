import {configureStore}from '@reduxjs/toolkit';
import foldersReducer from './slices/foldersSlice'
import notesReducer from './slices/notesSlice'
export const store = configureStore({
    reducer:{
        folders:foldersReducer,
        notes:notesReducer
    },
    middleware: getDefaultMiddleware =>getDefaultMiddleware(),

});

export type RootState = ReturnType <typeof store.getState>;
export type AppDispatch = typeof store.dispatch;