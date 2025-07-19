import { useRouter } from 'expo-router';
import { doc, setDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../../firebase';

export default function GoalSetup() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [bio, setBio] = useState('');
  const [hobbies, setHobbies] = useState('');
  const [loading, setLoading] = useState(false);

  const [journaling, setJournaling] = useState(false);
  const [meditation, setMeditation] = useState(false);
  const [sleep, setSleep] = useState(false);

  const handleSaveProfile = async () => {
  const user = auth.currentUser;
  if (!user) return;
  setLoading(true);

  try {
    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, {
      goals: {
        journaling,
        meditation,
        sleep,
      }
    }, { merge: true }); // ✅ Keeps existing name, dob, bio, etc.

    router.replace('/(drawer)/goalTracker');
  } catch (error) {
    console.error('Error saving goals:', error);
  } finally {
    setLoading(false);
  }
};

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Set Up Your Profile</Text>

      <TextInput
        style={styles.input}
        placeholder="Name"
        placeholderTextColor="#aaa"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Date of Birth (DD/MM/YYYY)"
        placeholderTextColor="#aaa"
        value={dob}
        onChangeText={setDob}
      />
      <TextInput
        style={styles.input}
        placeholder="Gender"
        placeholderTextColor="#aaa"
        value={gender}
        onChangeText={setGender}
      />
      <TextInput
        style={styles.input}
        placeholder="Short Bio"
        placeholderTextColor="#aaa"
        value={bio}
        onChangeText={setBio}
      />
      <TextInput
        style={styles.input}
        placeholder="Hobbies"
        placeholderTextColor="#aaa"
        value={hobbies}
        onChangeText={setHobbies}
      />

      <Text style={styles.sectionTitle}>Select Your Goals</Text>
      <View style={styles.goalRow}>
        <TouchableOpacity
          style={[styles.goalOption, journaling && styles.goalSelected]}
          onPress={() => setJournaling(!journaling)}
        >
          <Text style={styles.goalText}>Journaling</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.goalOption, meditation && styles.goalSelected]}
          onPress={() => setMeditation(!meditation)}
        >
          <Text style={styles.goalText}>Meditation</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.goalOption, sleep && styles.goalSelected]}
          onPress={() => setSleep(!sleep)}
        >
          <Text style={styles.goalText}>Sleep</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile} disabled={loading}>
        <Text style={styles.saveButtonText}>{loading ? 'Saving...' : 'Save Profile'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    flexGrow: 1,
    padding: 20,
  },
  title: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#222',
    color: 'white',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    color: 'white',
    marginBottom: 10,
  },
  goalRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  goalOption: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    backgroundColor: '#333',
    minWidth: 100,
    alignItems: 'center',
    margin: 6,
  },
  goalSelected: {
    backgroundColor: '#4CAF50',
  },
  goalText: {
    color: 'white',
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: 'white',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  saveButtonText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
});
