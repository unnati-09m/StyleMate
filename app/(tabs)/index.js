import { ScrollView, StyleSheet, Text, View, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { COLORS, RADIUS, SPACING } from "../../constants/theme";

function SectionHeading({ title, action }) {
  return (
    <View style={styles.sectionHeading}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {action ? <Text style={styles.sectionAction}>{action}</Text> : null}
    </View>
  );
}

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.topRow}>
        <View>
          <Text style={styles.eyebrow}>YOUR PERSONAL STYLE SPACE</Text>
          <Text style={styles.brand}>StyleMate</Text>
        </View>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>S</Text>
        </View>
      </View>

      <View style={styles.greetingBlock}>
        <Text style={styles.greeting}>Good morning ✨</Text>
        <Text style={styles.headline}>
          Your style,{"\n"}your way.
        </Text>
        <Text style={styles.description}>
          A little inspiration from the clothes you already own.
        </Text>
      </View>

      <View style={styles.heroCard}>
        <View style={styles.heroTopLine}>
          <Text style={styles.heroEyebrow}>TODAY'S INSPIRATION</Text>
          <View style={styles.newTag}>
            <Text style={styles.newTagText}>JUST FOR YOU</Text>
          </View>
        </View>
        <View style={styles.heroIllustration}>
          <Text style={styles.hanger}>♧</Text>
        </View>
        <Text style={styles.heroTitle}>A lovely outfit starts here</Text>
        <Text style={styles.heroDescription}>
          Add a few pieces to your wardrobe and StyleMate will put together
          combinations for you.
        </Text>
        <Pressable
          accessibilityRole="button"
          style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}
          onPress={() => router.push("/wardrobe")}
        >
          <Text style={styles.primaryButtonText}>Explore my wardrobe</Text>
          <Text style={styles.buttonArrow}>→</Text>
        </Pressable>
      </View>

      <SectionHeading title="Your wardrobe" action="A fresh start" />
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Clothing pieces</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Saved outfits</Text>
        </View>
      </View>

      <SectionHeading title="Your style toolkit" />
      <View style={styles.actionList}>
        <Pressable
          style={({ pressed }) => [styles.actionCard, pressed && styles.pressed]}
          onPress={() => router.push("/wardrobe")}
        >
          <View style={[styles.actionIcon, { backgroundColor: "#F2E4DA" }]}>
            <Text style={styles.actionEmoji}>＋</Text>
          </View>
          <View style={styles.actionCopy}>
            <Text style={styles.actionTitle}>Add to wardrobe</Text>
            <Text style={styles.actionSubtitle}>Save a photo of a clothing piece</Text>
          </View>
          <Text style={styles.actionArrow}>→</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.actionCard, pressed && styles.pressed]}
          onPress={() => router.push("/favourites")}
        >
          <View style={[styles.actionIcon, { backgroundColor: "#EEE9DF" }]}>
            <Text style={styles.actionEmoji}>♡</Text>
          </View>
          <View style={styles.actionCopy}>
            <Text style={styles.actionTitle}>Favourite looks</Text>
            <Text style={styles.actionSubtitle}>Keep combinations you love</Text>
          </View>
          <Text style={styles.actionArrow}>→</Text>
        </Pressable>
      </View>

      <Text style={styles.footerNote}>Made for your everyday kind of style.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    paddingHorizontal: SPACING.lg,
    paddingTop: 22,
    paddingBottom: 34,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  eyebrow: {
    color: COLORS.textMuted,
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1.5,
  },
  brand: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: "800",
    marginTop: 3,
    letterSpacing: -0.5,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.accentSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: COLORS.accent,
    fontSize: 16,
    fontWeight: "800",
  },
  greetingBlock: {
    marginTop: 34,
    marginBottom: 22,
  },
  greeting: {
    color: COLORS.accent,
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 9,
  },
  headline: {
    color: COLORS.text,
    fontSize: 38,
    lineHeight: 42,
    fontWeight: "800",
    letterSpacing: -1.2,
  },
  description: {
    color: COLORS.textMuted,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 10,
    maxWidth: 290,
  },
  heroCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 28,
  },
  heroTopLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  heroEyebrow: {
    color: COLORS.textMuted,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.2,
  },
  newTag: {
    backgroundColor: "#F5EEE8",
    borderRadius: RADIUS.pill,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  newTagText: {
    color: COLORS.accent,
    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 0.7,
  },
  heroIllustration: {
    height: 112,
    borderRadius: RADIUS.md,
    backgroundColor: "#F7F0EA",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 17,
    marginBottom: 17,
  },
  hanger: {
    color: "#B58A73",
    fontSize: 54,
    transform: [{ rotate: "90deg" }],
  },
  heroTitle: {
    color: COLORS.text,
    fontSize: 19,
    fontWeight: "800",
  },
  heroDescription: {
    color: COLORS.textMuted,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 7,
  },
  primaryButton: {
    marginTop: 16,
    backgroundColor: COLORS.text,
    borderRadius: RADIUS.pill,
    minHeight: 48,
    paddingHorizontal: 17,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
  buttonArrow: {
    color: "#FFFFFF",
    fontSize: 20,
  },
  sectionHeading: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: "800",
  },
  sectionAction: {
    color: COLORS.textMuted,
    fontSize: 11,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 28,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.surfaceMuted,
    borderRadius: RADIUS.md,
    padding: 16,
  },
  statNumber: {
    color: COLORS.text,
    fontSize: 26,
    fontWeight: "800",
  },
  statLabel: {
    color: COLORS.textMuted,
    fontSize: 11,
    marginTop: 3,
  },
  actionList: {
    gap: 10,
  },
  actionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 12,
  },
  actionIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  actionEmoji: {
    color: COLORS.accent,
    fontSize: 23,
    fontWeight: "600",
  },
  actionCopy: {
    flex: 1,
    marginLeft: 12,
  },
  actionTitle: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: "700",
  },
  actionSubtitle: {
    color: COLORS.textMuted,
    fontSize: 10,
    marginTop: 3,
  },
  actionArrow: {
    color: COLORS.textMuted,
    fontSize: 20,
    paddingHorizontal: 5,
  },
  pressed: {
    opacity: 0.75,
  },
  footerNote: {
    textAlign: "center",
    color: COLORS.textMuted,
    fontSize: 10,
    marginTop: 28,
  },
});
