import { StyleSheet, Text, View } from "react-native";
import { COLORS, RADIUS, SPACING } from "../../constants/theme";

export default function FavouritesScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.eyebrow}>THE LOOKS YOU LOVE</Text>
      <Text style={styles.title}>Favourites</Text>
      <Text style={styles.description}>
        Keep your favourite outfit combinations close.
      </Text>

      <View style={styles.emptyCard}>
        <Text style={styles.heart}>♡</Text>
        <Text style={styles.emptyTitle}>Nothing saved just yet</Text>
        <Text style={styles.emptyText}>
          When you save an outfit, it will be ready for you here.
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
    padding: 28,
    alignItems: "center",
    marginTop: 34,
  },
  heart: {
    color: COLORS.accent,
    fontSize: 55,
  },
  emptyTitle: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: "800",
    marginTop: 12,
  },
  emptyText: {
    color: COLORS.textMuted,
    fontSize: 12,
    lineHeight: 19,
    textAlign: "center",
    marginTop: 8,
  },
});
