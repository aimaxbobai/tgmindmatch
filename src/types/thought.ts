import { Timestamp } from 'firebase/firestore';

export interface Thought {
  id?: string;
  text: string;
  userId: string;
  nickname: string;
  resonanceCount: number;
  resonatedBy: string[];
  createdAt: Date | Timestamp;
}
