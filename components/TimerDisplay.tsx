import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  useSharedValue,
} from 'react-native-reanimated';

interface TimerDisplayProps {
  timeRemaining: number;
  isActive: boolean;
}

export const TimerDisplay = ({ timeRemaining, isActive }: TimerDisplayProps) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (isActive) {
      scale.value = withRepeat(
        withSequence(
          withTiming(1.02, { duration: 1000 }),
          withTiming(1, { duration: 1000 })
        ),
        -1,
        false
      );
    } else {
      scale.value = withTiming(1);
    }
  }, [isActive]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!isActive) {
    return null;
  }

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Text style={styles.label}>Time Remaining</Text>
      <Text style={styles.timer}>{formatTime(timeRemaining)}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    marginVertical: 24,
  },
  label: {
    fontSize: 16,
    color: '#999',
    marginBottom: 12,
  },
  timer: {
    fontSize: 48,
    fontWeight: '700',
    color: '#fff',
    fontVariant: ['tabular-nums'],
  },
});
