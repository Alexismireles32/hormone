// Notification Service
// Following .cursorrules: Smart nudges, variable rewards, daily habit creation

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export interface NotificationPermissionStatus {
  granted: boolean;
  canAskAgain: boolean;
}

export async function requestNotificationPermissions(): Promise<NotificationPermissionStatus> {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#2563EB',
      });
    }

    return {
      granted: finalStatus === 'granted',
      canAskAgain: existingStatus === 'undetermined',
    };
  } catch (error) {
    console.error('Error requesting notification permissions:', error);
    return {
      granted: false,
      canAskAgain: false,
    };
  }
}

export async function scheduleDailyReminder(hour: number, minute: number): Promise<string | null> {
  try {
    const trigger: Notifications.DailyTriggerInput = {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    };

    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Time for Your Daily Check-In 🌅',
        body: 'Log your hormone test to see today\'s ReadyScore',
        data: { type: 'daily_reminder' },
      },
      trigger,
    });

    return id;
  } catch (error) {
    console.error('Error scheduling daily reminder:', error);
    return null;
  }
}

export async function schedulePatternDiscoveryNotification(): Promise<string | null> {
  try {
    // Variable reward - schedule randomly between 1-3 days
    const daysUntil = Math.floor(Math.random() * 3) + 1;
    const trigger: Notifications.NotificationTriggerInput = {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: daysUntil * 24 * 60 * 60,
      repeats: false,
    };

    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'New Insight Discovered 💡',
        body: 'We found an interesting pattern in your data',
        data: { type: 'pattern_discovery' },
      },
      trigger,
    });

    return id;
  } catch (error) {
    console.error('Error scheduling pattern notification:', error);
    return null;
  }
}

export async function scheduleMilestoneNotification(
  title: string,
  body: string,
  delaySeconds: number = 0
): Promise<string | null> {
  try {
    const trigger: Notifications.NotificationTriggerInput | null = delaySeconds > 0 
      ? {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: delaySeconds,
          repeats: false,
        }
      : null;

    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: { type: 'milestone' },
      },
      trigger,
    });

    return id;
  } catch (error) {
    console.error('Error scheduling milestone notification:', error);
    return null;
  }
}

export async function scheduleSmartNudge(message: string, daysUntilNotTest: number): Promise<string | null> {
  try {
    const trigger: Notifications.NotificationTriggerInput = {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: daysUntilNotTest * 24 * 60 * 60,
      repeats: false,
    };

    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'We Miss You 👋',
        body: message,
        data: { type: 'nudge' },
      },
      trigger,
    });

    return id;
  } catch (error) {
    console.error('Error scheduling nudge:', error);
    return null;
  }
}

export async function cancelNotification(notificationId: string): Promise<void> {
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch (error) {
    console.error('Error canceling notification:', error);
  }
}

export async function cancelAllNotifications(): Promise<void> {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (error) {
    console.error('Error canceling all notifications:', error);
  }
}

export async function getPendingNotifications() {
  try {
    return await Notifications.getAllScheduledNotificationsAsync();
  } catch (error) {
    console.error('Error getting pending notifications:', error);
    return [];
  }
}

// Notification for BioAge improvement
export async function notifyBioAgeImprovement(newAge: number, improvement: number): Promise<void> {
  await scheduleMilestoneNotification(
    `Your BioAge Dropped to ${newAge}! 🎉`,
    `You're aging backwards by ${improvement} years! Keep it up!`
  );
}

// Notification for streak milestone
export async function notifyStreakMilestone(days: number): Promise<void> {
  const emoji = days >= 30 ? '💪' : days >= 7 ? '🔥' : '⚡';
  await scheduleMilestoneNotification(
    `${days}-Day Streak ${emoji}`,
    `You're building amazing consistency! Keep testing daily.`
  );
}

// Notification for ReadyScore milestone
export async function notifyReadyScoreMilestone(score: number): Promise<void> {
  if (score >= 90) {
    await scheduleMilestoneNotification(
      'Peak Performance! 🚀',
      `Your ReadyScore hit ${score}! You're optimized and ready for anything.`
    );
  }
}

