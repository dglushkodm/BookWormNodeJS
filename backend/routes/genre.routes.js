import { Router } from 'express';
import genreController from '../controllers/genre.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', genreController.getAllGenres);
router.get('/:id', genreController.getGenreById);
router.get('/:id/books', genreController.getBooksByGenre);
router.post('/', authMiddleware, genreController.createGenre);
router.put('/:id', authMiddleware, genreController.updateGenre);
router.delete('/:id', authMiddleware, genreController.deleteGenre);

export default router;