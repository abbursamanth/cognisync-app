import { View, Text, StyleSheet, Dimensions, Platform, TouchableOpacity } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { router } from 'expo-router';

// LiquidGlass Button Component
interface LiquidGlassButtonProps {
  title: string;
  onPress: () => void;
  style?: any;
  textStyle?: any;
}

const LiquidGlassButton: React.FC<LiquidGlassButtonProps> = ({ title, onPress, style, textStyle }) => {
  return (
    <TouchableOpacity 
      onPress={onPress}
      style={[{
        backgroundColor: '#FFD600',
        borderRadius: 12,
        overflow: 'hidden',
        position: 'relative',
      }, style]}
    >
      <View style={{
        position: 'absolute',
        top: -5,
        right: -5,
        width: 20,
        height: 20,
        backgroundColor: '#222',
        borderRadius: 4,
        transform: [{ rotate: '45deg' }],
      }} />
      <View style={{
        position: 'absolute',
        bottom: -8,
        left: 20,
        width: 16,
        height: 16,
        backgroundColor: '#222',
        borderRadius: 8,
      }} />
      <Text style={[{
        color: '#222',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '600',
        padding: 15,
        letterSpacing: 1,
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
      }, textStyle]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default function Dashboard() {

  const handleStartSession = () => {
    router.push('/startSession');
  };

  return (
    <View style={styles.container}>
      {/* Video Background Section - 90% of screen height */}
      <View style={styles.videoSection}> 
        <Video
          source={require('../../assets/videos/brainwave-loop.mp4')}
          style={styles.videoBackground}
          resizeMode={ResizeMode.COVER}
          shouldPlay
          isLooping
          isMuted
        />
        <View style={styles.overlay}>
          <View style={styles.textSection}>
            <Text style={styles.heading}>REWIRING{'\n'}REALITY</Text>
            <View style={styles.buttonWrapper}>
              <TouchableOpacity 
                onPress={handleStartSession}
                style={styles.liquidButton}
              >
                <Text style={styles.liquidButtonText}>BE THE FUTURE.</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* BCI Awareness Quote Section */}
      <View style={styles.quoteSection}>
        <Text style={styles.bciQuote}>
          "The future of human potential lies in the seamless connection between mind and machine."
        </Text>
      </View>

      {/* Session Report Section */}
      <View style={styles.reportSection}>
        <Text style={styles.reportTitleCentered}>Latest Brain Health Report</Text>
        
        <Text style={styles.noSessionsText}>No previous sessions found.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  videoSection: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  videoBackground: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  textSection: {
    position: 'absolute',
    top: 50,
    left: 20,
  },
  heading: {
    fontSize: 24,
    color: '#fff',
    textAlign: 'left',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  buttonWrapper: {
    marginTop: 12,
  },
  liquidButton: {
    width: 120,
    height: 40,
    backgroundColor: '#000',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  liquidButtonText: {
    color: '#fff',
    fontSize: 11,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  quoteSection: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 550,
    marginBottom: 16,
  },
  reportSection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  reportTitleCentered: {
    color: '#fff',
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    textTransform: 'uppercase',
    marginBottom: 8,
    opacity: 0.9,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  bciQuote: {
    color: '#fff',
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    textAlign: 'center',
    marginBottom: 12,
    opacity: 0.7,
    fontStyle: 'italic',
  },
  noSessionsText: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 10,
    borderRadius: 4,
    opacity: 0.7,
  },
  sessionCard: {
    marginBottom: 6,
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 4,
  },
  sessionTitle: {
    color: '#fff',
    fontSize: 28,
    marginBottom: 20,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    opacity: 0.9,
  },
  sessionDetail: {
    color: '#fff',
    fontSize: 11,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    marginTop: 3,
    opacity: 0.7,
  },
  sessionDate: {
    color: '#fff',
    fontSize: 10,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    marginTop: 3,
    opacity: 0.5,
  },
});
