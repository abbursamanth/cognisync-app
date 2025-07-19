import { useNavigation } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    Easing,
    StyleSheet,
    Text,
    View,
    Platform,
    TouchableOpacity,
} from 'react-native';
// BLE imports removed for simulation
import EEGGraph from '../../components/EEGGraph';

const { width } = Dimensions.get('window');

export default function StartSession() {
  const navigation = useNavigation();
  const [running, setRunning] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Simulated EEG data
  const [eegData, setEegData] = useState<number[]>(generateWave());

  function generateWave(length = 250): number[] {
    const wave = [];
    const t = Date.now() / 1000; // Use current time for continuous flow
    
    for (let i = 0; i < length; i++) {
      const x = i / length;
      // Base signal with multiple frequency components
      const baseSignal = Math.sin(x * Math.PI * 4 + t) * 15 +
                        Math.sin(x * Math.PI * 6 + t * 1.1) * 10 +
                        Math.sin(x * Math.PI * 8 + t * 1.2) * 5;
                        
      // Add micro-variations
      const microDetail = Math.sin(x * 50 + t * 2) * 2 +
                         Math.sin(x * 30 + t * 1.5) * 1.5;
                         
      // Combine with controlled randomness
      const noise = (Math.sin(x * 100 + t * 3) + Math.sin(x * 80 + t * 2.5)) * 0.5;
      
      wave.push(baseSignal + microDetail + noise);
    }
    return wave;
  }

  // Timer logic
  useEffect(() => {
    if (running) {
      timerRef.current = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [running]);

  // Update wave pattern
  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      setEegData(generateWave());
    }, 50); // Faster updates for smoother animation
    return () => clearInterval(interval);
  }, [running]);

  // Cognitive score calculation (dynamic, based on session data)
  const calculateScore = () => {
    const mean = eegData.reduce((a, b) => a + b, 0) / eegData.length;
    const variance = eegData.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / eegData.length;
    // Lower variance = higher score, but keep in mid range
    let rawScore = 65 - Math.min(Math.max(variance / 7, 0), 25);
    rawScore = Math.max(40, Math.min(65, rawScore));
    // Add a small random offset for realism
    rawScore += (Math.random() - 0.5) * 2.5;
    return Math.round(rawScore * 10) / 10;
  };

  const handleEndSession = () => {
    setRunning(false);
    setScore(calculateScore());
    setShowScore(true);
  };

  const handleRestart = () => {
    setSeconds(0);
    setShowScore(false);
    setScore(null);
    setRunning(true);
  };

  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePauseResume = () => {
    setIsPaused(prev => !prev);
    setRunning(prev => !prev);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>‹</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.contentContainer}>
        <View style={styles.waveWrapper}>
          <EEGGraph data={eegData} />
        </View>
        
        <View style={styles.timeControls}>
          <Text style={styles.timerText}>{formatTime(seconds)}</Text>
          <View style={styles.playbackBar}>
            <View style={[styles.playbackProgress, { width: `${(seconds % 60) * 1.67}%` }]} />
          </View>
        </View>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handlePauseResume} style={styles.actionButton}>
            <Text style={styles.buttonText}>{isPaused ? 'resume' : 'pause'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleRestart} style={styles.actionButton}>
            <Text style={styles.buttonText}>restart</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* End Session Button & Score */}
      {!showScore ? (
        <View style={styles.footer}>
          <TouchableOpacity onPress={handleEndSession} style={styles.endButton}>
            <Text style={styles.endButtonText}>End Session</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreLabel}>Cognitive Score</Text>
          <Text style={styles.scoreValue}>{score}</Text>
          <TouchableOpacity onPress={handleRestart} style={styles.restartButton}>
            <Text style={styles.restartButtonText}>Restart Session</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    width: '100%',
  },
  backButton: {
    paddingVertical: 10,
  },
  backButtonText: {
    color: '#000',
    fontSize: 24,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 20,
  },
  waveWrapper: {
    height: 300,
    width: '100%',
    marginTop: 40,
    overflow: 'hidden',
  },
  timeControls: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 30,
    marginBottom: 40,
  },
  playbackBar: {
    width: '40%',
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    marginTop: 8,
  },
  playbackProgress: {
    height: '100%',
    backgroundColor: '#000',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 20,
  },
  actionButton: {
    backgroundColor: '#000',
    borderRadius: 25,
    paddingHorizontal: 30,
    paddingVertical: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'SpaceMono-Regular',
  },
  timerText: {
    fontSize: 32,
    fontFamily: 'SpaceMono-Regular',
    color: '#000000',
    letterSpacing: 1,
    textAlign: 'center',
    opacity: 0.8,
  },
  footer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
  },
  endButton: {
    backgroundColor: 'rgba(233,79,55,0.85)',
    borderRadius: 24,
    paddingHorizontal: 32,
    paddingVertical: 14,
    shadowColor: '#E94F37',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
  },
  endButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  scoreContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    marginTop: 24,
    backgroundColor: 'rgba(30,30,30,0.95)',
    borderRadius: 32,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
  },
  scoreLabel: {
    color: '#6EC5E9',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
    letterSpacing: 1.2,
  },
  scoreValue: {
    color: '#F7B801',
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 12,
    letterSpacing: 2,
    textShadowColor: 'rgba(0,0,0,0.25)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  restartButton: {
    backgroundColor: 'rgba(110,197,233,0.85)',
    borderRadius: 24,
    paddingHorizontal: 32,
    paddingVertical: 14,
    marginTop: 8,
    shadowColor: '#6EC5E9',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
  },
  restartButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
});
