'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      // 1. Создаем таблицы без внешних ключей сначала
      await queryInterface.createTable('Authors', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        firstName: {
          type: Sequelize.STRING,
          allowNull: false
        },
        lastName: {
          type: Sequelize.STRING,
          allowNull: false
        },
        biography: {
          type: Sequelize.TEXT
        },
        birthDate: {
          type: Sequelize.DATEONLY
        },
        photo: {
          type: Sequelize.STRING
        }
      }, { transaction });

      await queryInterface.createTable('Genres', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.NOW
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.NOW
        }
      }, { transaction });

      await queryInterface.createTable('Users', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        email: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true
        },
        password: {
          type: Sequelize.STRING,
          allowNull: false
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.NOW
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.NOW
        },
        role: {
          type: Sequelize.ENUM('reader', 'admin'),
          defaultValue: 'reader'
        },
        image: {
          type: Sequelize.BLOB,
          allowNull: false
        }
      }, { transaction });

      // 2. Затем таблицы, которые зависят от созданных выше
      await queryInterface.createTable('Books', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        title: {
          type: Sequelize.STRING,
          allowNull: false
        },
        description: {
          type: Sequelize.TEXT
        },
        publicationDate: {
          type: Sequelize.DATEONLY
        },
        coverImage: {
          type: Sequelize.STRING
        },
        authorId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'Authors',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        rate: {
          type: Sequelize.INTEGER
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.NOW
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.NOW
        }
      }, { transaction });

      // 3. Создаем таблицы связей и зависимые таблицы
      await queryInterface.createTable('Chapters', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        title: {
          type: Sequelize.STRING,
          allowNull: false
        },
        number: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        volume: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        content: {
          type: Sequelize.TEXT,
          allowNull: false
        },
        uploadDate: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.NOW
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.NOW
        },
        bookId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'Books',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        }
      }, { transaction });

      await queryInterface.createTable('Ratings', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        value: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        userId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'Users',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        bookId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'Books',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        comment: {
          type: Sequelize.TEXT
        }
      }, { transaction });

      await queryInterface.createTable('GenreBooks', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        bookId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'Books',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        genreId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'Genres',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        }
      }, { transaction });

      await queryInterface.createTable('UserFavorites', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        userId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'Users',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        bookId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'Books',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        addedAt: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.NOW
        }
      }, { transaction });

      // 4. Создаем индексы для улучшения производительности
      await queryInterface.addIndex('Books', ['authorId'], { transaction });
      await queryInterface.addIndex('Chapters', ['bookId'], { transaction });
      await queryInterface.addIndex('Ratings', ['userId', 'bookId'], { transaction });
      await queryInterface.addIndex('GenreBooks', ['bookId', 'genreId'], {
        unique: true,
        transaction
      });
      await queryInterface.addIndex('UserFavorites', ['userId', 'bookId'], {
        unique: true,
        transaction
      });
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      // Удаляем в обратном порядке создания
      await queryInterface.dropTable('UserFavorites', { transaction });
      await queryInterface.dropTable('GenreBooks', { transaction });
      await queryInterface.dropTable('Ratings', { transaction });
      await queryInterface.dropTable('Chapters', { transaction });
      await queryInterface.dropTable('Books', { transaction });
      await queryInterface.dropTable('Users', { transaction });
      await queryInterface.dropTable('Genres', { transaction });
      await queryInterface.dropTable('Authors', { transaction });
    });
  }
};