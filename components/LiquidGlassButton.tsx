import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Platform } from 'react-native';

interface LiquidGlassButtonProps {
  title: string;
  onPress: () => void;
  style?: any;
  textStyle?: any;
  disabled?: boolean;
}

export const LiquidGlassButton: React.FC<LiquidGlassButtonProps> = ({
  title,
  onPress,
  style,
  textStyle,
  disabled = false,
}) => {
  // Only apply the effect on iOS
  const isIOS = Platform.OS === 'ios';
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, isIOS && styles.liquidGlass, style]}
      disabled={disabled}
      activeOpacity={0.8}
    >
      {/* Remove any text background, make font directly on glass */}
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.08)', // ultra translucent
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  text: {
    fontSize: 18,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.85)', // premium white
    letterSpacing: 1.2,
    textShadowColor: 'rgba(0,0,0,0.25)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  liquidGlass: {
    backgroundColor: 'rgba(255,255,255,0.08)', // even more translucent
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.25)',
    overflow: 'hidden',
    ...(Platform.OS === 'ios' ? { backdropFilter: 'blur(18px)' } : {}),
  },
  // Remove liquidGlassInner, no background for text
});
