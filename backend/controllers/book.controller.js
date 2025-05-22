import {Op, Sequelize} from 'sequelize';
import db from '../models/index.js';
import ApiError from '../exceptions/api.error.js';

class BookController {
    async getAllBooks(req, res, next) {
        try {
            let { search, genre, author, yearFrom, yearTo, rateFrom, sort } = req.query;

            const where = {};
            const include = [
                {
                    model: db.Author,
                    attributes: ['id', 'firstName', 'lastName']
                },
                {
                    model: db.Genre,
                    attributes: ['id', 'name'],
                    through: { attributes: [] }
                },
                {
                    model: db.Chapter,
                    attributes: []
                }
            ];

            // Поиск по названию
            if (search) {
                where.title = { [Op.like]: `%${search.toLowerCase()}%` };
            }

            if (yearFrom || yearTo) {
                const dateConditions = [];

                if (yearFrom) {
                    dateConditions.push(Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('publicationDate')), Op.gte, yearFrom));
                }
                if (yearTo) {
                    dateConditions.push(Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('publicationDate')), Op.lte, yearTo));
                }

                where[Op.and] = [
                    ...(where[Op.and] || []),
                    ...dateConditions
                ];
            }

            if (rateFrom) {
                where.rate = { [Op.gte]: rateFrom };
            }

            if (genre) {
                include.push({
                    model: db.Genre,
                    where: { id: genre },
                    through: { attributes: [] },
                    attributes: []
                });
            }

            if (author) {
                include[0].where = { id: author };
            }

            let order = [];
            if (sort === 'year_asc') order = [['publicationDate', 'ASC']];
            if (sort === 'year_desc') order = [['publicationDate', 'DESC']];
            if (sort === 'rate_asc') order = [['rate', 'ASC']];
            if (sort === 'rate_desc') order = [['rate', 'DESC']];
            if (sort === 'name_asc') order = [['title', 'ASC']];
            if (sort === 'name_desc') order = [['title', 'DESC']];

            const books = await db.Book.findAll({
                where,
                include,
                attributes: {
                    include: [
                        [Sequelize.fn('COUNT', Sequelize.col('Chapters.id')), 'chaptersCount']
                    ]
                },
                group: [
                    'Book.id',
                    'Author.id',
                    'Genres.id',
                    'Genres->GenreBook.bookId',
                    'Genres->GenreBook.genreId'
                ],
                order,
                distinct: true
            });

            res.json(books);
        } catch (error) {
            next(error);
        }
    }

    async getBookById(req, res, next) {
        try {
            const { id } = req.params;
            const book = await db.Book.findByPk(id, {
                include: [
                    {
                        model: db.Author,
                        attributes: ['id', 'firstName', 'lastName']
                    },
                    {
                        model: db.Genre,
                        attributes: ['id', 'name'],
                        through: { attributes: [] }
                    },
                    {
                        model: db.Chapter,
                        attributes: ['id', 'title', 'number', 'volume']
                    },
                    {
                        model: db.Comment,
                        include: [{
                            model: db.User,
                            attributes: ['id', 'name', 'image']
                        }],
                        order: [['createdAt', 'DESC']]
                    }
                ]
            });

            if (!book) {
                throw ApiError.NotFound('Книга не найдена');
            }

            res.json(book);
        } catch (error) {
            next(error);
        }
    }

    async createBook(req, res, next) {
        try {
            if (req.user.role !== 'admin') {
                throw ApiError.Forbidden();
            }

            const { title, authorId, description, publicationDate, coverImage, genreIds } = req.body;

            if (!title || !authorId) {
                throw ApiError.BadRequest('Название и автор обязательны');
            }

            const book = await db.Book.create({
                title,
                authorId,
                description,
                publicationDate,
                coverImage
            });

            if (genreIds && genreIds.length > 0) {
                await book.addGenres(genreIds);
            }

            const createdBook = await db.Book.findByPk(book.id, {
                include: [
                    { model: db.Author },
                    { model: db.Genre }
                ]
            });

            res.status(201).json(createdBook);
        } catch (error) {
            next(error);
        }
    }

    async updateBook(req, res, next) {
        try {
            if (req.user.role !== 'admin') {
                throw ApiError.Forbidden();
            }

            const { id } = req.params;
            const { title, authorId, description, publicationDate, coverImage, genreIds } = req.body;

            const book = await db.Book.findByPk(id);
            if (!book) {
                throw ApiError.NotFound('Книга не найдена');
            }

            await book.update({
                title,
                authorId,
                description,
                publicationDate,
                coverImage
            });

            if (genreIds) {
                await book.setGenres(genreIds);
            }

            const updatedBook = await db.Book.findByPk(id, {
                include: [
                    { model: db.Author },
                    { model: db.Genre }
                ]
            });

            res.json(updatedBook);
        } catch (error) {
            next(error);
        }
    }

    async deleteBook(req, res, next) {
        try {
            if (req.user.role !== 'admin') {
                throw ApiError.Forbidden();
            }

            const { id } = req.params;

            const book = await db.Book.findByPk(id);
            if (!book) {
                throw ApiError.NotFound('Книга не найдена');
            }

            await book.destroy();
            res.json({ message: 'Книга успешно удалена' });
        } catch (error) {
            next(error);
        }
    }
    async getChapterById(req, res, next) {
        try {
            const { bookId, chapterId } = req.params;

            const chapter = await db.Chapter.findOne({
                where: {
                    id: chapterId,
                    bookId: bookId
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
    async rateBook(req, res, next) {
        try {
            if (req.user.role !== 'reader' && req.user.role !== 'admin') {
                throw ApiError.Forbidden();
            }

            const { id } = req.params;
            const { rating } = req.body;

            if (rating < 1 || rating > 5) {
                throw ApiError.BadRequest('Рейтинг должен быть от 1 до 5');
            }

            const book = await db.Book.findByPk(id);
            if (!book) {
                throw ApiError.NotFound('Книга не найдена');
            }

            // Check if user already rated this book
            const existingRating = await db.Rating.findOne({
                where: {
                    bookId: id,
                    userId: req.user.id
                }
            });

            let bookRate;

            if (existingRating) {
                // Update existing rating
                existingRating.value = rating;
                bookRate = await existingRating.save();
            } else {
                // Create new rating
                bookRate = await db.Rating.create({
                    value: rating,
                    userId: req.user.id,
                    bookId: id
                });
            }

            // Calculate new average rating for the book
            const ratings = await db.Rating.findAll({
                where: { bookId: id },
                attributes: [[db.Sequelize.fn('AVG', db.Sequelize.col('value')), 'avgRating']]
            });

            const avgRating = ratings[0].dataValues.avgRating;

            // Update book's average rating
            book.rate = (avgRating * 10) / 10; // Round to 1 decimal place

            await book.save();

            res.json({ message: 'Спасибо за оценку!', book });
        } catch (error) {
            next(error);
        }
    }
}

export default new BookController();