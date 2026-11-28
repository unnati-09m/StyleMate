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
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COLORS, RADIUS } from "../constants/theme";
import { EDITORIAL_IMAGES } from "../constants/editorialImages";
import EditorialImage from "../components/EditorialImage";

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
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <KeyboardAvoidingView style={styles.keyboard} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={styles.screen} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <Link href="/welcome" asChild><Pressable><Text style={styles.back}>←  BACK TO STYLEMATE</Text></Pressable></Link>

        <View style={styles.hero}>
          <EditorialImage source={EDITORIAL_IMAGES.login} style={styles.heroPhoto} fallbackLabel="White tailored fashion editorial" />
          <View style={styles.heroTag}><Text style={styles.heroTagText}>YOUR STYLE SPACE  /  02</Text></View>
        </View>

        <View style={styles.heading}>
          <Text style={styles.eyebrow}>WELCOME BACK</Text>
          <Text style={styles.title}>Your wardrobe{"\n"}missed you.</Text>
          <Text style={styles.description}>Enter the email saved with your profile to continue where you left off.</Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.label}>EMAIL ADDRESS</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            placeholderTextColor="#A29A92"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.input}
            returnKeyType="done"
            onSubmitEditing={login}
          />
          <Pressable style={[styles.primaryButton, busy && styles.disabled]} onPress={login} disabled={busy}>
            <Text style={styles.primaryText}>{busy ? "Opening your profile…" : "Continue to StyleMate"}</Text>
            <Text style={styles.arrow}>→</Text>
          </Pressable>
          <View style={styles.bottom}>
            <Text style={styles.bottomText}>New to StyleMate?</Text>
            <Link href="/signup" asChild><Pressable><Text style={styles.link}>Create a profile</Text></Pressable></Link>
          </View>
        </View>

        <View style={styles.infoBlock}>
          <Text style={styles.infoEyebrow}>A QUICK REMINDER</Text>
          <Text style={styles.infoTitle}>What you can do inside.</Text>
          <View style={styles.infoRow}><Text style={styles.infoNumber}>01</Text><Text style={styles.infoText}>Organise clothing photos and details in your digital wardrobe.</Text></View>
          <View style={styles.infoRow}><Text style={styles.infoNumber}>02</Text><Text style={styles.infoText}>Build outfits by occasion and season from pieces you own.</Text></View>
          <View style={styles.infoRow}><Text style={styles.infoNumber}>03</Text><Text style={styles.infoText}>Save favourite combinations and keep your outfit history.</Text></View>
        </View>

        <Text style={styles.note}>This is a local profile on this device, not an online account. Your saved wardrobe data stays on this device.</Text>
      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FFFFFF" },
  keyboard: { flex: 1, backgroundColor: "#FFFFFF" },
  screen: { flexGrow: 1, paddingHorizontal: 19, paddingTop: 21, paddingBottom: 30 },
  back: { color: "#77716B", fontSize: 7, fontWeight: "900", letterSpacing: 1.1, marginBottom: 15 },
  hero: { width: "100%", aspectRatio: 2 / 3, borderRadius: 17, overflow: "hidden", backgroundColor: "#EAE5DF", position: "relative" },
  heroPhoto: { ...StyleSheet.absoluteFillObject },
  heroTag: { position: "absolute", top: 12, left: 12, borderRadius: 18, backgroundColor: "rgba(255,255,255,0.94)", paddingHorizontal: 10, paddingVertical: 7 },
  heroTagText: { color: "#171717", fontSize: 7, fontWeight: "900", letterSpacing: 0.8 },
  heading: { marginTop: 22 },
  eyebrow: { color: "#98775F", fontSize: 7, fontWeight: "900", letterSpacing: 1.4 },
  title: { color: "#171717", fontSize: 32, lineHeight: 35, fontWeight: "900", letterSpacing: -1.2, marginTop: 7 },
  description: { color: "#706A64", fontSize: 10, lineHeight: 16, marginTop: 8 },
  formCard: { backgroundColor: "#F5F2EF", borderRadius: 17, padding: 15, marginTop: 19 },
  label: { color: "#77716B", fontSize: 7, fontWeight: "900", letterSpacing: 1.2, marginBottom: 8 },
  input: { height: 49, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#E3DDD7", borderRadius: 11, paddingHorizontal: 13, color: "#171717", fontSize: 11 },
  primaryButton: { minHeight: 50, backgroundColor: "#171717", borderRadius: RADIUS.pill, paddingHorizontal: 16, flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 14 },
  primaryText: { color: "#FFFFFF", fontSize: 10, fontWeight: "900" },
  arrow: { color: "#FFFFFF", fontSize: 19 },
  bottom: { flexDirection: "row", justifyContent: "center", marginTop: 17 },
  bottomText: { color: "#77716B", fontSize: 9 },
  link: { color: "#171717", fontSize: 9, fontWeight: "900" },
  infoBlock: { marginTop: 25, borderTopWidth: 1, borderTopColor: "#E8E3DE", paddingTop: 17 },
  infoEyebrow: { color: "#98775F", fontSize: 7, fontWeight: "900", letterSpacing: 1.3 },
  infoTitle: { color: "#171717", fontSize: 17, fontWeight: "900", marginTop: 6, marginBottom: 8 },
  infoRow: { flexDirection: "row", paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "#EEEAE6", gap: 10 },
  infoNumber: { color: "#A08774", fontSize: 8, fontWeight: "900", paddingTop: 1 },
  infoText: { color: "#6F6963", fontSize: 9, lineHeight: 14, flex: 1 },
  note: { color: "#837970", fontSize: 7, lineHeight: 12, textAlign: "center", marginTop: 16, paddingHorizontal: 8 },
  disabled: { opacity: 0.55 },
});
