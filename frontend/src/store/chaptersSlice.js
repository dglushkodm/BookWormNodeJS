import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import chapterService from '../services/chapter.service';

export const fetchChaptersByBook = createAsyncThunk(
    'chapters/fetchByBook',
    async (bookId, { rejectWithValue }) => {
        try {
            return await chapterService.getChaptersByBook(bookId);
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const fetchChapterById = createAsyncThunk(
    'chapters/fetchChapterById',
    async ({ bookId, chapterId }, { rejectWithValue }) => {
        try {
            return await chapterService.getChapterById(bookId, chapterId);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);


export const addChapter = createAsyncThunk(
    'chapters/create',
    async ({ bookId, chapterData }, { rejectWithValue }) => {
        try {
            console.log('Sending to API:', { bookId, chapterData });
            const response = await chapterService.createChapter(bookId, chapterData);
            console.log('slice res', response);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const editChapter = createAsyncThunk(
    'chapters/update',
    async ({ id, chapterData }, { rejectWithValue }) => {
        try {
            const response = await chapterService.updateChapter(id, chapterData);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const removeChapter = createAsyncThunk(
    'chapters/delete',
    async (id, { rejectWithValue }) => {
        try {
            await chapterService.deleteChapter(id);
            return id;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const reorderChapters = createAsyncThunk(
    'chapters/reorder',
    async ({ bookId, chapters }, { rejectWithValue }) => {
        try {
            return await chapterService.reorderChapters(bookId, chapters);
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const chaptersSlice = createSlice({
    name: 'chapters',
    initialState: {
        chapters: [],
        currentChapter: null,
        loading: false,
        error: null,
        status: 'idle'
    },
    reducers: {
        clearCurrentChapter: (state) => {
            state.currentChapter = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Получение глав книги
            .addCase(fetchChaptersByBook.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.status = 'loading';
            })
            .addCase(fetchChaptersByBook.fulfilled, (state, action) => {
                state.loading = false;
                state.chapters = action.payload;
                state.status = 'succeeded';
            })
            .addCase(fetchChaptersByBook.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.status = 'failed';
            })

            // Получение главы по ID
            .addCase(fetchChapterById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchChapterById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentChapter = action.payload;
            })
            .addCase(fetchChapterById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addChapter.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addChapter.fulfilled, (state, action) => {
                state.loading = false;
                console.log('slice action ', action.payload);
                state.chapters.push(action.payload);
            })
            .addCase(addChapter.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Создание главы
            //.addCase(addChapter.fulfilled, (state, action) => {
             //   state.chapters.push(action.payload);
            //})

            // Обновление главы
            .addCase(editChapter.fulfilled, (state, action) => {
                const index = state.chapters.findIndex(c => c.id === action.payload.id);
                if (index !== -1) {
                    state.chapters[index] = action.payload;
                }
                state.currentChapter = action.payload;
            })

            // Удаление главы
            .addCase(removeChapter.fulfilled, (state, action) => {
                state.chapters = state.chapters.filter(c => c.id !== action.payload);
            })

            // Изменение порядка глав
            .addCase(reorderChapters.fulfilled, (state, action) => {
                state.chapters = action.payload;
            });
    }
});

export const { clearCurrentChapter } = chaptersSlice.actions;
export default chaptersSlice.reducer;