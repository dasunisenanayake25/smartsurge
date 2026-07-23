import express from 'express';
import {
  getLiveEnergyData,
  getEnergyHistory,
  getBillEstimate,
} from '../controllers/energyController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Apply auth middleware to protect energy routes
router.use(protect);

router.get('/live', getLiveEnergyData);
router.get('/history', getEnergyHistory);
router.get('/bill-estimate', getBillEstimate);

export default router;