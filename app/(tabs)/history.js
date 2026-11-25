import { StyleSheet, Text, View } from "react-native";
import { COLORS, RADIUS, SPACING } from "../../constants/theme";

export default function HistoryScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.eyebrow}>YOUR OUTFIT JOURNAL</Text>
      <Text style={styles.title}>Wear history</Text>
      <Text style={styles.description}>
        A simple record of the outfits you have worn.
      </Text>

      <View style={styles.emptyCard}>
        <View style={styles.iconCircle}>
          <Text style={styles.calendar}>▦</Text>
        </View>
        <Text style={styles.emptyTitle}>Your story starts here</Text>
        <Text style={styles.emptyText}>
          Outfits you mark as worn will show up here, so you can look back at
          your style over time.
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
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.surfaceMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  calendar: {
    color: COLORS.accent,
    fontSize: 38,
  },
  emptyTitle: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: "800",
    marginTop: 18,
  },
  emptyText: {
    color: COLORS.textMuted,
    fontSize: 12,
    lineHeight: 19,
    textAlign: "center",
    marginTop: 8,
  },
});
