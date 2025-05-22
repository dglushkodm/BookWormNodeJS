import axios from 'axios';

const getChaptersByBook = async (bookId) => {
    const response = await axios.get(`/api/chapters/book/${bookId}`);
    return response.data;
};

const getChapterById = async (bookId, chapterId) => {
    const response = await axios.get(`/api/books/${bookId}/chapters/${chapterId}`);
    return response.data;
};

const createChapter = async (bookId, chapterData) => {
    const response = await axios.post(`/api/chapters/book/${bookId}`, chapterData);
    return response.data;
};

const updateChapter = async (id, chapterData) => {
    const response = await axios.put(`/api/chapters/${id}`, chapterData);
    return response.data;
};

const deleteChapter = async (id) => {
    await axios.delete(`/api/chapters/${id}`);
    return id;
};

const reorderChapters = async (bookId, chapters) => {
    const response = await axios.patch(`/api/chapters/reorder`, { bookId, chapters });
    return response.data;
};

export default {
    getChaptersByBook,
    getChapterById,
    createChapter,
    updateChapter,
    deleteChapter,
    reorderChapters
};