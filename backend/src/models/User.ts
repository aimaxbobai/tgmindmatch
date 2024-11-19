import { Schema, model } from 'mongoose';

interface IUser {
  telegramId: number;
  username?: string;
  thoughtPatterns: {
    topics: Record<string, number>;
    sentiments: {
      positive: number;
      negative: number;
      neutral: number;
    };
  };
  matches?: Array<{
    userId: Schema.Types.ObjectId;
    score: number;
    lastInteraction: Date;
  }>;
  createdAt: Date;
}

const userSchema = new Schema<IUser>({
  telegramId: { type: Number, required: true, unique: true },
  username: { type: String },
  thoughtPatterns: {
    topics: { type: Object, default: {} },
    sentiments: {
      positive: { type: Number, default: 0 },
      negative: { type: Number, default: 0 },
      neutral: { type: Number, default: 0 }
    }
  },
  matches: [{
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    score: Number,
    lastInteraction: Date
  }],
  createdAt: { type: Date, default: Date.now }
});

export const User = model<IUser>('User', userSchema);
