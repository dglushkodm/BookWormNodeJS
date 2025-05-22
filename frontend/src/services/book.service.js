import axios from 'axios';

const API_URL = '/api/books';

const getAllBooks = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

const getFeaturedBooks = async () => {
    const response = await axios.get(`${API_URL}?rateFrom=4&sort=rate_desc&limit=6`);
    return response.data;
};

const getBookById = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};

const filterBooks = async (filters) => {
    const response = await axios.get(API_URL, { params: filters });
    return response.data;
};

const rateBook = async (bookId, rating) => {
    const response = await axios.post(`${API_URL}/${bookId}/rate`, { rating });
    return response.data;
};

const addToFavorites = async (bookId) => {
    await axios.post('/api/users/favorites', { bookId });
};

const removeFromFavorites = async (bookId) => {
    await axios.delete(`/api/users/favorites/${bookId}`);
};

const createBook = async (bookData) => {
    const response = await axios.post('/api/books', bookData);
    return response.data;
};

const updateBook = async (id, bookData) => {
    const response = await axios.put(`/api/books/${id}`, bookData);
    return response.data;
};

const deleteBook = async (id) => {
    await axios.delete(`/api/books/${id}`);
};

const addGenresToBook = async (bookId, genreIds) => {
    const response = await axios.post(`${API_URL}/${bookId}/genres`, { genreIds });
    return response.data;
};

const removeGenresFromBook = async (bookId, genreIds) => {
    const response = await axios.delete(`${API_URL}/${bookId}/genres`, { data: { genreIds } });
    return response.data;
};

const updateBookGenres = async (bookId, genreIds) => {
    const response = await axios.put(`${API_URL}/${bookId}/genres`, { genreIds });
    return response.data;
};

export default {
    getAllBooks,
    getFeaturedBooks,
    getBookById,
    filterBooks,
    rateBook,
    addToFavorites,
    removeFromFavorites,
    createBook,
    updateBook,
    deleteBook,
    addGenresToBook,
    removeGenresFromBook,
    updateBookGenres
};