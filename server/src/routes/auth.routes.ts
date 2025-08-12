import express from 'express';
import { protect } from '../middleware/authMiddleware';
import { registerUser, loginUser, forgotPassword, resetPassword, getMe } from '../controllers/auth.controller';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);
router.get('/me', protect, getMe);

export default router;