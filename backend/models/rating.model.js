import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const Rating = sequelize.define('Rating', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        value: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
                max: 5
            }
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        bookId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        comment: {
            type: DataTypes.TEXT
        }
    }, {
        timestamps: false
    });

    Rating.associate = (db) => {
        Rating.belongsTo(db.User, { foreignKey: 'userId' });
        Rating.belongsTo(db.Book, { foreignKey: 'bookId' });
    };

    return Rating;
};