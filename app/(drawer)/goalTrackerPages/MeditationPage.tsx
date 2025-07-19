import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';
import LottieView from 'lottie-react-native';
import React, { useRef, useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View, 
  Platform,
  ScrollView,
  Dimensions 
} from 'react-native';

export default function MeditationPage() {
  const lottieRef = useRef(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const currentDate = new Date().toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric'
  });

  async function playSound() {
    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        interruptionModeIOS: InterruptionModeIOS.DoNotMix,
        interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
      });

      if (sound) {
        await sound.unloadAsync();
      }

      const { sound: newSound } = await Audio.Sound.createAsync(
        require('../../../assets/sounds/meditation.mp3')
      );

      setSound(newSound);
      await newSound.playAsync();
      setIsPlaying(true);
      setIsPaused(false);
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  }

  async function pauseSound() {
    try {
      if (sound && isPlaying) {
        await sound.pauseAsync();
        setIsPaused(true);
        setIsPlaying(false);
      }
    } catch (error) {
      console.error('Error pausing sound:', error);
    }
  }

  async function resumeSound() {
    try {
      if (sound && isPaused) {
        await sound.playAsync();
        setIsPlaying(true);
        setIsPaused(false);
      }
    } catch (error) {
      console.error('Error resuming sound:', error);
    }
  }

  async function stopSound() {
    try {
      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
        setSound(null);
        setIsPlaying(false);
        setIsPaused(false);
      }
    } catch (error) {
      console.error('Error stopping sound:', error);
    }
  }

  return (
    <View style={styles.container}>
      <LottieView
        ref={lottieRef}
        source={require('../../../assets/images/medi.json')}
        autoPlay
        loop
        style={styles.lottie}
      />

      <TouchableOpacity 
        style={[styles.button, styles.playButton]} 
        onPress={playSound}
      >
        <Text style={styles.buttonText}>
          {isPlaying ? 'Playing...' : 'Play Audio'}
        </Text>
      </TouchableOpacity>

      {isPlaying && (
        <TouchableOpacity 
          style={[styles.button, styles.controlButton]} 
          onPress={pauseSound}
        >
          <Text style={styles.buttonText}>Pause</Text>
        </TouchableOpacity>
      )}

      {isPaused && (
        <TouchableOpacity 
          style={[styles.button, styles.controlButton]} 
          onPress={resumeSound}
        >
          <Text style={styles.buttonText}>Resume</Text>
        </TouchableOpacity>
      )}

      {(isPlaying || isPaused) && (
        <TouchableOpacity 
          style={[styles.button, styles.stopButton]} 
          onPress={stopSound}
        >
          <Text style={styles.buttonText}>Finish</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottie: {
    width: 300,
    height: 300,
  },
  button: {
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    width: 150,
    alignItems: 'center',
  },
  playButton: {
    backgroundColor: '#4CAF50',
  },
  controlButton: {
    backgroundColor: '#1A1A1A',
    borderWidth: 1.5,
    borderColor: '#333333',
  },
  stopButton: {
    backgroundColor: '#ff4444',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
});
