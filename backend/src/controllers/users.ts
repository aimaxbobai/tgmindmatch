import { Request, Response } from 'express';
import { User } from '../models/User';
import { findMatches } from '../services/ai';

export async function createUser(req: Request, res: Response) {
  try {
    const { telegramId, username } = req.body;

    const existingUser = await User.findOne({ telegramId });
    if (existingUser) {
      return res.json(existingUser);
    }

    const user = await User.create({
      telegramId,
      username,
      thoughtPatterns: {
        topics: {},
        sentiments: {
          positive: 0,
          negative: 0,
          neutral: 0
        }
      }
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' });
  }
}

export async function getMatches(req: Request, res: Response) {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const matches = await findMatches(user);
    res.json(matches);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get matches' });
  }
}

export async function getUserProfile(req: Request, res: Response) {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select('-__v');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get user profile' });
  }
}
