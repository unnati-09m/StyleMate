import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import * as Notifications from "expo-notifications";

const REMINDER_KEY = "stylemate-daily-reminder-id";

function hasNotificationPermission(permission) {
  return (
    permission.granted ||
    permission.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL
  );
}

export async function isDailyReminderEnabled() {
  try {
    const savedId = await AsyncStorage.getItem(REMINDER_KEY);
    if (!savedId) return false;

    const permission = await Notifications.getPermissionsAsync();
    if (!hasNotificationPermission(permission)) return false;

    const pending = await Notifications.getAllScheduledNotificationsAsync();
    return pending.some((notification) => notification.identifier === savedId);
  } catch (error) {
    console.warn("Could not check reminder status:", error);
    return false;
  }
}

export async function enableDailyReminder() {
  try {
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("outfit-reminders", {
        name: "Outfit reminders",
        importance: Notifications.AndroidImportance.DEFAULT,
      });
    }

    const currentPermission = await Notifications.getPermissionsAsync();
    let finalPermission = currentPermission;

    if (!hasNotificationPermission(currentPermission)) {
      finalPermission = await Notifications.requestPermissionsAsync();
    }

    if (!hasNotificationPermission(finalPermission)) {
      return { granted: false };
    }

    const oldId = await AsyncStorage.getItem(REMINDER_KEY);
    if (oldId) {
      const pending = await Notifications.getAllScheduledNotificationsAsync();
      const stillScheduled = pending.some((notification) => notification.identifier === oldId);
      if (stillScheduled) {
        return { granted: true, alreadyEnabled: true };
      }
    }

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: "A little StyleMate reminder",
        body: "Plan a look you will love for tomorrow.",
        data: { path: "/outfit-studio" },
        sound: false,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: 20,
        minute: 0,
        channelId: "outfit-reminders",
      },
    });

    await AsyncStorage.setItem(REMINDER_KEY, notificationId);
    return { granted: true, alreadyEnabled: false };
  } catch (error) {
    console.error("Could not schedule the outfit reminder:", error);
    throw error;
  }
}

export async function disableDailyReminder() {
  try {
    const savedId = await AsyncStorage.getItem(REMINDER_KEY);
    if (savedId) {
      await Notifications.cancelScheduledNotificationAsync(savedId);
    }
    await AsyncStorage.removeItem(REMINDER_KEY);
  } catch (error) {
    console.warn("Could not turn off the outfit reminder:", error);
    throw error;
  }
}
