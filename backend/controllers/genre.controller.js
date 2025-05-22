import db from '../models/index.js';
import ApiError from '../exceptions/api.error.js';

class GenreController {
    async getAllGenres(req, res, next) {
        try {
            const genres = await db.Genre.findAll({
                order: [['name', 'ASC']],
                include: [{
                    model: db.Book,
                    attributes: [],
                    through: { attributes: [] }
                }],
                group: ['Genre.id'],
                attributes: [
                    'id',
                    'name',
                    [db.sequelize.fn('COUNT', db.sequelize.col('Books.id')), 'booksCount']
                ]
            });
            res.json(genres);
        } catch (error) {
            next(error);
        }

    }

    async getGenreById(req, res, next) {
        try {
            const { id } = req.params;
            const genre = await db.Genre.findByPk(id, {
                include: [{
                    model: db.Book,
                    attributes: ['id', 'title', 'coverImage'],
                    through: { attributes: [] }
                }]
            });

            if (!genre) {
                throw ApiError.NotFound('Жанр не найден');
            }

            res.json(genre);
        } catch (error) {
            next(error);
        }
    }

    async createGenre(req, res, next) {
        try {
            if (req.user.role !== 'admin') {
                throw ApiError.Forbidden();
            }

            const { name } = req.body;

            if (!name) {
                throw ApiError.BadRequest('Название жанра обязательно');
            }

            const genre = await db.Genre.create({ name });
            res.status(201).json(genre);
        } catch (error) {
            next(error);
        }
    }

    async updateGenre(req, res, next) {
        try {
            if (req.user.role !== 'admin') {
                throw ApiError.Forbidden();
            }

            const { id } = req.params;
            const { name } = req.body;

            const genre = await db.Genre.findByPk(id);
            if (!genre) {
                throw ApiError.NotFound('Жанр не найден');
            }

            await genre.update({ name });
            res.json(genre);
        } catch (error) {
            next(error);
        }
    }

    async deleteGenre(req, res, next) {
        try {
            if (req.user.role !== 'admin') {
                throw ApiError.Forbidden();
            }

            const { id } = req.params;

            const genre = await db.Genre.findByPk(id);
            if (!genre) {
                throw ApiError.NotFound('Жанр не найден');
            }

            // Проверка на наличие связанных книг
            const booksCount = await genre.countBooks();
            if (booksCount > 0) {
                throw ApiError.BadRequest('Нельзя удалить жанр с книгами');
            }

            await genre.destroy();
            res.json({ message: 'Жанр успешно удален' });
        } catch (error) {
            next(error);
        }
    }

    async getBooksByGenre(req, res, next) {
        try {
            const { id } = req.params;
            const genre = await db.Genre.findByPk(id, {
                include: [{
                    model: db.Book,
                    attributes: ['id', 'title', 'coverImage'],
                    through: { attributes: [] },
                    include: [{
                        model: db.Author,
                        attributes: ['firstName', 'lastName']
                    }]
                }]
            });

            if (!genre) {
                throw ApiError.NotFound('Жанр не найден');
            }

            res.json(genre.Books);
        } catch (error) {
            next(error);
        }
    }
}

export default new GenreController();