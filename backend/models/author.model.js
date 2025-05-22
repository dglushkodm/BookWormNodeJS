import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const Author = sequelize.define('Author', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        biography: {
            type: DataTypes.TEXT
        },
        birthDate: {
            type: DataTypes.DATEONLY
        },
        photo: {
            type: DataTypes.STRING
        }
    }, {
        timestamps: false
    });

    Author.associate = (db) => {
        Author.hasMany(db.Book, { foreignKey: 'authorId' });
    };

    return Author;
};