import express from 'express';
const router = express.Router();
import * as authController from '../controllers/authController.js';
import {authenticate} from '../middleware/auth.js';

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', authenticate, authController.me);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);

export default router;