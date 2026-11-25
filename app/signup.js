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

export default function SignupScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  async function createProfile() {
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName || !cleanEmail) {
      Alert.alert("A little more information", "Please enter your name and email address.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      Alert.alert("Check your email", "Please enter a valid email address.");
      return;
    }

    try {
      await AsyncStorage.setItem(
        "stylemate-profile",
        JSON.stringify({ name: cleanName, email: cleanEmail })
      );
      router.replace("/(tabs)");
    } catch {
      Alert.alert("Couldn't save your profile", "Please try again.");
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.keyboard}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.screen} keyboardShouldPersistTaps="handled">
        <Link href="/welcome" style={styles.back}>‹  Back</Link>
        <Text style={styles.eyebrow}>LET'S MAKE THIS YOUR SPACE</Text>
        <Text style={styles.title}>Create your{"\n"}StyleMate profile.</Text>
        <Text style={styles.description}>
          A few details so we can make your wardrobe feel personal.
        </Text>

        <View style={styles.form}>
          <Text style={styles.label}>YOUR NAME</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="How should we call you?"
            placeholderTextColor="#A99A90"
            autoCapitalize="words"
            style={styles.input}
            returnKeyType="next"
          />

          <Text style={[styles.label, { marginTop: 20 }]}>EMAIL ADDRESS</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            placeholderTextColor="#A99A90"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.input}
            returnKeyType="done"
          />

          <Pressable style={styles.primaryButton} onPress={createProfile}>
            <Text style={styles.primaryText}>Create my profile</Text>
            <Text style={styles.arrow}>→</Text>
          </Pressable>
        </View>

        <View style={styles.bottom}>
          <Text style={styles.bottomText}>Already joined?</Text>
          <Link href="/login" style={styles.link}> Log in</Link>
        </View>
        <Text style={styles.note}>
          This creates a local profile on this device. It does not create an online account.
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
