import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authorsService from '../services/author.service';

export const fetchAuthors = createAsyncThunk(
    'authors/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            return await authorsService.getAllAuthors();
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const createAuthor = createAsyncThunk(
    'authors/create',
    async (authorData, { rejectWithValue }) => {
        try {
            return await authorsService.createAuthor(authorData);
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const updateAuthor = createAsyncThunk(
    'authors/update',
    async ({ id, authorData }, { rejectWithValue }) => {
        try {
            return await authorsService.updateAuthor(id, authorData);
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const deleteAuthor = createAsyncThunk(
    'authors/delete',
    async (id, { rejectWithValue }) => {
        try {
            await authorsService.deleteAuthor(id);
            return id;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const authorSlice = createSlice({
    name: 'authors',
    initialState: {
        authors: [],
        status: 'idle',
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAuthors.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchAuthors.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.authors = action.payload;
            })
            .addCase(fetchAuthors.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(createAuthor.fulfilled, (state, action) => {
                state.authors.push(action.payload);
            })
            .addCase(updateAuthor.fulfilled, (state, action) => {
                const index = state.authors.findIndex(a => a.id === action.payload.id);
                if (index !== -1) {
                    state.authors[index] = action.payload;
                }
            })
            .addCase(deleteAuthor.fulfilled, (state, action) => {
                state.authors = state.authors.filter(a => a.id !== action.payload);
            });
    }
});

export default authorSlice.reducer;