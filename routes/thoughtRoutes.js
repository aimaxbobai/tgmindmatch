import express from 'express';
import {
  createThought,
  getAllThoughts,
  getUserThoughts,
  resonateWithThought,
  unresonateWithThought
} from '../controllers/thoughtController.js';

const router = express.Router();

// Маршруты для мыслей
router.post('/', createThought);
router.get('/', getAllThoughts);
router.get('/user/:userId', getUserThoughts);
router.post('/:thoughtId/resonate', resonateWithThought);
router.post('/:thoughtId/unresonate', unresonateWithThought);

export default router;
