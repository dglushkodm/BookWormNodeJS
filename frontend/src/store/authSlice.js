import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import authService from '../services/auth.service.js';

// Async thunks
export const register = createAsyncThunk(
    'auth/register',
    async (userData, { rejectWithValue }) => {
        try {
            console.log(userData);
            return await authService.register(userData);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const login = createAsyncThunk(
    'auth/login',
    async (credentials, { dispatch, rejectWithValue }) => {
        try {
            const response = await authService.login(credentials);
            // После логина сразу получаем актуального пользователя
            const user = await dispatch(getMe()).unwrap();
            return user;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const getMe = createAsyncThunk(
    'auth/getMe',
    async (_, { rejectWithValue }) => {
        try {
            const response = await authService.getMe();
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null
    },
    reducers: {
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            authService.logout();
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        },
        init: (state,action) => {
            state.user = action.payload;
            state.isAuthenticated = true;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                localStorage.setItem('user', JSON.stringify(action.payload));
                state.isAuthenticated = true;
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                localStorage.setItem('user', JSON.stringify(action.payload));
                state.isAuthenticated = true;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(getMe.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getMe.fulfilled, (state, action) => {
                console.log('getMe.fulfilled payload:', action.payload);
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
                localStorage.setItem('user', JSON.stringify(action.payload));
                console.log('Redux after getMe.fulfilled:', { user: state.user, isAuthenticated: state.isAuthenticated });
            })
            .addCase(getMe.rejected, (state, action) => {
                console.log('getMe.rejected payload:', action.payload);
                state.loading = false;
                state.error = action.payload;
                console.log('Redux after getMe.rejected:', { user: state.user, isAuthenticated: state.isAuthenticated });
            });
    }
});

export const { logout, init } = authSlice.actions;
export default authSlice.reducer;