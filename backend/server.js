import app from './app.js';
import db from './models/index.js';

const PORT = process.env.PORT || 5000;

// Проверка подключения к БД и запуск сервера
db.sequelize.authenticate()
    .then(() => {
        console.log('Connection to DB has been established successfully.');
        return db.sequelize.sync(); // Синхронизация моделей с БД
    })
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });