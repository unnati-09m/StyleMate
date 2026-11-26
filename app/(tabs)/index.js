import { ImageBackground, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { COLORS, RADIUS, SPACING } from "../../constants/theme";

const HERO_IMAGE = require("../../assets/fashion-home.jpg");

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
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.topRow}>
        <View>
          <Text style={styles.eyebrow}>YOUR PERSONAL STYLE SPACE</Text>
          <Text style={styles.brand}>StyleMate</Text>
        </View>
        <View style={styles.avatar}><Text style={styles.avatarText}>S</Text></View>
      </View>

      <View style={styles.greetingBlock}>
        <Text style={styles.greeting}>A fresh look begins here</Text>
        <Text style={styles.headline}>Dress like{"\n"}you mean it.</Text>
        <Text style={styles.description}>Make more of the pieces you already love.</Text>
      </View>

      <View style={styles.heroCard}>
        <View style={styles.heroTopLine}>
          <Text style={styles.heroEyebrow}>TODAY'S INSPIRATION</Text>
          <View style={styles.newTag}><Text style={styles.newTagText}>STYLE NOTE 01</Text></View>
        </View>
        <ImageBackground source={HERO_IMAGE} style={styles.heroImage} imageStyle={styles.heroImageStyle}>
          <View style={styles.imageShade} />
          <View style={styles.imageCaption}>
            <Text style={styles.imageCaptionSmall}>THE EVERYDAY EDIT</Text>
            <Text style={styles.imageCaptionTitle}>Less, but better.</Text>
          </View>
        </ImageBackground>
        <Text style={styles.heroTitle}>A wardrobe full of possibilities.</Text>
        <Text style={styles.heroDescription}>
          Add your favourite pieces, then build outfit combinations that feel like you.
        </Text>
        <Pressable accessibilityRole="button" style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]} onPress={() => router.push("/wardrobe")}>
          <Text style={styles.primaryButtonText}>Explore my wardrobe</Text>
          <Text style={styles.buttonArrow}>→</Text>
        </Pressable>
      </View>

      <SectionHeading title="Your style, at a glance" action="START HERE" />
      <View style={styles.statsRow}>
        <Pressable style={styles.statCard} onPress={() => router.push("/wardrobe")}>
          <Text style={styles.statKicker}>01 / COLLECTION</Text>
          <Text style={styles.statTitle}>Your wardrobe</Text>
          <Text style={styles.statLink}>Add clothing  →</Text>
        </Pressable>
        <Pressable style={[styles.statCard, styles.statCardDark]} onPress={() => router.push("/favourites")}>
          <Text style={[styles.statKicker, styles.statLight]}>02 / YOUR EDIT</Text>
          <Text style={[styles.statTitle, styles.statTitleLight]}>Saved looks</Text>
          <Text style={[styles.statLink, styles.statLight]}>View favourites  →</Text>
        </Pressable>
      </View>

      <SectionHeading title="A little style ritual" />
      <View style={styles.tipCard}>
        <Text style={styles.tipMark}>“</Text>
        <View style={styles.tipCopy}>
          <Text style={styles.tipTitle}>Wear what makes you feel good.</Text>
          <Text style={styles.tipText}>Save the combinations you love and make getting dressed easier tomorrow.</Text>
        </View>
      </View>
      <Text style={styles.footerNote}>MADE FOR YOUR EVERYDAY KIND OF STYLE.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  content: { paddingHorizontal: SPACING.lg, paddingTop: 22, paddingBottom: 36 },
  topRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  eyebrow: { color: COLORS.textMuted, fontSize: 9, fontWeight: "800", letterSpacing: 1.6 },
  brand: { color: COLORS.text, fontSize: 23, fontWeight: "900", marginTop: 4, letterSpacing: -0.8 },
  avatar: { width: 42, height: 42, borderRadius: 21, backgroundColor: "#F1E8E1", alignItems: "center", justifyContent: "center" },
  avatarText: { color: COLORS.text, fontSize: 16, fontWeight: "900" },
  greetingBlock: { marginTop: 34, marginBottom: 22 },
  greeting: { color: "#A47E69", fontSize: 13, fontWeight: "800", marginBottom: 8, letterSpacing: 0.2 },
  headline: { color: COLORS.text, fontSize: 42, lineHeight: 44, fontWeight: "900", letterSpacing: -1.8 },
  description: { color: COLORS.textMuted, fontSize: 14, lineHeight: 21, marginTop: 10 },
  heroCard: { backgroundColor: COLORS.surface, borderRadius: 25, padding: 16, borderWidth: 1, borderColor: COLORS.border, marginBottom: 28 },
  heroTopLine: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  heroEyebrow: { color: COLORS.textMuted, fontSize: 9, fontWeight: "900", letterSpacing: 1.4 },
  newTag: { backgroundColor: "#F5EEE8", borderRadius: RADIUS.pill, paddingHorizontal: 10, paddingVertical: 6 },
  newTagText: { color: COLORS.text, fontSize: 8, fontWeight: "900", letterSpacing: 0.8 },
  heroImage: { height: 205, justifyContent: "flex-end", overflow: "hidden", backgroundColor: "#EDE5DE" },
  heroImageStyle: { borderRadius: 17 },
  imageShade: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.18)" },
  imageCaption: { padding: 17 },
  imageCaptionSmall: { color: "#FFFFFF", fontSize: 8, fontWeight: "900", letterSpacing: 1.6 },
  imageCaptionTitle: { color: "#FFFFFF", fontSize: 27, fontWeight: "900", letterSpacing: -0.8, marginTop: 3 },
  heroTitle: { color: COLORS.text, fontSize: 20, fontWeight: "900", marginTop: 17, letterSpacing: -0.5 },
  heroDescription: { color: COLORS.textMuted, fontSize: 13, lineHeight: 20, marginTop: 7 },
  primaryButton: { marginTop: 17, backgroundColor: COLORS.text, borderRadius: RADIUS.pill, minHeight: 53, paddingHorizontal: 18, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  primaryButtonText: { color: "#FFFFFF", fontSize: 13, fontWeight: "800" },
  buttonArrow: { color: "#FFFFFF", fontSize: 21 },
  sectionHeading: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  sectionTitle: { color: COLORS.text, fontSize: 17, fontWeight: "900", letterSpacing: -0.3 },
  sectionAction: { color: COLORS.textMuted, fontSize: 9, fontWeight: "800", letterSpacing: 1 },
  statsRow: { flexDirection: "row", gap: 11, marginBottom: 27 },
  statCard: { flex: 1, minHeight: 132, backgroundColor: "#F4EEE9", borderRadius: 19, padding: 15, justifyContent: "space-between" },
  statCardDark: { backgroundColor: "#171717" },
  statKicker: { color: "#8C7567", fontSize: 8, fontWeight: "900", letterSpacing: 1 },
  statTitle: { color: COLORS.text, fontSize: 16, fontWeight: "900" },
  statTitleLight: { color: "#FFFFFF" },
  statLink: { color: COLORS.text, fontSize: 10, fontWeight: "800" },
  statLight: { color: "#D4C7BD" },
  tipCard: { flexDirection: "row", backgroundColor: "#F8F6F4", borderRadius: 18, padding: 16, alignItems: "flex-start" },
  tipMark: { color: "#B58A73", fontSize: 40, lineHeight: 42, fontWeight: "900", marginRight: 10 },
  tipCopy: { flex: 1, paddingTop: 4 },
  tipTitle: { color: COLORS.text, fontSize: 13, fontWeight: "900" },
  tipText: { color: COLORS.textMuted, fontSize: 11, lineHeight: 17, marginTop: 5 },
  footerNote: { textAlign: "center", color: COLORS.textMuted, fontSize: 8, fontWeight: "800", letterSpacing: 1.3, marginTop: 28 },
  pressed: { opacity: 0.78 },
});
