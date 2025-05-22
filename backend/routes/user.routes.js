import { Router } from 'express';
import userController from '../controllers/user.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = Router();

// Маршруты для администратора
router.get('/', authMiddleware, userController.getAllUsers);
router.patch('/:userId/role', authMiddleware, userController.updateUserRole);
router.delete('/:userId', authMiddleware, userController.deleteUser);

// Profile update route
router.patch('/profile', authMiddleware, userController.updateProfile);

// Маршруты для избранного (доступны авторизованным пользователям)
router.get('/favorites', authMiddleware, userController.getFavorites);
router.post('/favorites', authMiddleware, userController.addFavorite);
router.delete('/favorites/:bookId', authMiddleware, userController.removeFavorite);

export default router;