import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { Redirect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COLORS } from "../constants/theme";

export default function Index() {
  const [destination, setDestination] = useState(null);

  useEffect(() => {
    async function checkProfile() {
      try {
        const savedProfile = await AsyncStorage.getItem("stylemate-profile");
        setDestination(savedProfile ? "/(tabs)" : "/welcome");
      } catch {
        setDestination("/welcome");
      }
    }

    checkProfile();
  }, []);

  if (!destination) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.background, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator color={COLORS.accent} />
      </View>
    );
  }

  return <Redirect href={destination} />;
}
