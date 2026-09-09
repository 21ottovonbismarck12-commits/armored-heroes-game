import express from 'express';
import { 
  getPlayer, 
  updatePlayerStats, 
  addExperience, 
  equipItem, 
  addToInventory,
  addGold 
} from '../controllers/playerController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/', getPlayer);
router.put('/stats', updatePlayerStats);
router.post('/experience', addExperience);
router.post('/equipment/equip', equipItem);
router.post('/inventory', addToInventory);
router.post('/gold', addGold);

export default router;
