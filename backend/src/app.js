import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoute.js';
import bookRoutes from './routes/booksRoute.js';
import uploadsRoutes from './routes/uploadsRoute.js';

const app = express();
const PORT = process.env.PORT || 3000;

//middlewares
app.use(morgan('dev'));
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true
}));
app.use(express.json());
// parse cookies
app.use(cookieParser());

// serve uploaded files from backend/uploads at /uploads
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

//routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/uploads', uploadsRoutes);

app.get('/', (req, res) => {
    res.json({message: 'Book Catalogue API'});
});

if (process.env.NODE_ENV !== 'test') {
  connectDB()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Server running on PORT: ${PORT}`);
      });
    })
    .catch((err) => {
      console.error('Failed to start server:', err);
      process.exit(1);
    });
}

export default app;