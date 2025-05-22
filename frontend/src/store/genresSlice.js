import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import genreService from '../services/genre.service';

export const fetchGenres = createAsyncThunk(
    'genres/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            return await genreService.getAllGenres();
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const fetchBooksByGenre = createAsyncThunk(
    'genres/fetchBooks',
    async (genreId, { rejectWithValue }) => {
        try {
            return await genreService.getBooksByGenre(genreId);
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const createGenre = createAsyncThunk(
    'genres/create',
    async (genreData, { rejectWithValue }) => {
        try {
            return await genreService.createGenre(genreData);
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const updateGenre = createAsyncThunk(
    'genres/update',
    async ({ id, genreData }, { rejectWithValue }) => {
        try {
            return await genreService.updateGenre(id, genreData);
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const deleteGenre = createAsyncThunk(
    'genres/delete',
    async (id, { rejectWithValue }) => {
        try {
            await genreService.deleteGenre(id);
            return id;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const genreSlice = createSlice({
    name: 'genres',
    initialState: {
        genres: [],
        booksByGenre: [],
        status: 'idle',
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchGenres.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchGenres.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.genres = action.payload;
            })
            .addCase(fetchGenres.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(fetchBooksByGenre.fulfilled, (state, action) => {
                state.booksByGenre = action.payload;
            })
            .addCase(createGenre.fulfilled, (state, action) => {
                state.genres.push(action.payload);
            })
            .addCase(updateGenre.fulfilled, (state, action) => {
                const index = state.genres.findIndex(g => g.id === action.payload.id);
                if (index !== -1) {
                    state.genres[index] = action.payload;
                }
            })
            .addCase(deleteGenre.fulfilled, (state, action) => {
                state.genres = state.genres.filter(g => g.id !== action.payload);
            });
    }
});

export default genreSlice.reducer;