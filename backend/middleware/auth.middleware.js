import jwt from 'jsonwebtoken';
import ApiError from '../exceptions/api.error.js';
import db from '../models/index.js';

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

        if (!token) {
            throw ApiError.UnauthorizedError();
        }

        const decoded = jwt.verify(token, '12345');

        const user = await db.User.findByPk(decoded.id);
        if (!user) {
            throw ApiError.UnauthorizedError();
        }

        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
};

export default authMiddleware;