import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
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
        },
        role: {
            type: DataTypes.ENUM('reader', 'admin'),
            defaultValue: 'reader'
        },
        image: {
            type: DataTypes.BLOB,
            allowNull: false
        }
    }, {
        timestamps: false
    });

    User.associate = (db) => {
        User.belongsToMany(db.Book, { through: db.UserFav, foreignKey: 'userId', as: 'FavoriteBooks' });
        User.hasMany(db.Rating, { foreignKey: 'userId' });
        User.hasMany(db.Comment, { foreignKey: 'userId' });
    };

    return User;
};