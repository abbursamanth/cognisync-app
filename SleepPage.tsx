import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';
import LottieView from 'lottie-react-native';
import React, { useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SleepPage() {
  const lottieRef = useRef(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

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
        require('../../../assets/sounds/NSDRaudio.mp3') // 🎧 NSDR Audio for Sleep
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
        source={require('@/assets/images/sleep.json')} // 💤 Sleep Lottie
        autoPlay
        loop
        style={styles.lottie}
      />

      <TouchableOpacity style={styles.button} onPress={playSound}>
        <Text style={styles.buttonText}>
          {isPlaying ? 'Playing...' : 'Play Audio'}
        </Text>
      </TouchableOpacity>

      {isPlaying && (
        <TouchableOpacity style={styles.button} onPress={pauseSound}>
          <Text style={styles.buttonText}>Pause</Text>
        </TouchableOpacity>
      )}

      {isPaused && (
        <TouchableOpacity style={styles.button} onPress={resumeSound}>
          <Text style={styles.buttonText}>Resume</Text>
        </TouchableOpacity>
      )}

      {(isPlaying || isPaused) && (
        <TouchableOpacity style={[styles.button, { backgroundColor: '#ff4444' }]} onPress={stopSound}>
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
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
