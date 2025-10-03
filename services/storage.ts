import AsyncStorage from '@react-native-async-storage/async-storage';

export interface SessionData {
  totalSessions: number;
  usedSessions: number;
  currentMonth: number;
  currentYear: number;
  daysInMonth: number;
  daysPassed: number;
  activeSessionStartTime: number | null;
  activeSessionEndTime: number | null;
}

const STORAGE_KEY = '@session_tracker_data';

const getDefaultData = (): SessionData => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysPassed = now.getDate();

  return {
    totalSessions: 50,
    usedSessions: 0,
    currentMonth: month,
    currentYear: year,
    daysInMonth,
    daysPassed,
    activeSessionStartTime: null,
    activeSessionEndTime: null,
  };
};

export const StorageService = {
  async getData(): Promise<SessionData> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        if (parsed.currentMonth !== currentMonth || parsed.currentYear !== currentYear) {
          const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
          return {
            ...getDefaultData(),
            currentMonth,
            currentYear,
            daysInMonth,
            daysPassed: now.getDate(),
          };
        }

        return parsed;
      }
      return getDefaultData();
    } catch (error) {
      console.error('Error reading storage:', error);
      return getDefaultData();
    }
  },

  async saveData(data: SessionData): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving storage:', error);
    }
  },

  async startSession(): Promise<SessionData> {
    const data = await this.getData();
    const now = Date.now();
    const fiveHours = 5 * 60 * 60 * 1000;

    data.activeSessionStartTime = now;
    data.activeSessionEndTime = now + fiveHours;

    await this.saveData(data);
    return data;
  },

  async endSession(): Promise<SessionData> {
    const data = await this.getData();

    data.usedSessions += 1;
    data.activeSessionStartTime = null;
    data.activeSessionEndTime = null;

    await this.saveData(data);
    return data;
  },

  async updateManualInput(sessionsUsed: number, daysPassed: number): Promise<SessionData> {
    const data = await this.getData();

    data.usedSessions = Math.max(0, Math.min(sessionsUsed, data.totalSessions));
    data.daysPassed = Math.max(1, Math.min(daysPassed, data.daysInMonth));

    await this.saveData(data);
    return data;
  },

  async clearData(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  },
};
