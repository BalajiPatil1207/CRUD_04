require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectSQLite, sequelize } = require('./src/config/sqliteDB');

const authRouter = require('./src/routers/authRouter');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('Hello World! Express server is running.');
});

// Authentication Routes
app.use('/api/auth', authRouter);

// Start Server and Sync Database
const startServer = async () => {
    try {
        await connectSQLite();
        // sync({ alter: true }) ensures the table is created/updated without dropping data
        await sequelize.sync({ alter: true });
        console.log('Database synced successfully.');
        
        app.listen(port, () => {
            console.log(`Server listening at http://localhost:${port}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error.message);
    }
};

startServer();
