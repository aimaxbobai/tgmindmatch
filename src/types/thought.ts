import { Timestamp } from 'firebase/firestore';

export interface Thought {
  id?: string;
  userId: string;
  username: string;
  content: string;
  resonanceCount: number;
  createdAt: Timestamp;
  resonatedBy?: string[];
}
