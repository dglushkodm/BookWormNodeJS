import { Router } from 'express';
import commentController from '../controllers/comment.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = Router();

// Get comments for a book
router.get('/book/:bookId', commentController.getCommentsByBook);

// Create a new comment (requires authentication)
router.post('/book/:bookId', authMiddleware, commentController.createComment);

// Update a comment (requires authentication)
router.put('/:id', authMiddleware, commentController.updateComment);

// Delete a comment (requires authentication)
router.delete('/:id', authMiddleware, commentController.deleteComment);

export default router; 