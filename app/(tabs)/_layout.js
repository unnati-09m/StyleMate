import { Tabs } from "expo-router";
import { COLORS } from "../../constants/theme";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.accent,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarStyle: {
          height: 70,
          paddingTop: 9,
          paddingBottom: 9,
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.border,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: "Home", tabBarLabel: "Home" }}
      />
      <Tabs.Screen
        name="wardrobe"
        options={{ title: "Wardrobe", tabBarLabel: "Wardrobe" }}
      />
      <Tabs.Screen
        name="favourites"
        options={{ title: "Favourites", tabBarLabel: "Saved" }}
      />
      <Tabs.Screen
        name="history"
        options={{ title: "History", tabBarLabel: "History" }}
      />
    </Tabs>
  );
}
