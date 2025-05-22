import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const Book = sequelize.define('Book', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT
        },
        publicationDate: {
            type: DataTypes.DATEONLY
        },
        coverImage: {
            type: DataTypes.STRING
        },
        authorId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        rate: {
            type: DataTypes.INTEGER
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
        timestamps: false
    });

    Book.associate = (db) => {
        Book.belongsTo(db.Author, { foreignKey: 'authorId' });
        Book.belongsToMany(db.Genre, { through: db.GenreBook, foreignKey: 'bookId' });
        Book.hasMany(db.Chapter, { foreignKey: 'bookId' });
        Book.belongsToMany(db.User, { through: db.UserFav, foreignKey: 'bookId', as: 'FavoritedBy' });
        Book.hasMany(db.Rating, { foreignKey: 'bookId' });
        Book.hasMany(db.Comment, { foreignKey: 'bookId' });
    };

    return Book;
};