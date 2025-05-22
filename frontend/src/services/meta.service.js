import axios from 'axios';

const getGenres = async () => {
    const response = await axios.get('/api/genres');
    return response.data;
};

const getAuthors = async () => {
    const response = await axios.get('/api/authors');
    return response.data;
};

export default {
    getGenres,
    getAuthors
};