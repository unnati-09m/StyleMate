import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { Link, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COLORS, RADIUS, SPACING } from "../constants/theme";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);

  async function login() {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      Alert.alert("Enter your email", "Please enter the email saved with your StyleMate profile.");
      return;
    }
    try {
      setBusy(true);
      const savedProfile = await AsyncStorage.getItem("stylemate-profile");
      const profile = savedProfile ? JSON.parse(savedProfile) : null;
      if (!profile || profile.email !== cleanEmail) {
        Alert.alert("Profile not found", "Create a profile on this device first.");
        return;
      }
      router.replace("/(tabs)");
    } catch (error) {
      console.error("Profile login failed:", error);
      Alert.alert("Couldn't open your profile", "Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <KeyboardAvoidingView style={styles.keyboard} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={styles.screen} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <Link href="/welcome" style={styles.back}>←  BACK</Link>
        <View style={styles.artCard}>
          <View style={styles.artCircle} />
          <Text style={styles.artKicker}>STYLEMATE  /  YOUR STYLE SPACE</Text>
          <Text style={styles.artTitle}>Good style.{"\n"}Good to see you.</Text>
          <Text style={styles.artCode}>S / M   —   002</Text>
        </View>
        <View style={styles.heading}>
          <Text style={styles.eyebrow}>WELCOME BACK</Text>
          <Text style={styles.title}>Pick up where{"\n"}you left off.</Text>
          <Text style={styles.description}>Open the local profile saved on this device.</Text>
        </View>
        <View style={styles.formCard}>
          <Text style={styles.label}>EMAIL ADDRESS</Text>
          <TextInput value={email} onChangeText={setEmail} placeholder="you@example.com" placeholderTextColor="#9A918B" keyboardType="email-address" autoCapitalize="none" autoCorrect={false} style={styles.input} returnKeyType="done" onSubmitEditing={login} />
          <Pressable style={[styles.primaryButton, busy && styles.disabled]} onPress={login} disabled={busy}>
            <Text style={styles.primaryText}>{busy ? "Opening your profile…" : "Continue to StyleMate"}</Text>
            <Text style={styles.arrow}>→</Text>
          </Pressable>
          <View style={styles.bottom}>
            <Text style={styles.bottomText}>New to StyleMate?</Text>
            <Link href="/signup" style={styles.link}> Create a profile</Link>
          </View>
        </View>
        <Text style={styles.note}>Your profile is stored locally on this device. This is not an online account.</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboard: { flex: 1, backgroundColor: COLORS.background },
  screen: { flexGrow: 1, paddingHorizontal: SPACING.lg, paddingTop: 22, paddingBottom: 28 },
  back: { color: COLORS.textMuted, fontSize: 8, fontWeight: "900", letterSpacing: 1.1, marginBottom: 17 },
  artCard: { minHeight: 190, backgroundColor: "#E9E2DC", borderRadius: 21, padding: 19, justifyContent: "flex-end", overflow: "hidden" },
  artCircle: { position: "absolute", width: 160, height: 160, borderRadius: 80, backgroundColor: "#D8CABE", right: -24, top: -35 },
  artKicker: { color: "#756457", fontSize: 8, fontWeight: "900", letterSpacing: 1.4 },
  artTitle: { color: COLORS.text, fontSize: 31, lineHeight: 33, fontWeight: "900", letterSpacing: -0.9, marginTop: 12 },
  artCode: { color: "#756457", fontSize: 8, fontWeight: "900", letterSpacing: 1.2, marginTop: 10 },
  heading: { marginTop: 27 },
  eyebrow: { color: "#9A7864", fontSize: 8, fontWeight: "900", letterSpacing: 1.4 },
  title: { color: COLORS.text, fontSize: 31, lineHeight: 35, fontWeight: "900", letterSpacing: -1, marginTop: 8 },
  description: { color: COLORS.textMuted, fontSize: 11, lineHeight: 17, marginTop: 8 },
  formCard: { backgroundColor: "#F7F5F3", borderRadius: 20, padding: 16, marginTop: 23, borderWidth: 1, borderColor: "#EEEAE6" },
  label: { color: COLORS.textMuted, fontSize: 8, fontWeight: "900", letterSpacing: 1.2, marginBottom: 9 },
  input: { height: 51, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, paddingHorizontal: 14, color: COLORS.text, fontSize: 12 },
  primaryButton: { minHeight: 52, backgroundColor: COLORS.text, borderRadius: RADIUS.pill, paddingHorizontal: 17, flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 15 },
  primaryText: { color: "#FFFFFF", fontSize: 11, fontWeight: "900" },
  arrow: { color: "#FFFFFF", fontSize: 20 },
  bottom: { flexDirection: "row", justifyContent: "center", marginTop: 19 },
  bottomText: { color: COLORS.textMuted, fontSize: 10 },
  link: { color: COLORS.text, fontSize: 10, fontWeight: "900" },
  note: { color: COLORS.textMuted, fontSize: 8, lineHeight: 13, textAlign: "center", marginTop: 16, paddingHorizontal: 12 },
  disabled: { opacity: 0.55 },
});
