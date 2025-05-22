import { Sequelize } from 'sequelize';
import config from '../config/config.json' assert { type: "json" };

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(
    dbConfig.database,
    dbConfig.username,
    dbConfig.password,
    {
      host: dbConfig.host,
      dialect: dbConfig.dialect,
      logging: false,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false // В продакшене лучше установить в true
        }
      }
    }
);

const db = {
    sequelize,
    Sequelize,
    Author: (await import('./author.model.js')).default(sequelize),
    Book: (await import('./book.model.js')).default(sequelize),
    Chapter: (await import('./chapter.model.js')).default(sequelize),
    Genre: (await import('./genre.model.js')).default(sequelize),
    GenreBook: (await import('./genreBook.model.js')).default(sequelize),
    Rating: (await import('./rating.model.js')).default(sequelize),
    User: (await import('./user.model.js')).default(sequelize),
    UserFav: (await import('./userFav.model.js')).default(sequelize),
    Comment: (await import('./comment.model.js')).default(sequelize),
};

Object.values(db).forEach(model => {
  if (model.associate) {
    model.associate(db);
  }
});

export default db;