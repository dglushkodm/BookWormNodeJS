import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import bookRoutes from './routes/book.routes.js';
import chapterRoutes from './routes/chapter.routes.js';
import genreRoutes from './routes/genre.routes.js';
import authorRoutes from './routes/author.routes.js';
import commentRoutes from './routes/comment.routes.js';
import errorMiddleware from './middleware/error.middleware.js';

const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Маршруты
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/chapters', chapterRoutes);
app.use('/api/genres', genreRoutes);
app.use('/api/authors', authorRoutes);
app.use('/api/comments', commentRoutes);

// Обработка ошибок
app.use(errorMiddleware);

export default app;