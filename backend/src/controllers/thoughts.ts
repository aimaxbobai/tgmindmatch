import { Request, Response } from 'express';
import { Thought } from '../models/Thought';
import { User } from '../models/User';
import { analyzeThought } from '../services/ai';

export async function createThought(req: Request, res: Response) {
  try {
    const { content, userId } = req.body;
    console.log('Creating thought:', { content, userId });

    const analysis = await analyzeThought(content);
    console.log('Thought analysis:', analysis);

    const thought = await Thought.create({
      content,
      userId,
      sentiment: analysis.sentiment,
      topics: analysis.topics
    });
    console.log('Thought created:', thought);

    // Update user's thought patterns
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Initialize thoughtPatterns if needed
    if (!user.thoughtPatterns) {
      user.thoughtPatterns = {
        topics: {},
        sentiments: {
          positive: 0,
          negative: 0,
          neutral: 0
        }
      };
    }

    // Update topics
    analysis.topics.forEach(topic => {
      if (!user.thoughtPatterns.topics[topic]) {
        user.thoughtPatterns.topics[topic] = 1;
      } else {
        user.thoughtPatterns.topics[topic]++;
      }
    });

    // Update sentiment
    user.thoughtPatterns.sentiments[analysis.sentiment]++;

    await user.save();
    console.log('User patterns updated:', user.thoughtPatterns);

    res.status(201).json(thought);
  } catch (error) {
    console.error('Error creating thought:', error);
    res.status(500).json({ error: 'Failed to create thought', details: error.message });
  }
}

export async function getThoughts(req: Request, res: Response) {
  try {
    const thoughts = await Thought.find().sort({ createdAt: -1 }).limit(20);
    res.json(thoughts);
  } catch (error) {
    console.error('Error getting thoughts:', error);
    res.status(500).json({ error: 'Failed to fetch thoughts' });
  }
}

export async function addResonance(req: Request, res: Response) {
  try {
    const { thoughtId } = req.params;
    const { userId } = req.body;

    const thought = await Thought.findById(thoughtId);
    if (!thought) {
      return res.status(404).json({ error: 'Thought not found' });
    }

    if (!thought.resonance.includes(userId)) {
      thought.resonance.push(userId);
      await thought.save();
    }

    res.json(thought);
  } catch (error) {
    console.error('Error adding resonance:', error);
    res.status(500).json({ error: 'Failed to add resonance' });
  }
}
