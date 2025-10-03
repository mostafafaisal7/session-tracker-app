import { useState, useEffect, useCallback } from 'react';
import { StorageService, SessionData } from '@/services/storage';
import { NotificationService } from '@/services/notifications';

export const useSessionTimer = () => {
  const [data, setData] = useState<SessionData | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async () => {
    const sessionData = await StorageService.getData();
    setData(sessionData);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (!data || !data.activeSessionEndTime) {
      setTimeRemaining(0);
      return;
    }

    const updateTimer = () => {
      const now = Date.now();
      const remaining = Math.max(0, data.activeSessionEndTime! - now);
      setTimeRemaining(remaining);

      if (remaining <= 0 && data.activeSessionEndTime) {
        handleSessionEnd();
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [data?.activeSessionEndTime]);

  const handleSessionEnd = async () => {
    const updatedData = await StorageService.endSession();
    setData(updatedData);
    await NotificationService.showImmediateNotification(
      'Session Complete',
      'Your 5-hour session has ended. 1 session deducted.'
    );
  };

  const startSession = async () => {
    if (data && data.usedSessions >= data.totalSessions) {
      return;
    }

    const hasPermission = await NotificationService.requestPermissions();
    const updatedData = await StorageService.startSession();
    setData(updatedData);

    if (hasPermission && updatedData.activeSessionEndTime) {
      await NotificationService.scheduleSessionEndNotification(updatedData.activeSessionEndTime);
    }
  };

  const updateManualInput = async (sessionsUsed: number, daysPassed: number) => {
    const updatedData = await StorageService.updateManualInput(sessionsUsed, daysPassed);
    setData(updatedData);
  };

  const getStats = () => {
    if (!data) {
      return {
        sessionsUsed: 0,
        sessionsLeft: 50,
        daysPassed: 1,
        daysLeft: 30,
        averagePerDay: 0,
        sessionsPerDayLeft: 0,
      };
    }

    const sessionsLeft = data.totalSessions - data.usedSessions;
    const daysLeft = data.daysInMonth - data.daysPassed;
    const averagePerDay = data.daysPassed > 0 ? data.usedSessions / data.daysPassed : 0;
    const sessionsPerDayLeft = daysLeft > 0 ? sessionsLeft / daysLeft : 0;

    return {
      sessionsUsed: data.usedSessions,
      sessionsLeft,
      daysPassed: data.daysPassed,
      daysLeft,
      averagePerDay,
      sessionsPerDayLeft,
    };
  };

  const isSessionActive = data?.activeSessionEndTime !== null;

  return {
    data,
    isLoading,
    timeRemaining,
    isSessionActive,
    startSession,
    updateManualInput,
    getStats,
  };
};
