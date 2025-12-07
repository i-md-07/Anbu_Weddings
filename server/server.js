const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => {
        console.error('MongoDB Connection Error:', err);
        console.log('Please check your MONGO_URI in .env file, especially the <db_password> part.');
    });

// Routes
const authRoute = require('./routes/auth');
app.use('/api/auth', authRoute);

app.get('/', (req, res) => {
    res.send('Matrimony API is running');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
