import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice.js';
import {booksReducer} from './booksSlice.js';
import userReducer from './userSlice.js';
import metaReducer from './metaSlice';
import authorReducer from './authorSlice.js';
import chaptersReducer from './chaptersSlice.js';
import genreReducer from './genresSlice.js';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        books: booksReducer,
        user: userReducer,
        meta: metaReducer,
        authors: authorReducer,
        chapters: chaptersReducer,
        genres: genreReducer,
    }
});