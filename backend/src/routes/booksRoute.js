import express from 'express';
const router = express.Router();
import * as bookController from '../controllers/bookController.js';
import {authenticate} from '../middleware/auth.js';
import {requireOwnership} from '../middleware/ownership.js';
import { upload } from '../middleware/upload.js';
import Book from '../models/Book.js';

// only authenticated users may list their books
router.get('/', authenticate, bookController.getBooks);
router.get('/:id', bookController.getBook);
router.post('/', authenticate, bookController.createBook);
router.put('/:id', authenticate, requireOwnership(Book), bookController.updateBook);
router.put('/id/shelf', authenticate, requireOwnership(Book), bookController.updateShelf);
router.put('/:id/status', authenticate, requireOwnership(Book), bookController.updateStatus);
router.delete('/:id', authenticate, requireOwnership(Book), bookController.deleteBook);
// upload a cover image (field name: cover)
router.post('/:id/cover', authenticate, requireOwnership(Book), upload.single('cover'), bookController.uploadCover);

export default router;
