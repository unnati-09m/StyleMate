import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { COLORS } from "../constants/theme";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" backgroundColor={COLORS.background} />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}
