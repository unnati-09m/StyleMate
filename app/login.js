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

const LOGIN_IMAGE = "https://images.pexels.com/photos/7383102/pexels-photo-7383102.jpeg?auto=compress&cs=tinysrgb&w=900";

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
    } catch (error) {
      console.error("Profile login failed:", error);
      Alert.alert("Couldn't open your profile", error?.message || "Please try again.");
    }
  }

  return (
    <KeyboardAvoidingView style={styles.keyboard} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={styles.screen} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <Link href="/welcome" style={styles.back}>‹  BACK</Link>
        <ImageBackground source={{ uri: LOGIN_IMAGE }} style={styles.banner} imageStyle={styles.bannerImage}>
          <View style={styles.bannerShade} />
          <View style={styles.bannerCopy}>
            <Text style={styles.bannerEyebrow}>STYLEMATE / YOUR STYLE SPACE</Text>
            <Text style={styles.bannerTitle}>Good style.{"\n"}Good to see you.</Text>
          </View>
        </ImageBackground>

        <View style={styles.heading}>
          <Text style={styles.eyebrow}>WELCOME BACK</Text>
          <Text style={styles.title}>Pick up where{"\n"}you left off.</Text>
          <Text style={styles.description}>Sign in to the local profile saved on this device.</Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.label}>EMAIL ADDRESS</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            placeholderTextColor="#9A918B"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.input}
            returnKeyType="done"
            onSubmitEditing={login}
          />
          <Pressable style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]} onPress={login}>
            <Text style={styles.primaryText}>Continue to StyleMate</Text>
            <Text style={styles.arrow}>→</Text>
          </Pressable>
          <View style={styles.bottom}>
            <Text style={styles.bottomText}>New to StyleMate?</Text>
            <Link href="/signup" style={styles.link}> Create a profile</Link>
          </View>
        </View>
        <Text style={styles.note}>Your profile is stored locally on this device. No online account is created.</Text>
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
  primaryButton: { minHeight: 54, backgroundColor: COLORS.text, borderRadius: RADIUS.pill, paddingHorizontal: 18, flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 17 },
  primaryText: { color: "#FFFFFF", fontSize: 13, fontWeight: "800" },
  arrow: { color: "#FFFFFF", fontSize: 21 },
  bottom: { flexDirection: "row", justifyContent: "center", marginTop: 21 },
  bottomText: { color: COLORS.textMuted, fontSize: 11 },
  link: { color: COLORS.text, fontSize: 11, fontWeight: "900" },
  note: { color: COLORS.textMuted, fontSize: 9, lineHeight: 14, textAlign: "center", marginTop: 18, paddingHorizontal: 12 },
  pressed: { opacity: 0.78 },
});
