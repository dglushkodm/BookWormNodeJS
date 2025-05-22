import axios from 'axios';

const API_URL = 'http://localhost:3000/api/auth';

const register = async (userData) => {
    console.log(userData);
    const response = await axios.post(`${API_URL}/register`, userData);

    if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
    }

    return response.data;
};

const login = async (credentials) => {
    const response = await axios.post(`${API_URL}/login`, credentials);

    if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
    }

    return response.data;
};

const getMe = async () => {
    const response = await axios.get(`${API_URL}/me`);
    return response.data;
};

const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
};

// Установка токена при инициализации приложения
const token = localStorage.getItem('token');
if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export default {
    register,
    login,
    getMe,
    logout
};