import db from '../models/index.js';
import ApiError from '../exceptions/api.error.js';

class AuthorController {
    async getAllAuthors(req, res, next) {
        try {
            const authors = await db.Author.findAll({
                attributes: ['id', 'firstName', 'lastName', 'birthDate', 'photo'],
                order: [['lastName', 'ASC'], ['firstName', 'ASC']]
            });
            res.json(authors);
        } catch (error) {
            next(error);
        }
    }

    async getAuthorById(req, res, next) {
        try {
            const { id } = req.params;
            const author = await db.Author.findByPk(id, {
                include: [{
                    model: db.Book,
                    attributes: ['id', 'title', 'coverImage']
                }]
            });

            if (!author) {
                throw ApiError.NotFound('Автор не найден');
            }

            res.json(author);
        } catch (error) {
            next(error);
        }
    }

    async createAuthor(req, res, next) {
        try {
            if (req.user.role !== 'admin') {
                throw ApiError.Forbidden();
            }

            const { firstName, lastName, biography, birthDate, photo } = req.body;

            if (!firstName || !lastName) {
                throw ApiError.BadRequest('Имя и фамилия обязательны');
            }

            const author = await db.Author.create({
                firstName,
                lastName,
                biography,
                birthDate,
                photo
            });

            res.status(201).json(author);
        } catch (error) {
            next(error);
        }
    }

    async updateAuthor(req, res, next) {
        try {
            if (req.user.role !== 'admin') {
                throw ApiError.Forbidden();
            }

            const { id } = req.params;
            const { firstName, lastName, biography, birthDate, photo } = req.body;

            const author = await db.Author.findByPk(id);
            if (!author) {
                throw ApiError.NotFound('Автор не найден');
            }

            await author.update({
                firstName,
                lastName,
                biography,
                birthDate,
                photo
            });

            res.json(author);
        } catch (error) {
            next(error);
        }
    }

    async deleteAuthor(req, res, next) {
        try {
            if (req.user.role !== 'admin') {
                throw ApiError.Forbidden();
            }

            const { id } = req.params;

            const author = await db.Author.findByPk(id);
            if (!author) {
                throw ApiError.NotFound('Автор не найден');
            }

            await author.destroy();

            res.json({ message: 'Автор успешно удален' });
        } catch (error) {
            next(error);
        }
    }
}

export default new AuthorController();