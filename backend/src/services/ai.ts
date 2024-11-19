import OpenAI from 'openai';
import { User } from '../models/User';
import { Thought } from '../models/Thought';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is not set in environment variables');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

interface ThoughtAnalysis {
  sentiment: 'positive' | 'negative' | 'neutral';
  topics: string[];
}

export async function analyzeThought(content: string): Promise<ThoughtAnalysis> {
  try {
    console.log('Starting thought analysis with content:', content);
    console.log('Using OpenAI API Key:', process.env.OPENAI_API_KEY?.substring(0, 10) + '...');
    
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `Analyze the following thought and return a JSON object with:
            - sentiment (string: "positive", "negative", or "neutral")
            - topics (array of relevant topics/themes, max 5)
            Format: {"sentiment": string, "topics": string[]}`
        },
        {
          role: 'user',
          content
        }
      ],
      temperature: 0.3,
    });

    console.log('OpenAI Response:', response.choices[0].message.content);
    return JSON.parse(response.choices[0].message.content || '{}');
  } catch (error) {
    console.error('Error analyzing thought:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    throw new Error('Failed to analyze thought');
  }
}

interface Match {
  user: typeof User;
  score: number;
  commonTopics: string[];
}

export async function findMatches(user: typeof User): Promise<Match[]> {
  try {
    if (!user.thoughtPatterns?.topics) return [];

    const users = await User.find({
      _id: { $ne: user._id },
      'thoughtPatterns.topics': { $exists: true }
    });

    const matches = users
      .map(otherUser => {
        if (!otherUser.thoughtPatterns?.topics) return null;

        const userTopics = Object.keys(user.thoughtPatterns.topics);
        const otherTopics = Object.keys(otherUser.thoughtPatterns.topics);
        
        const commonTopics = userTopics.filter(topic => 
          otherTopics.includes(topic)
        );

        if (commonTopics.length === 0) return null;

        // Calculate topic similarity score
        const topicScore = commonTopics.reduce((score, topic) => {
          const userCount = user.thoughtPatterns.topics[topic];
          const otherCount = otherUser.thoughtPatterns.topics[topic];
          return score + Math.min(userCount, otherCount);
        }, 0);

        // Calculate sentiment similarity
        const sentimentScore = Object.entries(user.thoughtPatterns.sentiments)
          .reduce((score, [sentiment, count]) => {
            const otherCount = otherUser.thoughtPatterns.sentiments[sentiment];
            return score + Math.min(count, otherCount);
          }, 0);

        const totalScore = (topicScore + sentimentScore) / 2;

        return {
          user: otherUser,
          score: totalScore,
          commonTopics
        };
      })
      .filter((match): match is Match => match !== null)
      .sort((a, b) => b.score - a.score);

    return matches;
  } catch (error) {
    console.error('Error finding matches:', error);
    throw new Error('Failed to find matches');
  }
}
