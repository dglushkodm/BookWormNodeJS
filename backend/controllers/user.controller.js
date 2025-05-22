import db from '../models/index.js';
import ApiError from '../exceptions/api.error.js';

class UserController {
    async getAllUsers(req, res, next) {
        try {
            // Только администратор может получать список пользователей
            if (req.user.role !== 'admin') {
                throw ApiError.Forbidden();
            }

            const users = await db.User.findAll({
                attributes: ['id', 'email', 'name', 'image', 'role', 'createdAt'],
                order: [['createdAt', 'DESC']]
            });

            res.json(users);
        } catch (error) {
            next(error);
        }
    }

    async updateUserRole(req, res, next) {
        try {
            // Только администратор может менять роли
            if (req.user.role !== 'admin') {
                throw ApiError.Forbidden();
            }

            const { userId } = req.params;
            const { role } = req.body;

            // Проверка допустимых ролей (только reader и admin)
            if (!['reader', 'admin'].includes(role)) {
                throw ApiError.BadRequest('Недопустимая роль пользователя');
            }

            // Нельзя изменить свою собственную роль
            if (req.user.id === userId) {
                throw ApiError.BadRequest('Вы не можете изменить свою собственную роль');
            }

            const user = await db.User.findByPk(userId);
            if (!user) {
                throw ApiError.NotFound('Пользователь не найден');
            }

            await user.update({ role });

            res.json({
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteUser(req, res, next) {
        try {
            // Только администратор может удалять пользователей
            if (req.user.role !== 'admin') {
                throw ApiError.Forbidden();
            }

            const { userId } = req.params;

            // Нельзя удалить самого себя
            if (req.user.id === userId) {
                throw ApiError.BadRequest('Вы не можете удалить свой собственный аккаунт');
            }

            const user = await db.User.findByPk(userId);
            if (!user) {
                throw ApiError.NotFound('Пользователь не найден');
            }

            await user.destroy();

            res.json({ message: 'Пользователь успешно удален' });
        } catch (error) {
            next(error);
        }
    }

    async updateProfile(req, res, next) {
        try {
            const { name, email, image } = req.body;
            const userId = req.user.id;

            const user = await db.User.findByPk(userId);
            if (!user) {
                throw ApiError.NotFound('Пользователь не найден');
            }

            // Проверка email на уникальность, если он изменился
            if (email && email !== user.email) {
                const existingUser = await db.User.findOne({ where: { email } });
                if (existingUser) {
                    throw ApiError.BadRequest('Пользователь с таким email уже существует');
                }
            }

            // Обновляем данные пользователя
            await user.update({
                name: name || user.name,
                email: email || user.email,
                image: image || user.image
            });

            // Получаем обновленные данные пользователя
            const updatedUser = await db.User.findByPk(userId, {
                attributes: { exclude: ['password'] }
            });

            res.json(updatedUser);
        } catch (error) {
            next(error);
        }
    }

    async getFavorites(req, res, next) {
        try {
            const userId = req.user.id;

            // Способ 1: Через пользователя (рекомендуемый)
            const user = await db.User.findByPk(userId, {
                include: [{
                    model: db.Book,
                    as: 'FavoriteBooks',
                    include: [
                        {
                            model: db.Author,
                            attributes: ['id', 'firstName', 'lastName']
                        },
                        {
                            model: db.Genre,
                            attributes: ['id', 'name'],
                            through: { attributes: [] }
                        }
                    ],
                    through: { attributes: ['addedAt'] }
                }],
                order: [[{ model: db.Book, as: 'FavoriteBooks' }, 'createdAt', 'DESC']]
            });

            if (!user) {
                throw ApiError.NotFound('Пользователь не найден');
            }

            res.json(user.FavoriteBooks || []);

            /*
            // Способ 2: Через таблицу UserFav (альтернативный)
            const favorites = await db.UserFav.findAll({
                where: { userId },
                include: [{
                    model: db.Book,
                    include: [
                        {
                            model: db.Author,
                            attributes: ['id', 'firstName', 'lastName']
                        },
                        {
                            model: db.Genre,
                            attributes: ['id', 'name'],
                            through: { attributes: [] }
                        }
                    ]
                }],
                order: [[ 'createdAt', 'DESC' ]]
            });

            const favoriteBooks = favorites.map(fav => fav.Book);
            res.json(favoriteBooks);
            */
        } catch (error) {
            next(error);
        }
    }

    async addFavorite(req, res, next) {
        try {
            const { bookId } = req.body;

            const book = await db.Book.findByPk(bookId);
            if (!book) {
                throw ApiError.NotFound('Книга не найдена');
            }

            // Проверяем, нет ли уже этой книги в избранном
            const existingFavorite = await db.UserFav.findOne({
                where: {
                    userId: req.user.id,
                    bookId
                }
            });

            if (existingFavorite) {
                throw ApiError.BadRequest('Книга уже в избранном');
            }

            const fav = await db.UserFav.create({
                userId: req.user.id,
                bookId
            });
            const user = await db.User.findByPk(req.user.id, {
                include: [{
                    model: db.Book,
                    as: 'FavoriteBooks',
                    where: { id: bookId },
                    required: false,
                    include: [
                        {
                            model: db.Author,
                            attributes: ['id', 'firstName', 'lastName']
                        },
                        {
                            model: db.Genre,
                            attributes: ['id', 'name'],
                            through: { attributes: [] }
                        }
                    ]
                }],
                order: [[{ model: db.Book, as: 'FavoriteBooks' }, 'createdAt', 'DESC']]
            });

            res.status(201).json(user.FavoriteBooks.find(book => book.id === bookId));
        } catch (error) {
            next(error);
        }
    }

    async removeFavorite(req, res, next) {
        try {
            const { bookId } = req.params;

            const favorite = await db.UserFav.findOne({
                where: {
                    userId: req.user.id,
                    bookId
                }
            });

            if (!favorite) {
                throw ApiError.NotFound('Книга не найдена в избранном');
            }

            await favorite.destroy();

            res.json({ message: 'Книга удалена из избранного' });
        } catch (error) {
            next(error);
        }
    }
}

export default new UserController();