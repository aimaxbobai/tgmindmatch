import { Schema, model } from 'mongoose';

interface IThought {
  userId: Schema.Types.ObjectId;
  content: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  topics: string[];
  resonance: Schema.Types.ObjectId[];
  createdAt: Date;
}

const thoughtSchema = new Schema<IThought>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  sentiment: { 
    type: String, 
    enum: ['positive', 'negative', 'neutral'],
    required: true 
  },
  topics: [{ type: String }],
  resonance: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now }
});

thoughtSchema.index({ content: 'text' });
thoughtSchema.index({ topics: 1 });
thoughtSchema.index({ userId: 1, createdAt: -1 });

export const Thought = model<IThought>('Thought', thoughtSchema);
