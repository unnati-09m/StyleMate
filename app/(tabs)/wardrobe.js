import { StyleSheet, Text, View } from "react-native";
import { COLORS, RADIUS, SPACING } from "../../constants/theme";

export default function WardrobeScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.eyebrow}>YOUR COLLECTION</Text>
      <Text style={styles.title}>My wardrobe</Text>
      <Text style={styles.description}>
        All your favourite pieces, together in one place.
      </Text>

      <View style={styles.emptyCard}>
        <View style={styles.iconCircle}>
          <Text style={styles.icon}>♧</Text>
        </View>
        <Text style={styles.emptyTitle}>Your wardrobe is waiting</Text>
        <Text style={styles.emptyText}>
          Your clothing pieces will appear here after you add their photos and
          details.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.lg,
    paddingTop: 34,
  },
  eyebrow: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.4,
  },
  title: {
    color: COLORS.text,
    fontSize: 30,
    fontWeight: "800",
    marginTop: 7,
  },
  description: {
    color: COLORS.textMuted,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 8,
  },
  emptyCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderColor: COLORS.border,
    borderWidth: 1,
    padding: 24,
    alignItems: "center",
    marginTop: 34,
  },
  iconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: COLORS.surfaceMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    color: COLORS.accent,
    fontSize: 44,
    transform: [{ rotate: "90deg" }],
  },
  emptyTitle: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: "800",
    marginTop: 20,
  },
  emptyText: {
    color: COLORS.textMuted,
    fontSize: 12,
    lineHeight: 19,
    textAlign: "center",
    marginTop: 8,
  },
});
