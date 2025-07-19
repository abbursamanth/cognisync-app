import LottieView from 'lottie-react-native';
import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Chip } from 'react-native-paper';

const tagsList = ['Bug', 'Suggestion', 'Praise', 'UI', 'Other'];

export default function Feedback() {
  const [feedback, setFeedback] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleSubmit = () => {
    if (!feedback.trim()) {
      Alert.alert('Empty Feedback', 'Please write something.');
      return;
    }

    Alert.alert('Success', 'Thank you for your feedback!');
    setFeedback('');
    setSelectedTags([]);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric'
  });

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

      <LottieView
        source={require('../../assets/images/feedback.json')}
        autoPlay
        loop
        style={styles.lottie}
      />

      <View style={styles.formContainer}>
        <Text style={styles.label}>YOUR FEEDBACK</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Share your thoughts, suggestions, or issues..."
          placeholderTextColor="#4CAF50"
          multiline
          numberOfLines={8}
          maxLength={1000}
          value={feedback}
          onChangeText={setFeedback}
        />

        <View style={styles.chipContainer}>
          {tagsList.map(tag => (
            <Chip
              key={tag}
              mode="outlined"
              selected={selectedTags.includes(tag)}
              onPress={() => toggleTag(tag)}
              style={[
                styles.chip,
                selectedTags.includes(tag) && styles.selectedChip
              ]}
              textStyle={[
                styles.chipText,
                selectedTags.includes(tag) && styles.selectedChipText
              ]}
            >
              {tag}
            </Chip>
          ))}
        </View>

        <View style={styles.buttonContainer}>
          <View style={styles.saveButton}>
            <Text 
              style={styles.saveButtonText}
              onPress={handleSubmit}>
              SUBMIT FEEDBACK
            </Text>
          </View>
        </View>
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
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  chip: {
    backgroundColor: '#1A1A1A',
    borderWidth: 1.5,
    borderColor: '#333333',
  },
  selectedChip: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  chipText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  selectedChipText: {
    color: '#FFFFFF',
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
});
