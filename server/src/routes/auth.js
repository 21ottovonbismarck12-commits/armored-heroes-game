import express from 'express';
import { register, login, getProfile } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import playerRoutes from './player.js';
import combatRoutes from './combat.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, getProfile);

router.use('/player', playerRoutes);
router.use('/combat', combatRoutes);

export default router;
