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

            // Download default image from Dropbox
            const defaultImageUrl = 'https://www.dropbox.com/scl/fi/8nsi03tet9f0j13kse4yd/defaultUser.png?rlkey=6bh6bsogmextjby72wswkszco&st=z5vx9jfa&raw=1';
            const response = await fetch(defaultImageUrl);
            const imageBuffer = await response.arrayBuffer();

            await db.User.create({
                name: username,
                email: email,
                password: hashedPassword,
                role: 'reader',
                image: Buffer.from(imageBuffer),
                createdAt: Date.now(),
                updatedAt: Date.now()
            });

            res.status(201).json({
                message: 'Регистрация успешно завершена'
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