import axios from 'axios';

const getAllAuthors = async () => {
    const response = await axios.get('/api/authors');
    return response.data;
};

const getAuthorById = async (id) => {
    const response = await axios.get(`/api/authors/${id}`);
    return response.data;
};

const createAuthor = async (authorData) => {
    const response = await axios.post('/api/authors', authorData);
    return response.data;
};

const updateAuthor = async (id, authorData) => {
    const response = await axios.put(`/api/authors/${id}`, authorData);
    return response.data;
};

const deleteAuthor = async (id) => {
    await axios.delete(`/api/authors/${id}`);
};

export default {
    getAllAuthors,
    getAuthorById,
    createAuthor,
    updateAuthor,
    deleteAuthor
};