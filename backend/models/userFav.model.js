import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const UserFav = sequelize.define('UserFav', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        bookId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        addedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        timestamps: false,
        tableName: 'UserFavorites' // Явное указание имени таблицы
    });

    UserFav.associate = (db) => {
        // Ассоциации уже определены в User и Book
    };

    return UserFav;
};