import mongoose from 'mongoose';

const connectDb = async () => {
    const conn = process.env.MONGODB_URI;

    try {
        await mongoose.connect(conn);
        console.log('MongoDB connected');
    } catch (err) {
        console.error('MongoDB connection error: ', err.message || err);
        throw err;
    }
};

export default connectDb;