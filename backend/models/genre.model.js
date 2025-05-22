import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const Genre = sequelize.define('Genre', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        createdAt: {
            allowNull: false,
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        updatedAt: {
            allowNull: false,
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        timestamps: false,
        tableName: 'Genres' // Явное указание имени таблицы
    });

    Genre.associate = (db) => {
        Genre.belongsToMany(db.Book, { through: db.GenreBook, foreignKey: 'genreId' });
    };

    return Genre;
};