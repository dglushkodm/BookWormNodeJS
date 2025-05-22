import axios from 'axios';

const getAllGenres = async () => {
    const response = await axios.get('/api/genres');
    return response.data;
};

const getGenreById = async (id) => {
    const response = await axios.get(`/api/genres/${id}`);
    return response.data;
};

const getBooksByGenre = async (id) => {
    const response = await axios.get(`/api/genres/${id}/books`);
    return response.data;
};

const createGenre = async (genreData) => {
    const response = await axios.post('/api/genres', genreData);
    return response.data;
};

const updateGenre = async (id, genreData) => {
    const response = await axios.put(`/api/genres/${id}`, genreData);
    return response.data;
};

const deleteGenre = async (id) => {
    await axios.delete(`/api/genres/${id}`);
};


export default {
    getAllGenres,
    getGenreById,
    getBooksByGenre,
    createGenre,
    updateGenre,
    deleteGenre
};