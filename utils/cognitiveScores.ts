import { addDoc, collection, query, orderBy, limit, getDocs, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';

export interface CognitiveScore {
  score: number;
  sessionDate: string;
  timestamp: any;
  category: string;
  details?: {
    focus?: number;
    clarity?: number;
    calmness?: number;
  };
}

export const saveCognitiveScore = async (scoreData: Omit<CognitiveScore, 'timestamp'>) => {
  const user = auth.currentUser;
  if (!user) throw new Error('No user logged in');

  const cognitiveScoreRef = collection(db, 'users', user.uid, 'cognitiveScores');
  
  try {
    await addDoc(cognitiveScoreRef, {
      ...scoreData,
      timestamp: serverTimestamp(),
    });
    return true;
  } catch (error) {
    console.error('Error saving cognitive score:', error);
    throw error;
  }
};

export const getLatestCognitiveScore = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error('No user logged in');

  const cognitiveScoreRef = collection(db, 'users', user.uid, 'cognitiveScores');
  const q = query(cognitiveScoreRef, orderBy('timestamp', 'desc'), limit(1));

  try {
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return null;

    const latestScore = querySnapshot.docs[0].data() as CognitiveScore;
    return latestScore;
  } catch (error) {
    console.error('Error fetching latest cognitive score:', error);
    throw error;
  }
};
