const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: process.env.SQLITE_STORAGE || './database.sqlite',
    logging: false,
});

const connectSQLite = async () => {
    try {
        await sequelize.authenticate();
        console.log('SQLite connection has been established successfully.');
        
        // Sync models here so index.js stays focused on the server
        await sequelize.sync({ alter: true });
        console.log('Database models synced successfully.');
    } catch (error) {
        console.error('Unable to connect to the SQLite database:', error.message);
        process.exit(1); // Exit process on database failure
    }
};

module.exports = { sequelize, connectSQLite };
