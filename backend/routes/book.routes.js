import { Router } from 'express';
import bookController from '../controllers/book.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', bookController.getAllBooks);
router.get('/:id', bookController.getBookById);
router.post('/', authMiddleware, bookController.createBook);
router.put('/:id', authMiddleware, bookController.updateBook);
router.delete('/:id', authMiddleware, bookController.deleteBook);
router.post('/:id/rate', authMiddleware, bookController.rateBook);
router.get('/:bookId/chapters/:chapterId',authMiddleware, bookController.getChapterById);

export default router;