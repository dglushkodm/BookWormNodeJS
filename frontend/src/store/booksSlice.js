import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import bookService from '../services/book.service.js';

// Все AsyncThunks
export const fetchBooks = createAsyncThunk(
    'books/fetchBooks',
    async () => {
        const response = await fetch('http://localhost:3000/api/books');
        if (!response.ok) {
            throw new Error('Failed to fetch books');
        }
        return response.json();
    }
);

export const fetchFeaturedBooks = createAsyncThunk(
    'books/fetchFeaturedBooks',
    async (_, { rejectWithValue }) => {
        try {
            return await bookService.getFeaturedBooks();
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchBookById = createAsyncThunk(
    'books/fetchBookById',
    async (id) => {
        const response = await fetch(`http://localhost:3000/api/books/${id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch book');
        }
        return response.json();
    }
);

export const createBook = createAsyncThunk(
    'books/createBook',
    async (bookData, { rejectWithValue }) => {
        try {
            return await bookService.createBook(bookData);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateBook = createAsyncThunk(
    'books/updateBook',
    async ({ id, ...bookData }, { rejectWithValue }) => {
        try {
            return await bookService.updateBook(id, bookData);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const deleteBook = createAsyncThunk(
    'books/deleteBook',
    async (id, { rejectWithValue }) => {
        try {
            await bookService.deleteBook(id);
            return id;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const filterBooks = createAsyncThunk(
    'books/filterBooks',
    async (filters) => {
        const queryParams = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value) {
                queryParams.append(key, value);
            }
        });

        const response = await fetch(`http://localhost:3000/api/books?${queryParams.toString()}`);
        if (!response.ok) {
            throw new Error('Failed to filter books');
        }
        return response.json();
    }
);

export const rateBook = createAsyncThunk(
    'books/rateBook',
    async ({ bookId, rating }) => {
        const response = await fetch(`http://localhost:3000/api/books/${bookId}/rate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ rating })
        });

        if (!response.ok) {
            throw new Error('Failed to rate book');
        }

        return response.json();
    }
);

export const toggleFavorite = createAsyncThunk(
    'user/toggleFavorite',
    async (bookId, { rejectWithValue, getState }) => {
        try {
            const { user } = getState().auth;
            if (!user) {
                throw new Error('Необходимо авторизоваться');
            }

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

export const addGenresToBook = createAsyncThunk(
    'books/addGenres',
    async ({ bookId, genreIds }, { rejectWithValue }) => {
        try {
            return await bookService.addGenresToBook(bookId, genreIds);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const removeGenresFromBook = createAsyncThunk(
    'books/removeGenres',
    async ({ bookId, genreIds }, { rejectWithValue }) => {
        try {
            return await bookService.removeGenresFromBook(bookId, genreIds);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateBookGenres = createAsyncThunk(
    'books/updateGenres',
    async ({ bookId, genreIds }, { rejectWithValue }) => {
        try {
            return await bookService.updateBookGenres(bookId, genreIds);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const booksSlice = createSlice({
    name: 'books',
    initialState: {
        books: [],
        filteredBooks: [],
        featuredBooks: [],
        book: null,
        loading: false,
        error: null,
        favorites: []
    },
    reducers: {
        clearBookState: (state) => {
            state.book = null;
        },
        resetLoading: (state) => {
            state.loading = false;
        },
        resetFilteredBooks: (state) => {
            state.filteredBooks = state.books; // Возвращаем оригинальный список
        }
    },
    extraReducers: (builder) => {
        builder
            // Сначала все конкретные cases
            .addCase(fetchBooks.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBooks.fulfilled, (state, action) => {
                state.loading = false;
                state.books = action.payload;
            })
            .addCase(fetchBooks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(fetchFeaturedBooks.fulfilled, (state, action) => {
                state.loading = false;
                state.featuredBooks = action.payload;
            })
            .addCase(fetchBookById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBookById.fulfilled, (state, action) => {
                state.loading = false;
                state.book = action.payload;
            })
            .addCase(fetchBookById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(filterBooks.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(filterBooks.fulfilled, (state, action) => {
                state.loading = false;
                state.books = action.payload;
            })
            .addCase(filterBooks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(createBook.fulfilled, (state, action) => {
                state.loading = false;
                state.books.push(action.payload);
            })
            .addCase(updateBook.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.books.findIndex(book => book.id === action.payload.id);
                if (index !== -1) {
                    state.books[index] = action.payload;
                }
                if (state.book?.id === action.payload.id) {
                    state.book = action.payload;
                }
            })
            .addCase(deleteBook.fulfilled, (state, action) => {
                state.loading = false;
                state.books = state.books.filter(book => book.id !== action.payload);
                if (state.book?.id === action.payload) {
                    state.book = null;
                }
            })
            .addCase(rateBook.fulfilled, (state, action) => {
                state.loading = false;
                if (state.book && state.book.id === action.payload.book.id) {
                    state.book = action.payload.book;
                }
            })
            .addCase(toggleFavorite.fulfilled, (state, action) => {
                const bookId = action.payload;
                const isFavorite = state.favorites.some(id => id === bookId);
                state.favorites = isFavorite
                    ? state.favorites.filter(id => id !== bookId)
                    : [...state.favorites, bookId];
            })
            .addCase(addGenresToBook.fulfilled, (state, action) => {
                updateBookWithGenres(state, action.payload);
            })
            .addCase(removeGenresFromBook.fulfilled, (state, action) => {
                updateBookWithGenres(state, action.payload);
            })
            .addCase(updateBookGenres.fulfilled, (state, action) => {
                updateBookWithGenres(state, action.payload);
            })

            // Затем общие matchers (должны идти ПОСЛЕ всех addCase)
            .addMatcher(
                (action) => action.type.startsWith('books/') && action.type.endsWith('/pending'),
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                (action) => action.type.startsWith('books/') && action.type.endsWith('/rejected'),
                (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
                }
            );
    }
});

// Вспомогательная функция остается без изменений
function updateBookWithGenres(state, updatedBook) {
    const index = state.books.findIndex(book => book.id === updatedBook.id);
    if (index !== -1) {
        state.books[index] = updatedBook;
    }
    if (state.book?.id === updatedBook.id) {
        state.book = updatedBook;
    }
}

export const { clearBookState, resetFilteredBooks  } = booksSlice.actions;
export const booksReducer = booksSlice.reducer;