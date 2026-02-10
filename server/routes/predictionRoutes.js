import express from 'express';
import {
  createPrediction,
  getMyPredictions,
  getPrediction,
  getAllPredictions,
  getAnalytics,
  getOptions,
  deletePrediction
} from '../controllers/predictionController.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = express.Router();

// Public routes
router.get('/options', getOptions);

// Protected routes (User)
router.post('/', protect, authorize('USER', 'ADMIN'), createPrediction);
router.get('/my-predictions', protect, authorize('USER', 'ADMIN'), getMyPredictions);
router.get('/:id', protect, authorize('USER', 'ADMIN'), getPrediction);
router.delete('/:id', protect, authorize('USER', 'ADMIN'), deletePrediction);

// Admin routes
router.get('/admin/all', protect, authorize('ADMIN'), getAllPredictions);
router.get('/admin/analytics', protect, authorize('ADMIN'), getAnalytics);

export default router;
