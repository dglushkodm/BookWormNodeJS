import ApiError from '../exceptions/api.error.js';

const roleMiddleware = (roles) => {
    return (req, res, next) => {
        try {
            if (!roles.includes(req.user.role)) {
                throw ApiError.Forbidden();
            }
            next();
        } catch (error) {
            next(error);
        }
    };
};

export default roleMiddleware;