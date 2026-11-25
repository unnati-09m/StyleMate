import { Pressable, StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";
import { COLORS, RADIUS, SPACING } from "../constants/theme";

export default function WelcomeScreen() {
  return (
    <View style={styles.screen}>
      <View style={styles.topNote}>
        <Text style={styles.topNoteText}>A LITTLE MORE YOU, EVERY DAY</Text>
      </View>

      <View style={styles.artCard}>
        <View style={styles.artCircle}>
          <Text style={styles.artSymbol}>✳</Text>
        </View>
        <View style={styles.floatingLabel}>
          <Text style={styles.floatingLabelText}>YOUR PERSONAL STYLE SPACE</Text>
        </View>
        <Text style={styles.artCaption}>Wear what you love.</Text>
      </View>

      <View style={styles.copy}>
        <Text style={styles.brand}>StyleMate</Text>
        <Text style={styles.title}>Your wardrobe.{ "\n" }Your style.</Text>
        <Text style={styles.description}>
          Bring the pieces you own together, discover new combinations, and
          make getting dressed feel a little easier.
        </Text>
      </View>

      <View style={styles.actions}>
        <Link href="/signup" asChild>
          <Pressable style={styles.primaryButton}>
            <Text style={styles.primaryText}>Create your account</Text>
            <Text style={styles.arrow}>→</Text>
          </Pressable>
        </Link>
        <Link href="/login" asChild>
          <Pressable style={styles.secondaryButton}>
            <Text style={styles.secondaryText}>I already have an account</Text>
          </Pressable>
        </Link>
        <Text style={styles.privacyNote}>Your profile stays on this device.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.lg,
    paddingTop: 26,
    paddingBottom: 22,
    justifyContent: "space-between",
  },
  topNote: { alignItems: "center" },
  topNoteText: {
    color: COLORS.textMuted,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.8,
  },
  artCard: {
    height: 255,
    backgroundColor: "#F2F2F2",
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    marginTop: 18,
  },
  artCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "#E5E5E5",
    alignItems: "center",
    justifyContent: "center",
  },
  artSymbol: {
    color: COLORS.accent,
    fontSize: 86,
    fontWeight: "300",
  },
  floatingLabel: {
    position: "absolute",
    bottom: 24,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: RADIUS.pill,
  },
  floatingLabelText: {
    color: COLORS.text,
    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 1.1,
  },
  artCaption: {
    position: "absolute",
    top: 20,
    right: 18,
    color: COLORS.accent,
    fontSize: 12,
    fontStyle: "italic",
  },
  copy: { marginTop: 24 },
  brand: {
    color: COLORS.accent,
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 1.2,
  },
  title: {
    color: COLORS.text,
    fontSize: 37,
    lineHeight: 42,
    fontWeight: "800",
    letterSpacing: -1.2,
    marginTop: 9,
  },
  description: {
    color: COLORS.textMuted,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 12,
    maxWidth: 320,
  },
  actions: { gap: 10, marginTop: 20 },
  primaryButton: {
    minHeight: 54,
    backgroundColor: COLORS.text,
    borderRadius: RADIUS.pill,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  primaryText: { color: "#FFFFFF", fontSize: 14, fontWeight: "700" },
  arrow: { color: "#FFFFFF", fontSize: 20 },
  secondaryButton: {
    minHeight: 48,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryText: { color: COLORS.text, fontSize: 12, fontWeight: "700" },
  privacyNote: {
    textAlign: "center",
    color: COLORS.textMuted,
    fontSize: 10,
    marginTop: 4,
  },
});
