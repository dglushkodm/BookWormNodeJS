class ApiError extends Error {
    constructor(status, message, errors = []) {
        super(message);
        this.status = status;
        this.errors = errors;
    }

    static UnauthorizedError() {
        return new ApiError(401, 'Пользователь не авторизован');
    }

    static BadRequest(message, errors = []) {
        return new ApiError(400, message, errors);
    }

    static NotFound(message = 'Не найдено') {
        return new ApiError(404, message);
    }

    static Forbidden(message = 'Доступ запрещен') {
        return new ApiError(403, message);
    }

    static Internal(message = 'Внутренняя ошибка сервера') {
        return new ApiError(500, message);
    }
}

export default ApiError;