import { useRouter } from 'expo-router'; // ✅ Added for navigation
import React from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const today = new Date();
const formattedDate = today.toLocaleDateString('en-US', {
  month: 'long',
  day: 'numeric',
});
const dates = [formattedDate]; // ✅ Only today’s date

const goals = ['Journaling', 'Meditation', 'Sleep'];

export default function GoalTracker() {
  const router = useRouter(); // ✅ Get the router instance

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Goal Progress Tracker</Text>

      <View style={styles.table}>
        {/* Top Row: Goals */}
        <View style={styles.row}>
          <Text style={styles.cellDate}></Text>
          {goals.map((goal) => (
            <Text key={goal} style={styles.cellGoal}>{goal}</Text>
          ))}
        </View>

        {/* Row: Today's Date */}
        {dates.map((date) => (
          <View key={date} style={styles.row}>
            <Text style={styles.cellDate}>{date}</Text>
            {goals.map((_, index) => (
              <Text key={index} style={styles.cellEmpty}>⬜</Text>
            ))}
          </View>
        ))}
      </View>

      {/* Complete Your Goals Section */}
      <Text style={styles.sectionTitle}>Complete your goals</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/(drawer)/journaling')} // ✅ Navigates to Journaling
        >
          <Text style={styles.buttonText}>Start Journal</Text>
        </TouchableOpacity>

        <TouchableOpacity
  style={styles.button}
  onPress={() => router.push('/(drawer)/goalTrackerPages/MeditationPage')}
>
  <Text style={styles.buttonText}>Start Meditation</Text>
</TouchableOpacity>


        <TouchableOpacity
  style={styles.button}
  onPress={() => router.push('/(drawer)/goalTrackerPages/SleepPage')}
>
  <Text style={styles.buttonText}>Start Sleeping</Text>
</TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  heading: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  table: {
    marginBottom: 30,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  cellDate: {
    color: '#fff',
    width: 80,
    fontWeight: 'bold',
  },
  cellGoal: {
    color: '#fff',
    width: (screenWidth - 100) / 3,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  cellEmpty: {
    color: '#fff',
    width: (screenWidth - 100) / 3,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  buttonContainer: {
    gap: 10,
  },
  button: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
  },
});
