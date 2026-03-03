const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorMiddleware');

// Route imports
const authRoutes = require('./routes/authRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// --------------- Middleware ---------------
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --------------- Routes ---------------
app.get('/', (req, res) => {
    res.json({ message: 'Expense Tracker API is running 🚀' });
});

app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);

// --------------- Error Handler ---------------
app.use(errorHandler);

// --------------- Start Server ---------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});
