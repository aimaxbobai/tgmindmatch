export interface Thought {
  _id: string;
  userId: string;
  content: string;
  timestamp: Date;
  sentiment?: number;
  topics?: string[];
  resonanceScore?: number;
  resonatedBy?: string[];
}

export interface User {
  _id: string;
  telegramId: number;
  username?: string;
  thoughtPatterns?: {
    topics: { [key: string]: number };
    sentiment: number;
    resonanceScore: number;
  };
  matches?: {
    userId: string;
    score: number;
    timestamp: Date;
  }[];
}

export interface Match {
  userId: string;
  matchedUserId: string;
  score: number;
  thoughtPatterns: {
    commonTopics: string[];
    sentimentAlignment: number;
    resonanceScore: number;
  };
  commonTopics: string[];
  sentimentAlignment: number;
  resonanceScore: number;
  timestamp: Date;
}
