// app/journaling.tsx

import { addDoc, collection, serverTimestamp, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import LottieView from 'lottie-react-native';
import React, { useState, useEffect } from 'react';
import {
  Alert,
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { LiquidGlassButton } from '../../components/LiquidGlassButton';
import { auth, db } from '../../firebase';

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  date: string;
  timestamp: any; // Using 'any' for Firebase Timestamp
}

export default function Journaling() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);

  // Fetch journal entries when component mounts
  useEffect(() => {
    const fetchEntries = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const journalRef = collection(db, 'users', user.uid, 'journals');
      const q = query(journalRef, orderBy('timestamp', 'desc'), limit(5));
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const entries = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp
        } as JournalEntry));
        setJournalEntries(entries);
      });

      return unsubscribe;
    };

    fetchEntries();
  }, []);

  const handleSave = async () => {
    if (!title || !content) {
      Alert.alert('Missing Fields', 'Please fill in both title and content.');
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      Alert.alert('Not logged in', 'Please sign in again.');
      return;
    }

    try {
      const journalRef = collection(db, 'users', user.uid, 'journals');
      await addDoc(journalRef, {
        title,
        content,
        date: new Date().toLocaleDateString('en-GB'), // DD/MM/YYYY format
        timestamp: serverTimestamp(),
      });
      Alert.alert('Success', 'Journal entry saved!');
      setTitle('');
      setContent('');
    } catch (error) {
      Alert.alert('Error', 'Failed to save entry.');
      console.error('Journal save error:', error);
    }
  };

  const currentDate = new Date().toLocaleDateString('en-GB'); // DD/MM/YYYY format

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} style={styles.screen}>
      {/* Digital timestamp header */}
      <View style={styles.timestamp}>
        <Text style={styles.timestampText}>{currentDate}</Text>
        <View style={styles.dots}>
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
      </View>

      {/* Lottie animation */}
      <LottieView
        source={require('../../assets/images/journal.json')}
        autoPlay
        loop
        style={styles.lottie}
      />

      <View style={styles.formContainer}>
        <Text style={styles.label}>TITLE</Text>
        <TextInput
          style={styles.input}
          placeholder="Journal Title"
          placeholderTextColor="#4CAF50"
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.label}>CONTENT</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Write your thoughts here (max 500 words)"
          placeholderTextColor="#4CAF50"
          multiline
          numberOfLines={8}
          maxLength={3000}
          value={content}
          onChangeText={setContent}
        />

        <View style={styles.buttonContainer}>
          <View style={styles.saveButton}>
            <Text 
              style={styles.saveButtonText}
              onPress={handleSave}>
              SAVE ENTRY
            </Text>
          </View>
        </View>

        {/* Recent Entries Section */}
        {journalEntries.length > 0 && (
          <View style={styles.recentEntries}>
            <Text style={[styles.label, { marginTop: 24 }]}>RECENT ENTRIES</Text>
            {journalEntries.map((entry) => (
              <View key={entry.id} style={styles.entryCard}>
                <View style={styles.entryHeader}>
                  <Text style={styles.entryTitle}>{entry.title}</Text>
                  <Text style={styles.entryDate}>{entry.date}</Text>
                </View>
                <Text style={styles.entryContent} numberOfLines={2}>
                  {entry.content}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollContainer: {
    padding: 0,
  },
  timestamp: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1.5,
    borderBottomColor: '#333333',
    backgroundColor: '#1A1A1A',
  },
  timestampText: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  dots: {
    flexDirection: 'row',
    gap: 3,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
  },
  formContainer: {
    padding: 16,
  },
  lottie: {
    width: Dimensions.get('window').width - 32,
    height: 180,
    alignSelf: 'center',
    marginVertical: 16,
  },
  label: {
    color: '#FFFFFF',
    marginBottom: 6,
    fontWeight: '600',
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#333333',
    padding: 12,
    marginBottom: 16,
    color: '#FFFFFF',
    backgroundColor: '#1A1A1A',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  textArea: {
    borderWidth: 1.5,
    borderColor: '#333333',
    padding: 12,
    marginBottom: 16,
    height: 150,
    textAlignVertical: 'top',
    color: '#FFFFFF',
    backgroundColor: '#1A1A1A',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  buttonContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#1A1A1A',
    borderWidth: 1.5,
    borderColor: '#333333',
    padding: 12,
    width: '100%',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  recentEntries: {
    marginTop: 8,
  },
  entryCard: {
    backgroundColor: '#1A1A1A',
    borderWidth: 1.5,
    borderColor: '#333333',
    padding: 12,
    marginBottom: 12,
    borderRadius: 4,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  entryTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    flex: 1,
  },
  entryDate: {
    color: '#4CAF50',
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  entryContent: {
    color: '#CCCCCC',
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    lineHeight: 18,
  },
});
