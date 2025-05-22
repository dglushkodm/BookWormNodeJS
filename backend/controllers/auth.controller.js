import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import db from '../models/index.js';
import ApiError from '../exceptions/api.error.js';
import * as path from "node:path";
import * as fs from "node:fs";

const generateToken = (id, role) => {
    return jwt.sign(
        { id, role },
        '12345',
        { expiresIn: '90d' }
    );
};

class AuthController {
    async register(req, res, next) {
        try {

            const { username, email, password } = req.body;

            const existingUser = await db.User.findOne({ where: { email } });
            if (existingUser) {
                throw ApiError.BadRequest('Пользователь с таким email уже существует');
            }
            const hashedPassword = await bcrypt.hash(password, 10);

            const defaultImagePath = path.join('E:/NodeJSCurs3/BookWorm2/backend/materials/images/defaultUser2.jpg'); // Укажите правильный путь
            const defaultImage = fs.readFileSync(defaultImagePath);

            const user = await db.User.create({
                name: username,
                email: email,
                password: hashedPassword,
                role: 'reader',
                image: defaultImage,
                createdAt: Date.now(),
                updatedAt: Date.now()
            });

            const token = generateToken(user.id, user.role);

            res.status(201).json({
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                image: user.image.toString('base64'),
                token
            });
        } catch (error) {
            next(error);
        }
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body;

            const user = await db.User.findOne({ where: { email } });
            if (!user) {
                throw ApiError.BadRequest('Неверный email или пароль');
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                throw ApiError.BadRequest('Неверный email или пароль');
            }

            const token = generateToken(user.id, user.role);

            res.json({
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                image: user.image,
                token
            });
        } catch (error) {
            next(error);
        }
    }

    async getMe(req, res, next) {
        try {
            const user = await db.User.findByPk(req.user.id, {
                attributes: { exclude: ['password'] }
            });

            if (!user) {
                throw ApiError.UnauthorizedError();
            }
            user.image = Array.from(user.image);
            res.json(user);
        } catch (error) {
            next(error);
        }
    }
}

export default new AuthController();