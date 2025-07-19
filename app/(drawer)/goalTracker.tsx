import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Platform } from 'react-native';
import { Checkbox } from 'react-native-paper';

export default function GoalTracker() {
  const router = useRouter();
  const goals = ['Journaling', 'Meditation', 'Sleep'];
  const [selectedGoals, setSelectedGoals] = useState<{ [key: string]: boolean }>({
    Journaling: false,
    Meditation: false,
    Sleep: false
  });
  const toggleGoal = (goal: string) => {
    setSelectedGoals(prev => ({
      ...prev,
      [goal]: !prev[goal]
    }));
  };

  const navigateToGoal = (goal: string) => {
    switch(goal) {
      case 'Journaling':
        router.push('/(drawer)/journaling');
        break;
      case 'Meditation':
        router.push('/(drawer)/goalTrackerPages/MeditationPage');
        break;
      case 'Sleep':
        router.push('/(drawer)/goalTrackerPages/SleepPage');
        break;
    }
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

      <View style={styles.content}>
        <Text style={styles.heading}>Daily Goals</Text>

        <View style={styles.goalsContainer}>
          {goals.map((goal) => (
            <View key={goal} style={styles.goalItem}>
              <View style={styles.goalHeader}>
                <Text style={styles.goalTitle}>{goal}</Text>
                <Checkbox.Android
                  status={selectedGoals[goal] ? 'checked' : 'unchecked'}
                  onPress={() => toggleGoal(goal)}
                  color="#4CAF50"
                />
              </View>
              
              <TouchableOpacity
                style={styles.startButton}
                onPress={() => navigateToGoal(goal)}
              >
                <Text style={styles.buttonText}>Start {goal}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={styles.statsContainer}>
          <Text style={styles.statsTitle}>Today's Progress</Text>
          <Text style={styles.statsText}>
            {Object.values(selectedGoals).filter(Boolean).length} / {goals.length} goals completed
          </Text>
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
  content: {
    padding: 16,
  },
  heading: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  goalsContainer: {
    gap: 16,
  },
  goalItem: {
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#333333',
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  startButton: {
    backgroundColor: '#1A1A1A',
    borderWidth: 1.5,
    borderColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  statsContainer: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#333333',
  },
  statsTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  statsText: {
    color: '#FFFFFF',
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.8,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
});
