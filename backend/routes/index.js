import { Router } from 'express';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import bookRoutes from './book.routes.js';
import authorRoutes from './author.routes.js';
import genreRoutes from './genre.routes.js';
import chapterRoutes from './chapter.routes.js';
import commentRoutes from './comment.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/books', bookRoutes);
router.use('/authors', authorRoutes);
router.use('/genres', genreRoutes);
router.use('/chapters', chapterRoutes);
router.use('/comments', commentRoutes);

export default router; 