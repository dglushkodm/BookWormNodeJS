import axios from 'axios';

const getAllUsers = async () => {
    const response = await axios.get('/api/users');
    return response.data;
};

const updateUserRole = async (userId, role) => {
    const response = await axios.patch(`/api/users/${userId}/role`, { role });
    return response.data;
};

const deleteUser = async (userId) => {
    await axios.delete(`/api/users/${userId}`);
};

const updateProfile = async (profileData) => {
    const response = await axios.patch('/api/users/profile', profileData);
    return response.data;
};

const getFavorites = async () => {
    const response = await axios.get('/api/users/favorites');
    return response;
};

const addFavorite = async (bookId) => {
    const response = await axios.post('/api/users/favorites', { bookId });
    return response;
};

const removeFavorite = async (bookId) => {
    await axios.delete(`/api/users/favorites/${bookId}`);
};

export default {
    getAllUsers,
    updateUserRole,
    deleteUser,
    updateProfile,
    getFavorites,
    addFavorite,
    removeFavorite
};