import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    genre: {
        type: String
    },
    publicationYear: {
        type: Number
    },
    pages: {
        type: Number
    },
    coverImage: {
        type: String
    },
    edition: {
        type: String
    },
    isbn: {
        type: String
    },
    notes: {
        type: String
    },
    shelf: {
        type: String,
        enum: ['Wishlist', 'Owned'],
        default: 'Wishlist'
    },
    readStatus: {
        type: String,
        enum: ['Not Read', 'Reading', 'Read', 'DNF'],
        default: 'Not Read'
    },
    dnfReason: {
        type: String
    },
    startDate: {
        type: Date
    },
    endDate: {
        type: String
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

export default  mongoose.model('Book', bookSchema);