import express from 'express';
import { startCombat, getCombatHistory } from '../controllers/combatController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.post('/start', startCombat);
router.get('/history', getCombatHistory);

export default router;
