import express from 'express';
const router = express.Router();
import * as bookController from '../controllers/bookController.js';
import {authenticate} from '../middleware/auth.js';
import {requireOwnership} from '../middleware/ownership.js';
import Book from '../models/Book.js';

router.get('/', bookController.getBooks);
router.get('/:id', bookController.getBook);
router.post('/', authenticate, bookController.createBook);
router.put('/:id', authenticate, requireOwnership(Book), bookController.updateBook);
router.put('/id/shelf', authenticate, requireOwnership(Book), bookController.updateShelf);
router.put('/:id/status', authenticate, requireOwnership(Book), bookController.updateStatus);
router.delete('/:id', authenticate, requireOwnership(Book), bookController.deleteBook);

export default router;
