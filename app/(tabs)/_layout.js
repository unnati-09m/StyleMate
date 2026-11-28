import { Tabs } from "expo-router";
import { Text } from "react-native";
import { COLORS } from "../../constants/theme";

function TabIcon({ symbol, focused }) {
  return (
    <Text style={{ color: focused ? COLORS.text : "#9A9A9A", fontSize: 20, fontWeight: focused ? "900" : "500" }}>
      {symbol}
    </Text>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.text,
        tabBarInactiveTintColor: "#999999",
        tabBarStyle: {
          height: 78,
          paddingTop: 8,
          paddingBottom: 12,
          backgroundColor: "#FFFFFF",
          borderTopColor: "#EAEAEA",
          borderTopWidth: 1,
          elevation: 0,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "700",
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Home", tabBarLabel: "Home", tabBarIcon: ({ focused }) => <TabIcon symbol="⌂" focused={focused} /> }} />
      <Tabs.Screen name="wardrobe" options={{ title: "Wardrobe", tabBarLabel: "Wardrobe", tabBarIcon: ({ focused }) => <TabIcon symbol="▤" focused={focused} /> }} />
      <Tabs.Screen name="favourites" options={{ title: "Saved", tabBarLabel: "Saved", tabBarIcon: ({ focused }) => <TabIcon symbol="♡" focused={focused} /> }} />
      <Tabs.Screen name="history" options={{ title: "History", tabBarLabel: "History", tabBarIcon: ({ focused }) => <TabIcon symbol="◷" focused={focused} /> }} />
    </Tabs>
  );
}
