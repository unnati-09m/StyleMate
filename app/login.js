import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Link, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COLORS, RADIUS, SPACING } from "../constants/theme";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  async function login() {
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      Alert.alert("Enter your email", "Please enter the email used for your StyleMate profile.");
      return;
    }

    try {
      const savedProfile = await AsyncStorage.getItem("stylemate-profile");
      const profile = savedProfile ? JSON.parse(savedProfile) : null;

      if (!profile || profile.email !== cleanEmail) {
        Alert.alert("Profile not found", "Create a profile on this device first.");
        return;
      }

      router.replace("/(tabs)");
    } catch {
      Alert.alert("Couldn't open your profile", "Please try again.");
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.keyboard}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.screen} keyboardShouldPersistTaps="handled">
        <Link href="/welcome" style={styles.back}>‹  Back</Link>
        <Text style={styles.eyebrow}>WELCOME BACK</Text>
        <Text style={styles.title}>Good to see{"\n"}you again.</Text>
        <Text style={styles.description}>
          Enter the email linked to the profile saved on this device.
        </Text>

        <View style={styles.form}>
          <Text style={styles.label}>EMAIL ADDRESS</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            placeholderTextColor="#A99A90"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.input}
          />
          <Pressable style={styles.primaryButton} onPress={login}>
            <Text style={styles.primaryText}>Continue to StyleMate</Text>
            <Text style={styles.arrow}>→</Text>
          </Pressable>
        </View>

        <View style={styles.bottom}>
          <Text style={styles.bottomText}>New to StyleMate?</Text>
          <Link href="/signup" style={styles.link}> Create a profile</Link>
        </View>
        <Text style={styles.note}>
          Local profile access only. Your profile is stored on this device.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboard: { flex: 1, backgroundColor: COLORS.background },
  screen: { flexGrow: 1, padding: SPACING.lg, paddingTop: 28, paddingBottom: 24 },
  back: { color: COLORS.textMuted, fontSize: 14, marginBottom: 44 },
  eyebrow: { color: COLORS.accent, fontSize: 9, fontWeight: "800", letterSpacing: 1.5 },
  title: {
    color: COLORS.text,
    fontSize: 35,
    lineHeight: 41,
    fontWeight: "800",
    letterSpacing: -1,
    marginTop: 10,
  },
  description: { color: COLORS.textMuted, fontSize: 13, lineHeight: 20, marginTop: 12 },
  form: { marginTop: 38 },
  label: { color: COLORS.textMuted, fontSize: 9, fontWeight: "800", letterSpacing: 1.2, marginBottom: 9 },
  input: {
    height: 54,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    color: COLORS.text,
    fontSize: 13,
  },
  primaryButton: {
    minHeight: 54,
    backgroundColor: COLORS.text,
    borderRadius: RADIUS.pill,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 30,
  },
  primaryText: { color: "#FFFFFF", fontSize: 14, fontWeight: "700" },
  arrow: { color: "#FFFFFF", fontSize: 20 },
  bottom: { flexDirection: "row", justifyContent: "center", marginTop: 28 },
  bottomText: { color: COLORS.textMuted, fontSize: 12 },
  link: { color: COLORS.accent, fontSize: 12, fontWeight: "800" },
  note: { color: COLORS.textMuted, fontSize: 10, textAlign: "center", lineHeight: 15, marginTop: 24 },
});
