import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3050;

app.use(cors());
app.use(express.json());

// MongoDB connection string
const mongoURI = 'mongodb://localhost:27017/axe';

mongoose
    .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log(err));

// Define routes
app.get('/', (req, res) => {
    res.send('Hello from Express!');
});

import sheetRoutes from './routes/sheets.js';
app.use('/api', sheetRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
