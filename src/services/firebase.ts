import { collection, addDoc, getDocs, query, where, orderBy, limit, updateDoc, doc, increment, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { Thought } from '../types/thought';

// Collection references
const thoughtsCollection = collection(db, 'thoughts');

// Functions
export const createThought = async (thought: Omit<Thought, 'id' | 'resonanceCount' | 'createdAt'>) => {
  try {
    const docRef = await addDoc(thoughtsCollection, {
      ...thought,
      resonanceCount: 0,
      createdAt: serverTimestamp(),
      resonatedBy: []
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating thought:', error);
    throw error;
  }
};

export const getThoughts = async (limitCount: number = 20) => {
  try {
    const q = query(
      thoughtsCollection,
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt as Timestamp
    })) as Thought[];
  } catch (error) {
    console.error('Error getting thoughts:', error);
    throw error;
  }
};

export const getUserThoughts = async (userId: string) => {
  try {
    const q = query(
      thoughtsCollection,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt as Timestamp
    })) as Thought[];
  } catch (error) {
    console.error('Error getting user thoughts:', error);
    throw error;
  }
};

export const incrementResonance = async (thoughtId: string) => {
  try {
    const thoughtRef = doc(db, 'thoughts', thoughtId);
    await updateDoc(thoughtRef, {
      resonanceCount: increment(1)
    });
  } catch (error) {
    console.error('Error incrementing resonance:', error);
    throw error;
  }
};
