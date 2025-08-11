import express from 'express';
import User from '../models/User';

const router = express.Router();

// GET /api/users/by-email/:email
router.get('/by-email/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: new RegExp('^' + req.params.email + '$', 'i') });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
