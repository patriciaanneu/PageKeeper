import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoute.js';
import bookRoutes from './routes/booksRoute.js';

const app = express();
const PORT = process.env.PORT || 3000;

//middlewares
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
//parse cookies
app.use(cookieParser());

//routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);

app.get('/', (req, res) => {
    res.json({message: 'Book Catalogue API'});
});

if (process.env.NODE_ENV !== 'test') {
  connectDB()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    })
    .catch((err) => {
      console.error('Failed to start server:', err);
      process.exit(1);
    });
}

export default app;