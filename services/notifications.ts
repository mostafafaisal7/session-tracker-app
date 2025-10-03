import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const NotificationService = {
  async requestPermissions(): Promise<boolean> {
    if (Platform.OS === 'web') {
      return false;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    return finalStatus === 'granted';
  },

  async scheduleSessionEndNotification(sessionEndTime: number): Promise<void> {
    if (Platform.OS === 'web') {
      return;
    }

    await this.cancelAllNotifications();

    const tenMinutesBeforeEnd = sessionEndTime - 10 * 60 * 1000;
    const now = Date.now();

    if (tenMinutesBeforeEnd > now) {
      const secondsUntilWarning = Math.floor((tenMinutesBeforeEnd - now) / 1000);
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Session Ending Soon',
          body: '10 minutes remaining in your current session',
          sound: true,
        },
        trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: secondsUntilWarning, repeats: false },
      });
    }

    const secondsUntilEnd = Math.floor((sessionEndTime - now) / 1000);
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Session Complete',
        body: 'Your 5-hour session has ended',
        sound: true,
      },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: secondsUntilEnd, repeats: false },
    });
  },

  async cancelAllNotifications(): Promise<void> {
    if (Platform.OS === 'web') {
      return;
    }

    await Notifications.cancelAllScheduledNotificationsAsync();
  },

  async showImmediateNotification(title: string, body: string): Promise<void> {
    if (Platform.OS === 'web') {
      return;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: true,
      },
      trigger: null,
    });
  },
};
