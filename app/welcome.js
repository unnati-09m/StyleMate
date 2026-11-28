import { Pressable, StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";
import { COLORS, RADIUS, SPACING } from "../constants/theme";

function EditorialArt() {
  return (
    <View style={styles.artCard}>
      <View style={styles.artCircle} />
      <View style={styles.artLineOne} />
      <View style={styles.artLineTwo} />
      <View style={styles.artLabel}>
        <Text style={styles.artLabelText}>YOUR PERSONAL STYLE SPACE</Text>
      </View>
      <View style={styles.artCaption}>
        <Text style={styles.artKicker}>THE STYLE EDIT  /  001</Text>
        <Text style={styles.artTitle}>Wear what{"\n"}you love.</Text>
      </View>
      <Text style={styles.artNumber}>S / M</Text>
    </View>
  );
}

export default function WelcomeScreen() {
  return (
    <View style={styles.screen}>
      <View style={styles.topBar}>
        <Text style={styles.topNote}>A LITTLE MORE YOU, EVERY DAY</Text>
        <View style={styles.topDot} />
      </View>
      <EditorialArt />
      <View style={styles.copy}>
        <Text style={styles.brand}>STYLEMATE</Text>
        <Text style={styles.title}>Your wardrobe.{"\n"}Your kind of style.</Text>
        <Text style={styles.description}>
          Bring your favourite pieces together, discover new combinations and make getting dressed feel a little easier.
        </Text>
      </View>
      <View style={styles.actions}>
        <Link href="/signup" asChild>
          <Pressable style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}>
            <Text style={styles.primaryText}>Create your profile</Text>
            <Text style={styles.arrow}>→</Text>
          </Pressable>
        </Link>
        <Link href="/login" asChild>
          <Pressable style={styles.secondaryButton}>
            <Text style={styles.secondaryText}>I already have a profile</Text>
          </Pressable>
        </Link>
        <Text style={styles.privacyNote}>Your profile and wardrobe stay on this device.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background, paddingHorizontal: SPACING.lg, paddingTop: 25, paddingBottom: 20, justifyContent: "space-between" },
  topBar: { flexDirection: "row", alignItems: "center", justifyContent: "center" },
  topNote: { color: COLORS.textMuted, fontSize: 8, fontWeight: "900", letterSpacing: 1.5 },
  topDot: { position: "absolute", right: 2, width: 7, height: 7, borderRadius: 4, backgroundColor: "#B49A87" },
  artCard: { height: 270, justifyContent: "flex-end", backgroundColor: "#E8E0D8", borderRadius: 25, overflow: "hidden", marginTop: 18 },
  artCircle: { position: "absolute", width: 235, height: 235, borderRadius: 118, backgroundColor: "#D4C6BA", right: -62, top: -30 },
  artLineOne: { position: "absolute", height: 330, width: 1, backgroundColor: "rgba(255,255,255,0.8)", right: 93, top: -25, transform: [{ rotate: "23deg" }] },
  artLineTwo: { position: "absolute", height: 160, width: 160, borderRadius: 80, borderWidth: 1, borderColor: "rgba(255,255,255,0.8)", right: 10, bottom: -68 },
  artLabel: { position: "absolute", top: 16, right: 16, backgroundColor: "#FFFFFF", borderRadius: RADIUS.pill, paddingHorizontal: 11, paddingVertical: 8 },
  artLabelText: { color: COLORS.text, fontSize: 7, fontWeight: "900", letterSpacing: 0.8 },
  artCaption: { padding: 20, maxWidth: 270 },
  artKicker: { color: "#68594E", fontSize: 8, fontWeight: "900", letterSpacing: 1.5 },
  artTitle: { color: COLORS.text, fontSize: 39, lineHeight: 40, fontWeight: "900", letterSpacing: -1.6, marginTop: 9 },
  artNumber: { position: "absolute", right: 17, bottom: 15, color: "#75665B", fontSize: 8, fontWeight: "900", letterSpacing: 1.2 },
  copy: { marginTop: 20 },
  brand: { color: "#9A7864", fontSize: 9, fontWeight: "900", letterSpacing: 1.8 },
  title: { color: COLORS.text, fontSize: 33, lineHeight: 37, fontWeight: "900", letterSpacing: -1.2, marginTop: 8 },
  description: { color: COLORS.textMuted, fontSize: 12, lineHeight: 19, marginTop: 9, maxWidth: 330 },
  actions: { gap: 9, marginTop: 18 },
  primaryButton: { minHeight: 53, backgroundColor: COLORS.text, borderRadius: RADIUS.pill, paddingHorizontal: 19, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  primaryText: { color: "#FFFFFF", fontSize: 12, fontWeight: "900" },
  arrow: { color: "#FFFFFF", fontSize: 21 },
  secondaryButton: { minHeight: 47, borderRadius: RADIUS.pill, borderWidth: 1, borderColor: COLORS.border, alignItems: "center", justifyContent: "center" },
  secondaryText: { color: COLORS.text, fontSize: 11, fontWeight: "800" },
  privacyNote: { textAlign: "center", color: COLORS.textMuted, fontSize: 8, marginTop: 3 },
  pressed: { opacity: 0.75 },
});
