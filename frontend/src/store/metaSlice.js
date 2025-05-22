import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import metaService from '../services/meta.service';

export const fetchGenres = createAsyncThunk(
    'meta/fetchGenres',
    async () => await metaService.getGenres()
);

export const fetchAuthors = createAsyncThunk(
    'meta/fetchAuthors',
    async () => await metaService.getAuthors()
);

const metaSlice = createSlice({
    name: 'meta',
    initialState: {
        genres: [],
        authors: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchGenres.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchGenres.fulfilled, (state, action) => {
                state.loading = false;
                state.genres = action.payload;
            })
            .addCase(fetchGenres.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(fetchAuthors.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAuthors.fulfilled, (state, action) => {
                state.loading = false;
                state.authors = action.payload;
            })
            .addCase(fetchAuthors.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});

export default metaSlice.reducer;