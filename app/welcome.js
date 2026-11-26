import { ImageBackground, Pressable, StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";
import { COLORS, RADIUS, SPACING } from "../constants/theme";

const WELCOME_IMAGE = require("../assets/fashion-home.jpg");

export default function WelcomeScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.topNote}>A LITTLE MORE YOU, EVERY DAY</Text>

      <ImageBackground source={WELCOME_IMAGE} style={styles.artCard} imageStyle={styles.artImage}>
        <View style={styles.imageShade} />
        <View style={styles.floatingLabel}><Text style={styles.floatingLabelText}>YOUR PERSONAL STYLE SPACE</Text></View>
        <View style={styles.artCaption}>
          <Text style={styles.captionSmall}>THE STYLE EDIT</Text>
          <Text style={styles.captionTitle}>Wear what{"\n"}you love.</Text>
        </View>
      </ImageBackground>

      <View style={styles.copy}>
        <Text style={styles.brand}>STYLEMATE</Text>
        <Text style={styles.title}>Your wardrobe.{"\n"}Your style.</Text>
        <Text style={styles.description}>Bring the pieces you own together, discover new combinations, and make getting dressed feel a little easier.</Text>
      </View>

      <View style={styles.actions}>
        <Link href="/signup" asChild>
          <Pressable style={styles.primaryButton}><Text style={styles.primaryText}>Create your profile</Text><Text style={styles.arrow}>→</Text></Pressable>
        </Link>
        <Link href="/login" asChild>
          <Pressable style={styles.secondaryButton}><Text style={styles.secondaryText}>I already have a profile</Text></Pressable>
        </Link>
        <Text style={styles.privacyNote}>Your profile stays on this device.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background, paddingHorizontal: SPACING.lg, paddingTop: 26, paddingBottom: 22, justifyContent: "space-between" },
  topNote: { color: COLORS.textMuted, fontSize: 9, fontWeight: "900", letterSpacing: 1.7, textAlign: "center" },
  artCard: { height: 255, justifyContent: "flex-end", overflow: "hidden", backgroundColor: "#D8CBC0", marginTop: 18 },
  artImage: { borderRadius: 25 },
  imageShade: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.22)" },
  floatingLabel: { position: "absolute", top: 17, right: 16, backgroundColor: "#FFFFFF", paddingHorizontal: 12, paddingVertical: 8, borderRadius: RADIUS.pill },
  floatingLabelText: { color: COLORS.text, fontSize: 7, fontWeight: "900", letterSpacing: 1 },
  artCaption: { padding: 20 },
  captionSmall: { color: "#FFFFFF", fontSize: 8, fontWeight: "900", letterSpacing: 1.5 },
  captionTitle: { color: "#FFFFFF", fontSize: 34, lineHeight: 36, fontWeight: "900", letterSpacing: -1, marginTop: 7 },
  copy: { marginTop: 22 },
  brand: { color: "#A47E69", fontSize: 10, fontWeight: "900", letterSpacing: 1.6 },
  title: { color: COLORS.text, fontSize: 36, lineHeight: 40, fontWeight: "900", letterSpacing: -1.3, marginTop: 8 },
  description: { color: COLORS.textMuted, fontSize: 13, lineHeight: 20, marginTop: 10, maxWidth: 320 },
  actions: { gap: 10, marginTop: 18 },
  primaryButton: { minHeight: 54, backgroundColor: COLORS.text, borderRadius: RADIUS.pill, paddingHorizontal: 20, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  primaryText: { color: "#FFFFFF", fontSize: 13, fontWeight: "800" },
  arrow: { color: "#FFFFFF", fontSize: 21 },
  secondaryButton: { minHeight: 48, borderRadius: RADIUS.pill, borderWidth: 1, borderColor: COLORS.border, alignItems: "center", justifyContent: "center" },
  secondaryText: { color: COLORS.text, fontSize: 12, fontWeight: "800" },
  privacyNote: { textAlign: "center", color: COLORS.textMuted, fontSize: 9, marginTop: 3 },
});
