import React, { createContext, useContext, useState, useEffect } from 'react';
import WebApp from '@twa-dev/sdk';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

interface User {
  id: string;
  telegramId: number;
  username: string;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  logout: () => void;
}

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  error: null,
  logout: () => {},
});

export const useUser = () => useContext(UserContext);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initUser = async () => {
      try {
        if (!WebApp.initDataUnsafe?.user) {
          throw new Error('No Telegram user data available');
        }

        const telegramUser = WebApp.initDataUnsafe.user;
        
        // Check if user exists
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('telegramId', '==', telegramUser.id));
        const querySnapshot = await getDocs(q);
        
        let userData: User;
        
        if (querySnapshot.empty) {
          // Create new user
          const docRef = await addDoc(usersRef, {
            telegramId: telegramUser.id,
            username: telegramUser.username,
          });
          
          userData = {
            id: docRef.id,
            telegramId: telegramUser.id,
            username: telegramUser.username || `user_${telegramUser.id}`,
          };
        } else {
          // Get existing user
          const doc = querySnapshot.docs[0];
          userData = {
            id: doc.id,
            ...doc.data(),
          } as User;
        }

        setUser(userData);
      } catch (err) {
        console.error('Error initializing user:', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize user');
      } finally {
        setLoading(false);
      }
    };

    initUser();
  }, []);

  const logout = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, loading, error, logout }}>
      {children}
    </UserContext.Provider>
  );
};
