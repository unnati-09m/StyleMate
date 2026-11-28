import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { Link, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COLORS, RADIUS, SPACING } from "../constants/theme";

export default function SignupScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);

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
      setBusy(true);
      await AsyncStorage.setItem("stylemate-profile", JSON.stringify({ name: cleanName, email: cleanEmail }));
      router.replace("/(tabs)");
    } catch (error) {
      console.error("Profile save failed:", error);
      Alert.alert("Couldn't save your profile", "Please try again.");
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
          <Text style={styles.artTitle}>Make room{"\n"}for your style.</Text>
          <Text style={styles.artCode}>S / M   —   001</Text>
        </View>
        <View style={styles.heading}>
          <Text style={styles.eyebrow}>LET'S MAKE THIS YOUR SPACE</Text>
          <Text style={styles.title}>Create your{"\n"}StyleMate profile.</Text>
          <Text style={styles.description}>A few details so your wardrobe feels personal.</Text>
        </View>
        <View style={styles.formCard}>
          <Text style={styles.label}>YOUR NAME</Text>
          <TextInput value={name} onChangeText={setName} placeholder="How should we call you?" placeholderTextColor="#9A918B" autoCapitalize="words" style={styles.input} returnKeyType="next" />
          <Text style={[styles.label, styles.emailLabel]}>EMAIL ADDRESS</Text>
          <TextInput value={email} onChangeText={setEmail} placeholder="you@example.com" placeholderTextColor="#9A918B" keyboardType="email-address" autoCapitalize="none" autoCorrect={false} style={styles.input} returnKeyType="done" onSubmitEditing={createProfile} />
          <Pressable style={[styles.primaryButton, busy && styles.disabled]} onPress={createProfile} disabled={busy}>
            <Text style={styles.primaryText}>{busy ? "Creating your profile…" : "Create my profile"}</Text>
            <Text style={styles.arrow}>→</Text>
          </Pressable>
          <View style={styles.bottom}>
            <Text style={styles.bottomText}>Already joined?</Text>
            <Link href="/login" style={styles.link}> Log in</Link>
          </View>
        </View>
        <Text style={styles.note}>This creates a simple local profile on this device. No online account is created.</Text>
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
  formCard: { backgroundColor: "#F7F5F3", borderRadius: 20, padding: 16, marginTop: 22, borderWidth: 1, borderColor: "#EEEAE6" },
  label: { color: COLORS.textMuted, fontSize: 8, fontWeight: "900", letterSpacing: 1.2, marginBottom: 9 },
  emailLabel: { marginTop: 15 },
  input: { height: 51, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, paddingHorizontal: 14, color: COLORS.text, fontSize: 12 },
  primaryButton: { minHeight: 52, backgroundColor: COLORS.text, borderRadius: RADIUS.pill, paddingHorizontal: 17, flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 18 },
  primaryText: { color: "#FFFFFF", fontSize: 11, fontWeight: "900" },
  arrow: { color: "#FFFFFF", fontSize: 20 },
  bottom: { flexDirection: "row", justifyContent: "center", marginTop: 19 },
  bottomText: { color: COLORS.textMuted, fontSize: 10 },
  link: { color: COLORS.text, fontSize: 10, fontWeight: "900" },
  note: { color: COLORS.textMuted, fontSize: 8, lineHeight: 13, textAlign: "center", marginTop: 16, paddingHorizontal: 12 },
  disabled: { opacity: 0.55 },
});
