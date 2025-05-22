import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const GenreBook = sequelize.define('GenreBook', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        bookId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        genreId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        timestamps: false,
        tableName: 'GenreBooks' // Явное указание имени таблицы
    });

    GenreBook.associate = (db) => {

    };

    return GenreBook;
};