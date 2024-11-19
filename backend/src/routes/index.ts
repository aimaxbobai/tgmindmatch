import express from 'express';
import * as thoughtsController from '../controllers/thoughts';
import * as usersController from '../controllers/users';

const router = express.Router();

// Thoughts routes
router.post('/thoughts', thoughtsController.createThought);
router.get('/thoughts', thoughtsController.getThoughts);
router.post('/thoughts/:thoughtId/resonate', thoughtsController.addResonance);

// Users routes
router.post('/users', usersController.createUser);
router.get('/users/:userId/matches', usersController.getMatches);
router.get('/users/:userId', usersController.getUserProfile);

export default router;
