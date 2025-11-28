import Book from '../models/Book.js';
import fs from 'fs';
import path from 'path';

//allowed values for shelf and read status
const validShelf = ['Wishlist', 'Owned'];
const validStatus = ['Not Read', 'Reading', 'Read', 'DNF'];

function parseDate(value) {
    if (!value) return undefined;
    const d = new Date(value);

    if (Number.isNaN(d.getTime())) return null;
    return d;
}

//create a new book
export const createBook = async (req, res) => {
    try {
        const {
            title,
            author,
            description,
            isbn,
            genre,
            publicationYear,
            pages,
            coverImage,
            edition,
            notes,
            shelf,
            readStatus,
            dnfReason,
            startDate,
            endDate
        } = req.body;

        if (!title || !author) return res.status(400).json({error: 'Title and author required.'});

        if (shelf && !validShelf.includes(shelf)) return res.status(400).json({error: 'Invalid shelf'});
        if (readStatus && !validStatus.includes(readStatus)) return res.status(400).json({error: 'Invalid readStatus'});

        if (readStatus !== 'DNF' && dnfReason) {
            //ignore dnfReason unless status is DNF
        }

        const sDate = parseDate(startDate);
        const eDate = parseDate(endDate);
        if (startDate && sDate === null) return res.status(400).json({error: 'Invalid startDate'});
        if (endDate && eDate === null) return res.status(400).json({error: 'Invalid endDate'});

        const book = new Book({
            title,
            author,
            description,
            isbn,
            genre,
            publicationYear,
            pages,
            coverImage,
            edition,
            notes,
            shelf,
            readStatus,
            dnfReason: readStatus === 'DNF' ? dnfReason : undefined,
            startDate: sDate,
            endDate: eDate,
            createdBy: req.user.id
        });

        await book.save();
        res.status(201).json({book});
        
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Server error'});
    }
};

//return a list of books
export const getBooks = async (req, res) => {
    try {
        const books = await Book.find().populate('createdBy', 'firstName lastName email');
        res.json({books});
    } catch (error) {
        res.status(500).json({error: 'Server error'});
    }
};

//get a single book by id
export const getBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id).populate('createdBy', 'firstName lastName email');
            if (!book) return res.status(404).json({error: 'Book not found'});
            res.json({book});
    } catch (error) {
        res.status(500).json({error: 'Server error'});
    }
};

//update multiple book fields, ownership is required
export const updateBook = async (req, res) => {
    try {
        const book = req.resource || (await Book.findById(req.params.id));
        if (!book) return res.status(404).json({error: 'Book not found'});
        if (!req.resource) {
            const owner = book.createdBy;
            const isOwner =owner && (typeof owner.equals === 'function' ? owner.equals(req.user.id) : owner.toString() === req.user.id);
            if (!isOwner) return res.status(403).json({error: 'Not authorized'});
        }

        const updateTable = [
            'title',
            'author',
            'description',
            'isbn',
            'genre',
            'publicationYear',
            'pages',
            'coverImage',
            'edition',
            'notes',
            'shelf',
            'readStatus',
            'dnfReason',
            'startDate',
            'endDate'
        ];

        updateTable.forEach((field) => {
            if (req.body[field] !== undefined) {
                if ((field === 'shelf' && !validShelf.includes(req.body[field])) || (field === 'readStatus' && !validStatus.includes(req.body[field]))) {

                } else if (field === 'startDate' || field === 'endDate') {
                    const d = parseDate(req.body[field]);
                    if (d === null) return res.status(400).json({error: `Invalid ${field}`});
                    book[field] = d;
                } else {
                    book[field] = req.body[field];
                }
            }
        });

        if (req.body.shelf && !validShelf.includes(req.body.shelf)) return res.status(400).json({error: 'Invalid shelf'});
        if(req.body.readStatus && !validStatus.includes(req.body.readStatus)) return res.status(400).json({error: 'Invalid readStatus'});
        if (req.body.readStatus && req.body.readStatus !== 'DNF') book.dnfReason = undefined;

        await book.save();
        res.json({book});
    } catch (err) {
        res.status(500).json({error: 'Server error'});
        
    }
};

//change only the 'shelf' value for a book, ownership is required
export const updateShelf = async (req, res) => {
    try {
        const {shelf} = req.body;
        if (!shelf || !validShelf.includes(shelf)) return res.status(400).json({error: 'Invalid shelf'});
        const book = req.resource || (await Book.findById(req.params.id));
        if (!book) return res.status(404).json({error: 'Book not found'});
        if (!req.resource) {
            const owner = book.createdBy;
            const isOwner = owner && (typeof owner.equals === 'function' ? owner.equals(req.user.id) : owner.toString() === req.user.id);
            if (!isOwner) return res.status(403).json({error: 'Not authorized'});
        }
                book.shelf = shelf;
                await book.save();
                res.json({book});
    } catch (err) {
        res.status(500).json({error: 'Server error'});
    }
};

// upload a cover image for a book (ownership required)
export const uploadCover = async (req, res) => {
    try {
        const { id } = req.params;
        const book = req.resource || (await Book.findById(id));
        if (!book) return res.status(404).json({ error: 'Book not found' });
        if (!req.resource) {
            const owner = book.createdBy;
            const isOwner = owner && (typeof owner.equals === 'function' ? owner.equals(req.user.id) : owner.toString() === req.user.id);
            if (!isOwner) return res.status(403).json({ error: 'Not authorized' });
        }

        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

        const uploadsDir = path.join(process.cwd(), 'uploads');

        // remove old cover file if present
        if (book.coverImage) {
            const oldFilename = path.basename(book.coverImage);
            const oldPath = path.join(uploadsDir, oldFilename);
            if (fs.existsSync(oldPath)) {
                try { fs.unlinkSync(oldPath); } catch (e) { console.warn('Failed to remove old cover', e); }
            }
        }

        book.coverImage = `/uploads/${req.file.filename}`;
        await book.save();
        res.json({ book });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

//update reading status, ownership is required
export const updateStatus = async (req, res) => {
    try {
        const {readStatus, dnfReason, startDate, endDate} = req.body;
        if (!readStatus || !validStatus.includes(readStatus)) return res.status(400).json({error: 'Invalid readStatus'});
        const book = req.resource || (await Book.findById(req.params.id));
        if (!book) return res.status(404).json({error: 'Book not found'});
        if (!req.resource) {
            const owner = book.createdBy;
            const isOwner = owner && (typeof owner.equals === 'function' ? owner.equals(req.user.id) : owner.toString() === req.user.id);
            if(!isOwner) return res.status(403).json({error: 'Not authorized'});
        }

        const sDate = parseDate(startDate);
        const eDate = parseDate(endDate);
        if (startDate && sDate === null) return res.status(400).json({error: 'Invalid startDate'});
        if (endDate && eDate === null) return res.status(400).json({error: 'Invalid endDate'});

        book.readStatus = readStatus;
        if (readStatus === 'DNF') {
            book.dnfReason = dnfReason;
        } else {
            book.dnfReason = undefined;
        }
        if (sDate) book.startDate = sDate;
        if (eDate) book.endDate = eDate;

        await book.save();
        res.json({book});
    } catch (err) {
        res.status(500).json({error: 'Server error'});
    }
};

//delete a book, ownership is required
export const deleteBook = async (req, res) => {
    try {
        const book = req.resource || (await Book.findById(req.params.id));
        if (!book) return res.status(404).json({error: 'Book not found'});
        if (!req.resource) {
            const owner = book.createdBy;
            const isOwner = owner && (typeof owner.equals === 'function' ? owner.equals(req.user.id) : owner.toString() === req.user.id);
            if (!isOwner) return res.status(403).json({error: 'Not authorized'});
        }
        await book.deleteOne();
        res.json({message: 'Book deleted'});
    } catch (err) {
        res.status(500).json({error: 'Server error'});
    }
};