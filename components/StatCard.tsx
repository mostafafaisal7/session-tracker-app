import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface StatCardProps {
  label: string;
  value: string | number;
  delay?: number;
}

export const StatCard = ({ label, value, delay = 0 }: StatCardProps) => {
  return (
    <Animated.View
      entering={FadeInDown.delay(delay).springify()}
      style={styles.container}
    >
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
    flex: 1,
    margin: 6,
  },
  value: {
    fontSize: 32,
    fontWeight: '700',
    color: '#000',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});
