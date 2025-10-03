import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, StatusBar } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Clock, TrendingUp, Calendar, Target } from 'lucide-react-native';
import { useSessionTimer } from '@/hooks/useSessionTimer';
import { AnimatedButton } from '@/components/AnimatedButton';
import { StatCard } from '@/components/StatCard';
import { TimerDisplay } from '@/components/TimerDisplay';
import { ManualInputModal } from '@/components/ManualInputModal';

export default function HomeScreen() {
  const {
    data,
    isLoading,
    timeRemaining,
    isSessionActive,
    startSession,
    updateManualInput,
    getStats,
  } = useSessionTimer();

  const [modalVisible, setModalVisible] = useState(false);
  const stats = getStats();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const handleStartSession = async () => {
    if (stats.sessionsLeft <= 0) {
      return;
    }
    await startSession();
  };

  const handleManualSubmit = async (sessionsUsed: number, daysPassed: number) => {
    await updateManualInput(sessionsUsed, daysPassed);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeIn.duration(800)} style={styles.header}>
          <Clock color="#000" size={32} />
          <Text style={styles.title}>Session Tracker</Text>
          <Text style={styles.subtitle}>Track your Claude Max sessions</Text>
        </Animated.View>

        <TimerDisplay timeRemaining={timeRemaining} isActive={isSessionActive} />

        <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.mainCard}>
          <View style={styles.sessionInfo}>
            <Text style={styles.sessionLabel}>Sessions</Text>
            <Text style={styles.sessionCount}>
              {stats.sessionsUsed} / 50
            </Text>
            <Text style={styles.sessionRemaining}>
              {stats.sessionsLeft} remaining
            </Text>
          </View>
        </Animated.View>

        <View style={styles.statsGrid}>
          <StatCard
            label="Days Passed"
            value={`${stats.daysPassed} / ${stats.daysPassed + stats.daysLeft}`}
            delay={300}
          />
          <StatCard
            label="Days Left"
            value={stats.daysLeft}
            delay={350}
          />
        </View>

        <View style={styles.statsGrid}>
          <StatCard
            label="Avg Used/Day"
            value={stats.averagePerDay.toFixed(1)}
            delay={400}
          />
          <StatCard
            label="Sessions/Day Left"
            value={stats.sessionsPerDayLeft.toFixed(1)}
            delay={450}
          />
        </View>

        <Animated.View
          entering={FadeInDown.delay(500).springify()}
          style={styles.buttonContainer}
        >
          <AnimatedButton
            title={isSessionActive ? 'Session Running...' : 'Start Session'}
            onPress={handleStartSession}
            disabled={isSessionActive || stats.sessionsLeft <= 0}
          />
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(550).springify()}
          style={styles.buttonContainer}
        >
          <AnimatedButton
            title="Manual Input"
            onPress={() => setModalVisible(true)}
            variant="secondary"
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(600).springify()} style={styles.footer}>
          <Text style={styles.footerText}>
            Each session = 5 hours
          </Text>
          <Text style={styles.footerSubtext}>
            No pause or cancel once started
          </Text>
        </Animated.View>
      </ScrollView>

      <ManualInputModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleManualSubmit}
        currentSessionsUsed={stats.sessionsUsed}
        currentDaysPassed={stats.daysPassed}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#000',
    marginTop: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  mainCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    padding: 32,
    marginBottom: 20,
  },
  sessionInfo: {
    alignItems: 'center',
  },
  sessionLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  sessionCount: {
    fontSize: 48,
    fontWeight: '700',
    color: '#000',
    marginBottom: 8,
  },
  sessionRemaining: {
    fontSize: 18,
    color: '#000',
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    marginHorizontal: -6,
    marginBottom: 8,
  },
  buttonContainer: {
    marginVertical: 8,
  },
  footer: {
    alignItems: 'center',
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  footerText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 14,
    color: '#999',
  },
});
