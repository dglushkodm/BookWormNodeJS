import { Router } from 'express';
import chapterController from '../controllers/chapter.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = Router();

router.get('/book/:bookId', chapterController.getChaptersByBook);
router.get('/:id', chapterController.getChapterById);
router.post('/book/:bookId', authMiddleware, chapterController.createChapter);
router.put('/:id', authMiddleware, chapterController.updateChapter);
router.delete('/:id', authMiddleware, chapterController.deleteChapter);

export default router;