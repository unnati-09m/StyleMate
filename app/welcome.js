import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";
import { COLORS, RADIUS, SPACING } from "../constants/theme";
import { EDITORIAL_IMAGES } from "../constants/editorialImages";
import EditorialImage from "../components/EditorialImage";

function FeatureLine({ number, title, text }) {
  return (
    <View style={styles.featureLine}>
      <Text style={styles.featureNumber}>{number}</Text>
      <View style={styles.featureCopy}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureText}>{text}</Text>
      </View>
    </View>
  );
}

export default function WelcomeScreen() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.nav}>
        <View>
          <Text style={styles.brand}>STYLEMATE</Text>
          <Text style={styles.brandSub}>THE EVERYDAY STYLE EDIT</Text>
        </View>
        <Text style={styles.navIndex}>EST. FOR YOUR WARDROBE</Text>
      </View>

      <View style={styles.hero}>
        <EditorialImage
          source={EDITORIAL_IMAGES.welcome}
          style={styles.heroImage}
          fallbackLabel="Full length neutral fashion editorial"
        />
        <View style={styles.photoLabel}>
          <Text style={styles.photoLabelText}>01 / YOUR PERSONAL STYLE SPACE</Text>
        </View>
      </View>

      <View style={styles.heading}>
        <Text style={styles.eyebrow}>A MORE THOUGHTFUL WAY TO GET DRESSED</Text>
        <Text style={styles.title}>Your wardrobe.{"\n"}Your kind of style.</Text>
        <Text style={styles.description}>
          StyleMate helps you make more of the clothes you already own — from organising your pieces to finding combinations for every day.
        </Text>
      </View>

      <View style={styles.aboutCard}>
        <Text style={styles.aboutEyebrow}>WHAT IS STYLEMATE?</Text>
        <Text style={styles.aboutTitle}>A little space for your personal style.</Text>
        <Text style={styles.aboutText}>
          Add photos of your clothes, note their colours and occasions, then build simple outfit combinations from your own collection. Save the looks you love and keep a record of what you wear.
        </Text>
      </View>

      <View style={styles.featuresHeading}>
        <Text style={styles.eyebrow}>THE STYLEMATE EDIT</Text>
        <Text style={styles.featuresTitle}>Everything you need, nothing you don't.</Text>
      </View>

      <View style={styles.features}>
        <FeatureLine number="01" title="Your digital wardrobe" text="Keep clothing photos and details organised in one place." />
        <FeatureLine number="02" title="Outfit combinations" text="Find looks by occasion and season using pieces you own." />
        <FeatureLine number="03" title="Saved looks & history" text="Keep favourite combinations and remember what you wore." />
        <FeatureLine number="04" title="Gentle reminders" text="Set an optional daily reminder to plan tomorrow's outfit." />
      </View>

      <View style={styles.actions}>
        <Link href="/signup" asChild>
          <Pressable style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}>
            <Text style={styles.primaryText}>Create your StyleMate profile</Text>
            <Text style={styles.arrow}>→</Text>
          </Pressable>
        </Link>
        <Link href="/login" asChild>
          <Pressable style={styles.secondaryButton}>
            <Text style={styles.secondaryText}>I already have a profile  ↗</Text>
          </Pressable>
        </Link>
        <Text style={styles.privacyNote}>Your profile, wardrobe, favourites and history are stored on this device.</Text>
      </View>

      <Text style={styles.footer}>STYLEMATE  /  MAKE MORE OF WHAT YOU HAVE.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#FFFFFF" },
  content: { paddingHorizontal: 19, paddingTop: 22, paddingBottom: 32 },
  nav: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 17 },
  brand: { color: "#171717", fontSize: 20, fontWeight: "900", letterSpacing: 2 },
  brandSub: { color: "#8C8279", fontSize: 7, fontWeight: "800", letterSpacing: 1.4, marginTop: 4 },
  navIndex: { color: "#8C8279", fontSize: 6, fontWeight: "900", letterSpacing: 1, textAlign: "right" },
  hero: { width: "100%", aspectRatio: 2 / 3, borderRadius: 17, overflow: "hidden", backgroundColor: "#E8E1D9", position: "relative" },
  heroImage: { ...StyleSheet.absoluteFillObject },
  photoLabel: { position: "absolute", top: 13, left: 13, backgroundColor: "rgba(255,255,255,0.94)", borderRadius: 20, paddingHorizontal: 10, paddingVertical: 7 },
  photoLabelText: { color: "#171717", fontSize: 7, fontWeight: "900", letterSpacing: 0.8 },
  heading: { marginTop: 23 },
  eyebrow: { color: "#98775F", fontSize: 7, fontWeight: "900", letterSpacing: 1.4 },
  title: { color: "#171717", fontSize: 34, lineHeight: 37, fontWeight: "900", letterSpacing: -1.3, marginTop: 8 },
  description: { color: "#6F6963", fontSize: 11, lineHeight: 18, marginTop: 9 },
  aboutCard: { backgroundColor: "#F3F0ED", padding: 17, borderRadius: 17, marginTop: 22 },
  aboutEyebrow: { color: "#98775F", fontSize: 7, fontWeight: "900", letterSpacing: 1.5 },
  aboutTitle: { color: "#171717", fontSize: 20, lineHeight: 24, fontWeight: "900", letterSpacing: -0.5, marginTop: 9 },
  aboutText: { color: "#706961", fontSize: 10, lineHeight: 16, marginTop: 7 },
  featuresHeading: { marginTop: 27, marginBottom: 12 },
  featuresTitle: { color: "#171717", fontSize: 18, lineHeight: 22, fontWeight: "900", marginTop: 6 },
  features: { borderTopWidth: 1, borderTopColor: "#E9E4E0" },
  featureLine: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#E9E4E0", paddingVertical: 13, gap: 12 },
  featureNumber: { color: "#A28670", fontSize: 8, fontWeight: "900", paddingTop: 2 },
  featureCopy: { flex: 1 },
  featureTitle: { color: "#171717", fontSize: 11, fontWeight: "900" },
  featureText: { color: "#77716B", fontSize: 9, lineHeight: 14, marginTop: 4 },
  actions: { gap: 9, marginTop: 25 },
  primaryButton: { minHeight: 53, backgroundColor: "#171717", borderRadius: RADIUS.pill, paddingHorizontal: 18, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  primaryText: { color: "#FFFFFF", fontSize: 11, fontWeight: "900" },
  arrow: { color: "#FFFFFF", fontSize: 20 },
  secondaryButton: { minHeight: 46, borderRadius: RADIUS.pill, borderWidth: 1, borderColor: "#DCD6D0", alignItems: "center", justifyContent: "center" },
  secondaryText: { color: "#171717", fontSize: 10, fontWeight: "800" },
  privacyNote: { color: "#827971", fontSize: 7, lineHeight: 11, textAlign: "center", marginTop: 4 },
  footer: { color: "#9A8F85", fontSize: 7, fontWeight: "900", letterSpacing: 1, textAlign: "center", marginTop: 25 },
  pressed: { opacity: 0.78 },
});
