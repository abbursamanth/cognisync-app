import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Platform, StyleSheet, Text, View } from 'react-native';
import { db } from '../../firebase';

interface Session {
  id: string;
  sessionDate: string;
  sessionDuration: string;
}

export default function SessionHistory() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'sessionHistory'));
        const sessionData: Session[] = querySnapshot.docs.map(doc => ({
          id: doc.id,
          sessionDate: doc.data().sessionDate,
          sessionDuration: doc.data().sessionDuration,
        }));
        setSessions(sessionData);
      } catch (error) {
        console.error('Error fetching session history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (sessions.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No session history available.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={sessions}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.sessionItem}>
            <Text style={styles.sessionText}>Date: {item.sessionDate}</Text>
            <Text style={styles.sessionText}>Duration: {item.sessionDuration}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFE4D6',
    padding: 16
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E97777',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    textAlign: 'center',
    borderWidth: 1.5,
    borderColor: '#FF9B9B',
    padding: 12,
    backgroundColor: '#FFF'
  },
  sessionItem: {
    padding: 12,
    marginVertical: 4,
    backgroundColor: '#FFF',
    borderWidth: 1.5,
    borderColor: '#FF9B9B',
    width: '100%'
  },
  sessionText: {
    fontSize: 14,
    color: '#E97777',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    marginBottom: 4
  }
});