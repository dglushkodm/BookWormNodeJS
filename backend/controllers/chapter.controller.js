import db from '../models/index.js';
import ApiError from "../exceptions/api.error.js";

class ChapterController {
    async getChaptersByBook(req, res, next) {
        try {
            const { bookId } = req.params;

            const chapters = await db.Chapter.findAll({
                where: { bookId },
                order: [
                    ['volume', 'ASC'],
                    ['number', 'ASC']
                ]
            });

            res.json(chapters);
        } catch (error) {
            next(error);
        }
    }

    async getChapterById(req, res, next) {
        try {
            const { id } = req.params;

            const chapter = await db.Chapter.findByPk(id, {
                include: {
                    model: db.Book,
                    attributes: ['id', 'name']
                }
            });

            if (!chapter) {
                throw ApiError.NotFound('Глава не найдена');
            }

            res.json(chapter);
        } catch (error) {
            next(error);
        }
    }

    async createChapter(req, res, next) {
        try {
            if (req.user.role !== 'admin') {
                throw ApiError.Forbidden();
            }

            const { bookId } = req.params;
            const { volume, number, content, title } = req.body;

            const book = await db.Book.findByPk(bookId);
            if (!book) {
                throw ApiError.NotFound('Книга не найдена');
            }
            console.log(req.body);
            const chapter = await db.Chapter.create({
                bookId,
                volume,
                number,
                content,
                title
            });
            console.log(chapter);
            res.status(201).json(chapter);
        } catch (error) {
            next(error);
        }
    }

    async updateChapter(req, res, next) {
        try {
            if (req.user.role !== 'admin') {
                throw ApiError.Forbidden();
            }

            const { id } = req.params;
            const { volume, number, content, title } = req.body;

            const chapter = await db.Chapter.findByPk(id);
            if (!chapter) {
                throw ApiError.NotFound('Глава не найдена');
            }

            await chapter.update({
                volume,
                number,
                content,
                title
            });

            res.json(chapter);
        } catch (error) {
            next(error);
        }
    }

    async deleteChapter(req, res, next) {
        try {
            if (req.user.role !== 'admin') {
                throw ApiError.Forbidden();
            }

            const { id } = req.params;

            const chapter = await db.Chapter.findByPk(id);
            if (!chapter) {
                throw ApiError.NotFound('Глава не найдена');
            }

            await chapter.destroy();

            res.json({ message: 'Глава успешно удалена' });
        } catch (error) {
            next(error);
        }
    }
}

export default new ChapterController();