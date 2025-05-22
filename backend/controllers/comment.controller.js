import db from '../models/index.js';
import ApiError from '../exceptions/api.error.js';

class CommentController {
    async getCommentsByBook(req, res, next) {
        try {
            const { bookId } = req.params;

            const comments = await db.Comment.findAll({
                where: { bookId },
                include: [{
                    model: db.User,
                    attributes: ['id', 'name', 'image']
                }],
                order: [['createdAt', 'DESC']]
            });

            res.json(comments);
        } catch (error) {
            next(error);
        }
    }

    async createComment(req, res, next) {
        try {
            if (req.user.role !== 'reader' && req.user.role !== 'admin') {
                throw ApiError.Forbidden();
            }

            const bookId = parseInt(req.params.bookId);
            if (isNaN(bookId)) {
                throw ApiError.BadRequest('Некорректный ID книги');
            }

            const { content } = req.body;

            if (!content) {
                throw ApiError.BadRequest('Содержание комментария обязательно');
            }

            const book = await db.Book.findByPk(bookId);
            if (!book) {
                throw ApiError.NotFound('Книга не найдена');
            }

            const comment = await db.Comment.create({
                content,
                userId: req.user.id,
                bookId
            });

            const createdComment = await db.Comment.findByPk(comment.id, {
                include: [{
                    model: db.User,
                    attributes: ['id', 'name', 'image']
                }]
            });

            res.status(201).json(createdComment);
        } catch (error) {
            next(error);
        }
    }

    async updateComment(req, res, next) {
        try {
            const { id } = req.params;
            const { content } = req.body;

            if (!content) {
                throw ApiError.BadRequest('Содержание комментария обязательно');
            }

            const comment = await db.Comment.findByPk(id);
            if (!comment) {
                throw ApiError.NotFound('Комментарий не найден');
            }

            // Проверяем, является ли пользователь автором комментария
            if (comment.userId !== req.user.id && req.user.role !== 'admin') {
                throw ApiError.Forbidden();
            }

            await comment.update({ content });

            const updatedComment = await db.Comment.findByPk(id, {
                include: [{
                    model: db.User,
                    attributes: ['id', 'name', 'image']
                }]
            });

            res.json(updatedComment);
        } catch (error) {
            next(error);
        }
    }

    async deleteComment(req, res, next) {
        try {
            const { id } = req.params;

            const comment = await db.Comment.findByPk(id);
            if (!comment) {
                throw ApiError.NotFound('Комментарий не найден');
            }

            // Проверяем, является ли пользователь автором комментария или админом
            if (comment.userId !== req.user.id && req.user.role !== 'admin') {
                throw ApiError.Forbidden();
            }

            await comment.destroy();
            res.json({ message: 'Комментарий успешно удален' });
        } catch (error) {
            next(error);
        }
    }
}

export default new CommentController(); 