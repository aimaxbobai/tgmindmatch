import axios from 'axios';
import { Thought, User, Match } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

interface CreateUserParams {
  telegramId: number;
  username?: string;
}

// User services
export const createUser = async (params: CreateUserParams): Promise<User> => {
  const response = await api.post('/users', params);
  return response.data;
};

export const getUserProfile = async (userId: string): Promise<User> => {
  const response = await api.get(`/users/${userId}`);
  return response.data;
};

export const getMatches = async (userId: string, limit: number = 10): Promise<Match[]> => {
  const response = await api.get(`/users/${userId}/matches`, { params: { limit } });
  return response.data;
};

// Thought services
export const createThought = async (content: string, userId: string): Promise<Thought> => {
  const response = await api.post('/thoughts', { content, userId });
  return response.data;
};

export const getThoughts = async (
  userId?: string,
  page: number = 1,
  limit: number = 10
): Promise<{ thoughts: Thought[]; total: number; pages: number }> => {
  const response = await api.get('/thoughts', {
    params: { userId, page, limit },
  });
  return response.data;
};

export const addResonance = async (thoughtId: string, userId: string): Promise<Thought> => {
  const response = await api.post(`/thoughts/${thoughtId}/resonate`, { userId });
  return response.data;
};
