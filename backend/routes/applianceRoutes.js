import express from 'express';
import {
  getAppliances,
  addAppliance,
  updateAppliance,
  deleteAppliance,
} from '../controllers/applianceController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Apply auth middleware to all appliance routes
router.use(protect);

router.route('/')
  .get(getAppliances)
  .post(addAppliance);

router.route('/:id')
  .put(updateAppliance)
  .delete(deleteAppliance);

export default router;