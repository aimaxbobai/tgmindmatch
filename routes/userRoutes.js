import express from 'express';
import {
  createOrUpdateUser,
  getUserProfile,
  getSimilarUsers
} from '../controllers/userController.js';

const router = express.Router();

// Маршруты для пользователей
router.post('/', createOrUpdateUser);
router.get('/:telegramId', getUserProfile);
router.get('/:telegramId/similar', getSimilarUsers);

export default router;
