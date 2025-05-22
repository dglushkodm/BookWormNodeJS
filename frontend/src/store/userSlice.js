import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import userService from '../services/user.service';

const userSlice = createSlice({
    name: 'user',
    initialState: {
        favorites: [],
        users: [],
        loading: false,
        error: null,
        currentUser: null
    },
    reducers: {
        setCurrentUser: (state, action) => {
            state.currentUser = action.payload;
        }
    },
    extraReducers: (builder) => {
        // Для админ-функционала
        builder
            .addCase(fetchAllUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload;
            })
            .addCase(fetchAllUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(updateUserRole.fulfilled, (state, action) => {
                const user = state.users.find(u => u.id === action.payload.id);
                if (user) user.role = action.payload.role;
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.users = state.users.filter(u => u.id !== action.payload);
            })
            // Для избранного
            .addCase(fetchFavorites.fulfilled, (state, action) => {
                state.favorites = action.payload;
            })
            .addCase(toggleFavorite.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(toggleFavorite.fulfilled, (state, action) => {
                state.loading = false;
                state.favorites = action.payload;
            })
            .addCase(toggleFavorite.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(updateProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});

// Async Thunks для админ-функционала
export const fetchAllUsers = createAsyncThunk(
    'users/fetchAll',
    async () => await userService.getAllUsers()
);

export const updateUserRole = createAsyncThunk(
    'users/updateRole',
    async ({ userId, role }) => await userService.updateUserRole(userId, role)
);

export const deleteUser = createAsyncThunk(
    'users/delete',
    async (userId) => {
        await userService.deleteUser(userId);
        return userId;
    }
);

// Async Thunks для избранного
export const fetchFavorites = createAsyncThunk(
    'user/fetchFavorites',
    async (_, { rejectWithValue }) => {
        try {
            const response = await userService.getFavorites();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const toggleFavorite = createAsyncThunk(
    'user/toggleFavorite',
    async (bookId, { rejectWithValue, getState }) => {
        try {
            const { favorites } = getState().user;
            const isFavorite = favorites.some(fav => fav.id === bookId);

            if (isFavorite) {
                await userService.removeFavorite(bookId);
                return favorites.filter(fav => fav.id !== bookId);
            } else {
                const response = await userService.addFavorite(bookId);
                return [...favorites, response.data];
            }
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateProfile = createAsyncThunk(
    'users/updateProfile',
    async (profileData) => await userService.updateProfile(profileData)
);

export const { setCurrentUser } = userSlice.actions;
export default userSlice.reducer;