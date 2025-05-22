import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './assets/index.css';
import axios from 'axios';

// Инициализация токена для axios
const token = localStorage.getItem('token');
if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

const container = document.getElementById('root');
const root = createRoot(container);

function renderApp() {
    root.render(
        <App />
    );
}

// Обработка ошибок при рендеринге
try {
    renderApp();
} catch (error) {
    console.error('Failed to render app:', error);
    root.render(
        <div style={{ padding: '20px', color: 'red' }}>
            <h1>Произошла ошибка</h1>
            <p>Попробуйте перезагрузить страницу</p>
            <button onClick={() => window.location.reload()}>Перезагрузить</button>
        </div>
    );
}