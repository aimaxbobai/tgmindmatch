import { collection, addDoc, getDocs, query, where, orderBy, limit, updateDoc, doc, increment, serverTimestamp, Timestamp, deleteDoc, arrayUnion, arrayRemove, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Thought } from '../types/thought';

// Collection references
const thoughtsCollection = collection(db, 'thoughts');

// Functions
export const createThought = async (text: string, userId: string, nickname: string): Promise<void> => {
  try {
    console.log('Creating thought:', { text, userId, nickname });
    await addDoc(thoughtsCollection, {
      text,
      textLower: text.toLowerCase(),
      userId,
      nickname,
      createdAt: serverTimestamp(),
      resonanceCount: 0,
      resonatedBy: [],
    });
    console.log('Thought created successfully');
  } catch (error) {
    console.error('Error creating thought:', error);
    throw error;
  }
};

export const getThoughts = async (limit: number = 20, searchQuery: string = ''): Promise<Thought[]> => {
  try {
    console.log('Getting thoughts with query:', searchQuery);
    let q;
    
    if (searchQuery.trim()) {
      const searchLower = searchQuery.toLowerCase().trim();
      q = query(
        thoughtsCollection,
        where('textLower', '>=', searchLower),
        where('textLower', '<=', searchLower + '\uf8ff'),
        orderBy('textLower'),
        orderBy('createdAt', 'desc'),
        limit
      );
    } else {
      q = query(
        thoughtsCollection,
        orderBy('createdAt', 'desc'),
        limit
      );
    }

    const querySnapshot = await getDocs(q);
    const thoughts: Thought[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      thoughts.push({
        id: doc.id,
        text: data.text,
        userId: data.userId,
        nickname: data.nickname,
        createdAt: data.createdAt?.toDate() || new Date(),
        resonanceCount: data.resonanceCount || 0,
        resonatedBy: data.resonatedBy || [],
      });
    });

    console.log('Retrieved thoughts:', thoughts.length);
    return thoughts;
  } catch (error: any) {
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

export const deleteThought = async (thoughtId: string, userId: string): Promise<boolean> => {
  try {
    console.log('Attempting to delete thought:', { thoughtId, userId });
    
    // Получаем документ мысли напрямую
    const thoughtRef = doc(db, 'thoughts', thoughtId);
    const thoughtDoc = await getDoc(thoughtRef);
    
    if (!thoughtDoc.exists()) {
      console.error('Thought not found');
      throw new Error('Thought not found');
    }
    
    const thoughtData = thoughtDoc.data();
    console.log('Thought data:', thoughtData);
    
    if (thoughtData.userId !== userId) {
      console.error('Permission denied: user does not own this thought', {
        thoughtUserId: thoughtData.userId,
        requestUserId: userId
      });
      throw new Error('You do not have permission to delete this thought');
    }
    
    // Удаляем мысль
    await deleteDoc(thoughtRef);
    console.log('Thought deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting thought:', error);
    throw error;
  }
};

export const toggleResonance = async (thoughtId: string, userId: string): Promise<boolean> => {
  try {
    console.log('Toggling resonance:', { thoughtId, userId });
    const thoughtRef = doc(db, 'thoughts', thoughtId);
    const thoughtSnap = await getDocs(query(thoughtsCollection, where('__name__', '==', thoughtId)));
    
    if (thoughtSnap.empty) {
      console.error('Thought not found');
      throw new Error('Thought not found');
    }

    const thought = thoughtSnap.docs[0].data();
    const resonatedBy = thought.resonatedBy || [];
    const hasResonated = resonatedBy.includes(userId);

    await updateDoc(thoughtRef, {
      resonanceCount: increment(hasResonated ? -1 : 1),
      resonatedBy: hasResonated ? arrayRemove(userId) : arrayUnion(userId)
    });

    console.log('Resonance toggled successfully');
    return !hasResonated;
  } catch (error) {
    console.error('Error toggling resonance:', error);
    throw error;
  }
};
