import { useState } from "react";
import {
  Alert,
  ImageBackground,
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

const SIGNUP_IMAGE = "https://images.pexels.com/photos/37704838/pexels-photo-37704838.jpeg?auto=compress&cs=tinysrgb&w=900";

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
      await AsyncStorage.setItem("stylemate-profile", JSON.stringify({ name: cleanName, email: cleanEmail }));
      router.replace("/(tabs)");
    } catch (error) {
      console.error("Profile save failed:", error);
      Alert.alert("Couldn't save your profile", error?.message || "Please try again.");
    }
  }

  return (
    <KeyboardAvoidingView style={styles.keyboard} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={styles.screen} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <Link href="/welcome" style={styles.back}>‹  BACK</Link>
        <ImageBackground source={{ uri: SIGNUP_IMAGE }} style={styles.banner} imageStyle={styles.bannerImage}>
          <View style={styles.bannerShade} />
          <View style={styles.bannerCopy}>
            <Text style={styles.bannerEyebrow}>STYLEMATE / YOUR STYLE SPACE</Text>
            <Text style={styles.bannerTitle}>Make room{"\n"}for your style.</Text>
          </View>
        </ImageBackground>

        <View style={styles.heading}>
          <Text style={styles.eyebrow}>LET'S MAKE THIS YOUR SPACE</Text>
          <Text style={styles.title}>Create your{"\n"}StyleMate profile.</Text>
          <Text style={styles.description}>A few details so we can make your wardrobe feel personal.</Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.label}>YOUR NAME</Text>
          <TextInput value={name} onChangeText={setName} placeholder="How should we call you?" placeholderTextColor="#9A918B" autoCapitalize="words" style={styles.input} returnKeyType="next" />
          <Text style={[styles.label, { marginTop: 17 }]}>EMAIL ADDRESS</Text>
          <TextInput value={email} onChangeText={setEmail} placeholder="you@example.com" placeholderTextColor="#9A918B" keyboardType="email-address" autoCapitalize="none" autoCorrect={false} style={styles.input} returnKeyType="done" onSubmitEditing={createProfile} />
          <Pressable style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]} onPress={createProfile}>
            <Text style={styles.primaryText}>Create my profile</Text>
            <Text style={styles.arrow}>→</Text>
          </Pressable>
          <View style={styles.bottom}>
            <Text style={styles.bottomText}>Already joined?</Text>
            <Link href="/login" style={styles.link}> Log in</Link>
          </View>
        </View>
        <Text style={styles.note}>This creates a local profile on this device. It does not create an online account.</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboard: { flex: 1, backgroundColor: COLORS.background },
  screen: { flexGrow: 1, paddingHorizontal: SPACING.lg, paddingTop: 22, paddingBottom: 28 },
  back: { color: COLORS.textMuted, fontSize: 9, fontWeight: "900", letterSpacing: 1.2, marginBottom: 17 },
  banner: { height: 190, justifyContent: "flex-end", overflow: "hidden", backgroundColor: "#D8CBC0" },
  bannerImage: { borderRadius: 21 },
  bannerShade: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.28)" },
  bannerCopy: { padding: 18 },
  bannerEyebrow: { color: "#FFFFFF", fontSize: 8, fontWeight: "900", letterSpacing: 1.5 },
  bannerTitle: { color: "#FFFFFF", fontSize: 29, lineHeight: 31, fontWeight: "900", letterSpacing: -0.8, marginTop: 8 },
  heading: { marginTop: 27 },
  eyebrow: { color: "#A47E69", fontSize: 9, fontWeight: "900", letterSpacing: 1.5 },
  title: { color: COLORS.text, fontSize: 32, lineHeight: 36, fontWeight: "900", letterSpacing: -1.1, marginTop: 8 },
  description: { color: COLORS.textMuted, fontSize: 13, lineHeight: 19, marginTop: 9 },
  formCard: { backgroundColor: "#F8F6F4", borderRadius: 21, padding: 17, marginTop: 24, borderWidth: 1, borderColor: "#EEEAE6" },
  label: { color: COLORS.textMuted, fontSize: 9, fontWeight: "900", letterSpacing: 1.2, marginBottom: 9 },
  input: { height: 53, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: COLORS.border, borderRadius: 13, paddingHorizontal: 15, color: COLORS.text, fontSize: 13 },
  primaryButton: { minHeight: 54, backgroundColor: COLORS.text, borderRadius: RADIUS.pill, paddingHorizontal: 18, flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 19 },
  primaryText: { color: "#FFFFFF", fontSize: 13, fontWeight: "800" },
  arrow: { color: "#FFFFFF", fontSize: 21 },
  bottom: { flexDirection: "row", justifyContent: "center", marginTop: 21 },
  bottomText: { color: COLORS.textMuted, fontSize: 11 },
  link: { color: COLORS.text, fontSize: 11, fontWeight: "900" },
  note: { color: COLORS.textMuted, fontSize: 9, lineHeight: 14, textAlign: "center", marginTop: 18, paddingHorizontal: 12 },
  pressed: { opacity: 0.78 },
});
