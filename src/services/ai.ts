import OpenAI from 'openai';
import { User } from '../types';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function analyzeThought(thought: string) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `Analyze the following thought and return a JSON object with:
            - sentiment (number between -1 and 1)
            - topics (array of relevant topics/themes)
            - resonanceScore (number between 0 and 1 indicating how engaging/resonant the thought is)
            Format: {"sentiment": number, "topics": string[], "resonanceScore": number}`
        },
        {
          role: 'user',
          content: thought
        }
      ],
      temperature: 0.3,
    });

    const analysis = JSON.parse(response.choices[0].message.content || '{}');
    return analysis;
  } catch (error) {
    console.error('Error analyzing thought:', error);
    throw new Error('Failed to analyze thought');
  }
}

export async function findMatches(currentUser: User, users: User[]) {
  try {
    const userThoughtPatterns = currentUser.thoughtPatterns;
    if (!userThoughtPatterns) return [];

    return users
      .filter(user => user._id !== currentUser._id && user.thoughtPatterns)
      .map(user => {
        const commonTopics = Object.keys(userThoughtPatterns.topics)
          .filter(topic => user.thoughtPatterns?.topics[topic])
          .sort((a, b) => 
            (user.thoughtPatterns?.topics[b] || 0) - (user.thoughtPatterns?.topics[a] || 0)
          );

        const sentimentAlignment = user.thoughtPatterns
          ? 1 - Math.abs(userThoughtPatterns.sentiment - user.thoughtPatterns.sentiment)
          : 0;

        const resonanceAlignment = user.thoughtPatterns
          ? 1 - Math.abs(userThoughtPatterns.resonanceScore - user.thoughtPatterns.resonanceScore)
          : 0;

        const matchScore = 
          (commonTopics.length * 0.4) + 
          (sentimentAlignment * 0.3) + 
          (resonanceAlignment * 0.3);

        return {
          userId: user._id,
          matchedUserId: currentUser._id,
          score: matchScore,
          thoughtPatterns: {
            commonTopics,
            sentimentAlignment,
            resonanceScore: resonanceAlignment
          },
          timestamp: new Date()
        };
      })
      .sort((a, b) => b.score - a.score);
  } catch (error) {
    console.error('Error finding matches:', error);
    throw new Error('Failed to find matches');
  }
}
