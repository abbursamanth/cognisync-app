import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import { doc, setDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Chip } from 'react-native-paper';
import { auth, db } from '../firebase';

export default function ProfileSetup() {
  const user = auth.currentUser;
  const [name, setName] = useState('');
  const [editingName, setEditingName] = useState(false);

  const [dob, setDob] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [gender, setGender] = useState('');
  const [bio, setBio] = useState('');
  const [hobbyInput, setHobbyInput] = useState('');
  const [hobbies, setHobbies] = useState<string[]>([]);

  useEffect(() => {
    if (user?.email) {
      const defaultName = user.email.split('@')[0];
      setName(defaultName);
    }
  }, [user]);

  const handleAddHobby = () => {
    const trimmed = hobbyInput.trim();
    if (trimmed && !hobbies.includes(trimmed)) {
      setHobbies([...hobbies, trimmed]);
      setHobbyInput('');
    }
  };

  const handleDateChange = (_: any, selected?: Date) => {
    if (Platform.OS !== 'ios') {
      setShowDatePicker(false);
    }
    if (selected) {
      const day = selected.getDate().toString().padStart(2, '0');
      const month = (selected.getMonth() + 1).toString().padStart(2, '0');
      const year = selected.getFullYear();
      const formatted = `${day}-${month}-${year}`;
      setDob(formatted);
      setSelectedDate(selected);
    }
  };

  const handleSubmit = async () => {
    if (!name || !dob || !gender || !bio || hobbies.length === 0) {
      Alert.alert('Incomplete Info', 'Please fill out all fields.');
      return;
    }

    try {
      await setDoc(doc(db, 'users', user.uid), {
        name,
        dob,
        gender,
        bio,
        hobbies,
        email: user.email,
      });

      Alert.alert('Success', 'Profile saved successfully!');
      router.replace('/(drawer)/dashboard');
    } catch (error) {
      const err = error as { message: string };
      Alert.alert('Error', err.message);
      console.error('Profile save error:', error);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Profile Setup</Text>

      {/* Name Field with Edit */}
      <View style={styles.nameRow}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          value={name}
          onChangeText={setName}
          editable={editingName}
          placeholder="Username"
          placeholderTextColor="#888"
        />
        <TouchableOpacity onPress={() => setEditingName((prev) => !prev)}>
          <Text style={styles.editIcon}>{editingName ? '✔️' : '✏️'}</Text>
        </TouchableOpacity>
      </View>

      {/* Date of Birth */}
      <TouchableOpacity onPress={() => setShowDatePicker(true)}>
        <TextInput
          style={styles.input}
          placeholder="Date of Birth"
          placeholderTextColor="#888"
          value={dob}
          editable={false}
          pointerEvents="none"
        />
      </TouchableOpacity>

      {/* Dark-themed Date Picker (modal only on Android) */}
      {showDatePicker && (
        Platform.OS === 'ios' ? (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="spinner"
            textColor="white"
            maximumDate={new Date()}
            onChange={handleDateChange}
          />
        ) : (
          <Modal transparent animationType="slide" visible={showDatePicker}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <DateTimePicker
                  value={selectedDate}
                  mode="date"
                  display="spinner"
                  maximumDate={new Date()}
                  onChange={handleDateChange}
                />
                <Button title="Done" onPress={() => setShowDatePicker(false)} />
              </View>
            </View>
          </Modal>
        )
      )}

      {/* Gender Selection */}
      <View style={styles.genderRow}>
        {['Male', 'Female', 'Other'].map((g) => (
          <TouchableOpacity
            key={g}
            style={[styles.genderOption, gender === g && styles.genderSelected]}
            onPress={() => setGender(g)}
          >
            <Text style={styles.genderText}>{g}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Bio */}
      <TextInput
        style={[styles.input, styles.bioInput]}
        placeholder="Bio (max 250 characters)"
        placeholderTextColor="#888"
        multiline
        maxLength={250}
        value={bio}
        onChangeText={(text) => {
          if (text.length <= 250) setBio(text);
        }}
      />
      <Text style={styles.charCount}>{bio.length}/250</Text>

      {/* Hobbies */}
      <View style={styles.hobbyRow}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="Add a hobby"
          placeholderTextColor="#888"
          value={hobbyInput}
          onChangeText={setHobbyInput}
          onSubmitEditing={handleAddHobby}
        />
        <Button title="Add" onPress={handleAddHobby} />
      </View>
      <View style={styles.chipsContainer}>
        {hobbies.map((hobby, index) => (
          <Chip key={index} style={styles.chip} textStyle={{ color: 'white' }}>
            {hobby}
          </Chip>
        ))}
      </View>

      {/* Submit */}
      <View style={{ marginTop: 20 }}>
        <Button title="Save Profile" onPress={handleSubmit} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  content: { padding: 24, paddingBottom: 60 },
  title: {
    fontSize: 26,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
    borderColor: '#444',
    color: '#fff',
    backgroundColor: '#111',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  editIcon: {
    marginLeft: 10,
    fontSize: 20,
    color: '#00bfff',
  },
  genderRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  genderOption: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderRadius: 20,
    borderColor: '#555',
    backgroundColor: '#111',
  },
  genderSelected: {
    backgroundColor: '#00bfff',
    borderColor: '#00bfff',
  },
  genderText: {
    color: '#fff',
    fontWeight: '600',
  },
  hobbyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 16,
  },
  chip: {
    backgroundColor: '#222',
    margin: 4,
  },
  charCount: {
    textAlign: 'right',
    color: '#aaa',
    marginBottom: 12,
  },
  bioInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#000000aa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#222',
    borderRadius: 10,
    padding: 20,
    width: '80%',
  },
});
