import { useEffect } from "react";
import { AppState } from "react-native";
import { Stack, router, usePathname } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as Notifications from "expo-notifications";
import { COLORS } from "../constants/theme";

let activePath = "";
let lastHandledNotificationId = null;

Notifications.setNotificationHandler({
  handleNotification: async (notification) => {
    const targetPath = notification.request.content.data?.path;
    const alreadyViewing =
      typeof targetPath === "string" &&
      activePath === targetPath &&
      AppState.currentState === "active";

    return {
      shouldShowBanner: !alreadyViewing,
      shouldShowList: !alreadyViewing,
      shouldPlaySound: false,
      shouldSetBadge: false,
    };
  },
});

function openNotification(response) {
  const request = response?.notification?.request;
  const targetPath = request?.content?.data?.path;
  const notificationId = request?.identifier;

  if (
    typeof targetPath === "string" &&
    targetPath.startsWith("/") &&
    targetPath !== activePath &&
    notificationId !== lastHandledNotificationId
  ) {
    lastHandledNotificationId = notificationId || targetPath;
    router.push(targetPath);
  }

  Notifications.clearLastNotificationResponseAsync().catch((error) => {
    console.warn("Could not clear the handled notification:", error);
  });
}

export default function RootLayout() {
  const pathname = usePathname();

  useEffect(() => {
    activePath = pathname;
  }, [pathname]);

  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(openNotification);

    async function checkLaunchNotification() {
      try {
        const response = await Notifications.getLastNotificationResponseAsync();
        if (response) openNotification(response);
      } catch (error) {
        console.warn("Could not open the notification destination:", error);
      }
    }

    checkLaunchNotification();

    return () => subscription.remove();
  }, []);

  return (
    <>
      <StatusBar style="dark" backgroundColor={COLORS.background} />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: COLORS.background } }} />
    </>
  );
}
