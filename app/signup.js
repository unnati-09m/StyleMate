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
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <KeyboardAvoidingView style={styles.keyboard} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={styles.screen} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <Link href="/welcome" asChild><Pressable><Text style={styles.back}>←  BACK TO STYLEMATE</Text></Pressable></Link>

        <View style={styles.hero}>
          <EditorialImage source={EDITORIAL_IMAGES.signup} style={styles.heroPhoto} fallbackLabel="Monochrome editorial fashion photograph" />
          <View style={styles.heroTag}><Text style={styles.heroTagText}>YOUR STYLE SPACE  /  01</Text></View>
        </View>

        <View style={styles.heading}>
          <Text style={styles.eyebrow}>LET'S MAKE THIS YOUR SPACE</Text>
          <Text style={styles.title}>A wardrobe that{"\n"}feels like you.</Text>
          <Text style={styles.description}>Create a local profile and start collecting the pieces you love.</Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.label}>YOUR NAME</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="How should we call you?"
            placeholderTextColor="#A29A92"
            autoCapitalize="words"
            style={styles.input}
            returnKeyType="next"
          />
          <Text style={[styles.label, styles.emailLabel]}>EMAIL ADDRESS</Text>
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
            onSubmitEditing={createProfile}
          />
          <Pressable style={[styles.primaryButton, busy && styles.disabled]} onPress={createProfile} disabled={busy}>
            <Text style={styles.primaryText}>{busy ? "Creating your profile…" : "Create my profile"}</Text>
            <Text style={styles.arrow}>→</Text>
          </Pressable>
          <View style={styles.bottom}>
            <Text style={styles.bottomText}>Already joined?</Text>
            <Link href="/login" asChild><Pressable><Text style={styles.link}>Log in</Text></Pressable></Link>
          </View>
        </View>

        <View style={styles.privacyCard}>
          <Text style={styles.privacyTitle}>Made for your everyday.</Text>
          <Text style={styles.privacyText}>Your clothing, photos, favourites and outfit history are stored locally on your device. No online account is created.</Text>
        </View>
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
  emailLabel: { marginTop: 14 },
  input: { height: 49, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#E3DDD7", borderRadius: 11, paddingHorizontal: 13, color: "#171717", fontSize: 11 },
  primaryButton: { minHeight: 50, backgroundColor: "#171717", borderRadius: RADIUS.pill, paddingHorizontal: 16, flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 17 },
  primaryText: { color: "#FFFFFF", fontSize: 10, fontWeight: "900" },
  arrow: { color: "#FFFFFF", fontSize: 19 },
  bottom: { flexDirection: "row", justifyContent: "center", marginTop: 17 },
  bottomText: { color: "#77716B", fontSize: 9 },
  link: { color: "#171717", fontSize: 9, fontWeight: "900" },
  privacyCard: { backgroundColor: "#F5F2EF", padding: 14, borderRadius: 14, marginTop: 17 },
  privacyTitle: { color: "#171717", fontSize: 10, fontWeight: "900" },
  privacyText: { color: "#716A64", fontSize: 8, lineHeight: 13, marginTop: 5 },
  disabled: { opacity: 0.55 },
});
