import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  AppState,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COLORS, RADIUS } from "../../constants/theme";
import { EDITORIAL_IMAGES } from "../../constants/editorialImages";
import EditorialImage from "../../components/EditorialImage";
import { getWardrobeItems } from "../../utils/wardrobeStorage";
import { getFavouriteLooks, getWearHistory } from "../../utils/styleStorage";
import { disableDailyReminder, enableDailyReminder, isDailyReminderEnabled } from "../../utils/reminders";

const INSPIRATION_URL = "https://dummyjson.com/products/category/tops?limit=5";

function SectionHeading({ eyebrow, title, action, onAction }) {
  return (
    <View style={styles.sectionHeading}>
      <View style={styles.sectionTitleWrap}>
        {eyebrow ? <Text style={styles.sectionEyebrow}>{eyebrow}</Text> : null}
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {action ? (
        <Pressable onPress={onAction} hitSlop={8}>
          <Text style={styles.sectionAction}>{action}  →</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

function FeatureCard({ number, title, text, onPress }) {
  return (
    <Pressable style={styles.featureCard} onPress={onPress}>
      <Text style={styles.featureNumber}>{number}</Text>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureText}>{text}</Text>
      <Text style={styles.featureArrow}>↗</Text>
    </Pressable>
  );
}

function StatCard({ value, label, onPress, dark }) {
  return (
    <Pressable style={[styles.statCard, dark && styles.statCardDark]} onPress={onPress}>
      <Text style={[styles.statValue, dark && styles.white]}>{value}</Text>
      <Text style={[styles.statLabel, dark && styles.statLabelDark]}>{label}</Text>
    </Pressable>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const [profileName, setProfileName] = useState("there");
  const [stats, setStats] = useState({ pieces: 0, saved: 0, worn: 0 });
  const [inspiration, setInspiration] = useState([]);
  const [inspirationState, setInspirationState] = useState("loading");
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderBusy, setReminderBusy] = useState(false);

  const loadSummary = useCallback(async () => {
    try {
      const [profileText, wardrobe, favourites, history] = await Promise.all([
        AsyncStorage.getItem("stylemate-profile"),
        getWardrobeItems(),
        getFavouriteLooks(),
        getWearHistory(),
      ]);
      const profile = profileText ? JSON.parse(profileText) : null;
      setProfileName(profile?.name?.trim()?.split(" ")[0] || "there");
      setStats({ pieces: wardrobe.length, saved: favourites.length, worn: history.length });
    } catch (error) {
      console.warn("Could not refresh your StyleMate home:", error);
    }
  }, []);

  const loadInspiration = useCallback(async () => {
    setInspirationState("loading");
    try {
      const response = await fetch(INSPIRATION_URL);
      if (!response.ok) throw new Error("The inspiration feed is unavailable.");
      const data = await response.json();
      if (!Array.isArray(data.products) || data.products.length === 0) {
        throw new Error("There are no inspiration items right now.");
      }
      setInspiration(data.products);
      setInspirationState("ready");
    } catch (error) {
      console.warn("Could not load style inspiration:", error);
      setInspiration([]);
      setInspirationState("error");
    }
  }, []);

  useEffect(() => {
    loadSummary();
    loadInspiration();
    isDailyReminderEnabled().then(setReminderEnabled).catch(() => setReminderEnabled(false));

    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        loadSummary();
        isDailyReminderEnabled().then(setReminderEnabled).catch(() => setReminderEnabled(false));
      }
    });

    return () => subscription.remove();
  }, [loadSummary, loadInspiration]);

  function confirmLogout() {
    Alert.alert(
      "Log out of StyleMate?",
      "Your wardrobe, saved looks and outfit history will stay on this device.",
      [
        { text: "Stay here", style: "cancel" },
        {
          text: "Log out",
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem("stylemate-profile");
              router.replace("/welcome");
            } catch (error) {
              Alert.alert("Couldn't log out", "Please try again.");
            }
          },
        },
      ]
    );
  }

  async function toggleReminder() {
    try {
      setReminderBusy(true);
      if (reminderEnabled) {
        await disableDailyReminder();
        setReminderEnabled(false);
        Alert.alert("Reminder turned off", "Your daily outfit reminder has been cancelled.");
      } else {
        const result = await enableDailyReminder();
        if (!result.granted) {
          Alert.alert(
            "Notifications are off",
            "You can still use StyleMate normally. Enable notifications in your device settings when you are ready."
          );
          return;
        }
        setReminderEnabled(true);
        Alert.alert(
          result.alreadyEnabled ? "Reminder is already on" : "Your reminder is set",
          "StyleMate will remind you every day at 8:00 PM. Tapping it opens Outfit Studio."
        );
      }
    } catch (error) {
      Alert.alert("Couldn't update the reminder", "Please try again from this screen.");
    } finally {
      setReminderBusy(false);
    }
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.topBar}>
        <View>
          <Text style={styles.brand}>STYLEMATE</Text>
          <Text style={styles.brandSub}>THE EVERYDAY STYLE EDIT</Text>
        </View>
        <View style={styles.headerActions}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{profileName.charAt(0).toUpperCase()}</Text>
          </View>
          <Pressable style={styles.logoutButton} onPress={confirmLogout} accessibilityRole="button">
            <Text style={styles.logoutText}>LOG OUT</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.intro}>
        <Text style={styles.eyebrow}>YOUR WARDROBE, REIMAGINED</Text>
        <Text style={styles.greeting}>Hello, {profileName}.</Text>
        <Text style={styles.headline}>A little less{"\n"}what should I wear?</Text>
        <Text style={styles.description}>
          More outfits from the pieces you already own. Thoughtful, simple and completely your style.
        </Text>
      </View>

      <View style={styles.heroCard}>
        <View style={styles.heroTopline}>
          <Text style={styles.heroKicker}>THE STYLEMATE EDIT</Text>
          <Text style={styles.heroIndex}>01 — 04</Text>
        </View>
        <View style={styles.heroPhoto}>
          <EditorialImage
            source={EDITORIAL_IMAGES.home}
            style={StyleSheet.absoluteFill}
            fallbackLabel="Neutral fashion editorial"
          />
          <View style={styles.heroOverlay} />
          <View style={styles.heroImageCopy}>
            <Text style={styles.heroImageKicker}>MAKE EVERY PIECE COUNT</Text>
            <Text style={styles.heroImageTitle}>Wear your{"\n"}wardrobe well.</Text>
            <Text style={styles.heroImageText}>Find a new favourite in what you already own.</Text>
          </View>
        </View>
        <View style={styles.heroFooter}>
          <View style={{ flex: 1 }}>
            <Text style={styles.heroFooterTitle}>Your next look starts here.</Text>
            <Text style={styles.heroFooterText}>Choose an occasion and let your own clothes do the rest.</Text>
          </View>
          <Pressable style={styles.roundButton} onPress={() => router.push("/outfit-studio")}>
            <Text style={styles.roundButtonText}>↗</Text>
          </Pressable>
        </View>
        <Pressable style={styles.primaryButton} onPress={() => router.push("/outfit-studio")}>
          <Text style={styles.primaryButtonText}>Open Outfit Studio</Text>
          <Text style={styles.primaryButtonArrow}>→</Text>
        </Pressable>
      </View>

      <SectionHeading eyebrow="YOUR COLLECTION" title="Your style, at a glance" action="WARDROBE" onAction={() => router.push("/wardrobe")} />
      <View style={styles.statsRow}>
        <StatCard value={stats.pieces} label="Pieces" onPress={() => router.push("/wardrobe")} />
        <StatCard value={stats.saved} label="Saved looks" dark onPress={() => router.push("/favourites")} />
        <StatCard value={stats.worn} label="Worn" onPress={() => router.push("/history")} />
      </View>

      <View style={styles.aboutCard}>
        <Text style={styles.aboutKicker}>WHAT IS STYLEMATE?</Text>
        <Text style={styles.aboutTitle}>Your personal wardrobe assistant.</Text>
        <Text style={styles.aboutText}>
          StyleMate brings your clothing collection into one place. Add the pieces you own, build outfit combinations for different moments, save the looks you love and remember what you wore.
        </Text>
        <Text style={styles.aboutFoot}>YOUR CLOTHES. YOUR CHOICES. YOUR STYLE.</Text>
      </View>

      <SectionHeading eyebrow="MADE FOR REAL LIFE" title="Everything in one place" />
      <View style={styles.features}>
        <FeatureCard
          number="01"
          title="Your wardrobe"
          text="Add photos and details. Keep every piece organised."
          onPress={() => router.push("/wardrobe")}
        />
        <FeatureCard
          number="02"
          title="Outfit ideas"
          text="Build combinations based on occasion and season."
          onPress={() => router.push("/outfit-studio")}
        />
        <FeatureCard
          number="03"
          title="Saved & worn"
          text="Keep favourite looks and track your outfit history."
          onPress={() => router.push("/favourites")}
        />
      </View>

      <SectionHeading eyebrow="A LITTLE INSPIRATION" title="The style feed" />
      <Text style={styles.feedDescription}>Fresh product imagery from a sample online catalogue. Your personal wardrobe stays separate.</Text>

      {inspirationState === "loading" ? (
        <View style={styles.feedMessage}>
          <ActivityIndicator color={COLORS.text} />
          <Text style={styles.messageText}>Finding a little inspiration…</Text>
        </View>
      ) : null}

      {inspirationState === "error" ? (
        <View style={styles.errorCard}>
          <Text style={styles.errorTitle}>The style feed couldn't load.</Text>
          <Text style={styles.errorText}>Check your connection and retry. Your saved wardrobe, favourites and history still work offline.</Text>
          <Pressable style={styles.retryButton} onPress={loadInspiration}>
            <Text style={styles.retryText}>Try again  ↻</Text>
          </Pressable>
        </View>
      ) : null}

      {inspirationState === "ready" ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.inspirationRow}>
          {inspiration.map((item) => (
            <View key={String(item.id)} style={styles.inspirationCard}>
              <Image source={{ uri: item.thumbnail }} style={styles.inspirationImage} resizeMode="cover" />
              <Text style={styles.inspirationName} numberOfLines={2}>{item.title}</Text>
              <Text style={styles.inspirationMeta}>STYLE INSPIRATION</Text>
            </View>
          ))}
        </ScrollView>
      ) : null}

      <View style={styles.reminderCard}>
        <View style={styles.reminderIcon}><Text style={styles.reminderIconText}>◷</Text></View>
        <View style={styles.reminderCopy}>
          <Text style={styles.reminderTitle}>A little reminder for tomorrow</Text>
          <Text style={styles.reminderText}>Set a gentle 8 PM notification to plan your next outfit. Tap it to open Outfit Studio.</Text>
        </View>
        <Pressable
          onPress={toggleReminder}
          disabled={reminderBusy}
          style={[styles.reminderButton, reminderEnabled && styles.reminderButtonOn]}
        >
          <Text style={[styles.reminderButtonText, reminderEnabled && styles.reminderButtonTextOn]}>
            {reminderBusy ? "…" : reminderEnabled ? "ON" : "SET"}
          </Text>
        </Pressable>
      </View>

      <Text style={styles.footerNote}>STYLEMATE  /  MAKE MORE OF WHAT YOU HAVE.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#FFFFFF" },
  content: { paddingHorizontal: 18, paddingTop: 18, paddingBottom: 38 },
  topBar: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  brand: { color: "#141414", fontSize: 20, fontWeight: "900", letterSpacing: 2.2 },
  brandSub: { color: "#8B8179", fontSize: 7, fontWeight: "800", letterSpacing: 1.5, marginTop: 4 },
  headerActions: { flexDirection: "row", alignItems: "center", gap: 9 },
  avatar: { height: 38, width: 38, borderRadius: 19, backgroundColor: "#EDE8E2", alignItems: "center", justifyContent: "center" },
  avatarText: { color: "#171717", fontSize: 14, fontWeight: "900" },
  logoutButton: { borderWidth: 1, borderColor: "#D8D1CB", borderRadius: 18, paddingHorizontal: 10, paddingVertical: 8 },
  logoutText: { color: "#6F6862", fontSize: 7, fontWeight: "900", letterSpacing: 0.8 },
  intro: { marginTop: 31, marginBottom: 20 },
  eyebrow: { color: "#9A7864", fontSize: 8, fontWeight: "900", letterSpacing: 1.6 },
  greeting: { color: "#171717", fontSize: 14, fontWeight: "700", marginTop: 10 },
  headline: { color: "#171717", fontSize: 40, lineHeight: 43, fontWeight: "900", letterSpacing: -1.7, marginTop: 7 },
  description: { color: "#6F6B67", fontSize: 12, lineHeight: 18, marginTop: 10, maxWidth: 315 },
  heroCard: { borderRadius: 22, padding: 11, borderWidth: 1, borderColor: "#E8E4E0", backgroundColor: "#FFFFFF", marginBottom: 29 },
  heroTopline: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 3, paddingBottom: 10 },
  heroKicker: { color: "#6F6862", fontSize: 8, fontWeight: "900", letterSpacing: 1.2 },
  heroIndex: { color: "#9A7864", fontSize: 8, fontWeight: "900", letterSpacing: 1 },
  heroPhoto: { width: "100%", aspectRatio: 2 / 3, borderRadius: 15, overflow: "hidden", backgroundColor: "#EAE5DF" },
  heroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.14)" },
  heroImageCopy: { position: "absolute", left: 18, right: 16, bottom: 20 },
  heroImageKicker: { color: "#FFFFFF", fontSize: 8, fontWeight: "900", letterSpacing: 1.6 },
  heroImageTitle: { color: "#FFFFFF", fontSize: 35, lineHeight: 37, fontWeight: "900", letterSpacing: -1.4, marginTop: 8 },
  heroImageText: { color: "#FFFFFF", fontSize: 10, lineHeight: 15, marginTop: 8, maxWidth: 220 },
  heroFooter: { flexDirection: "row", alignItems: "center", paddingHorizontal: 3, paddingTop: 14 },
  heroFooterTitle: { color: "#171717", fontSize: 12, fontWeight: "900" },
  heroFooterText: { color: "#77716B", fontSize: 9, lineHeight: 14, marginTop: 4, paddingRight: 8 },
  roundButton: { width: 36, height: 36, borderRadius: 18, backgroundColor: "#F0ECE8", alignItems: "center", justifyContent: "center" },
  roundButtonText: { color: "#171717", fontSize: 18, fontWeight: "700" },
  primaryButton: { minHeight: 49, backgroundColor: "#171717", borderRadius: RADIUS.pill, paddingHorizontal: 17, flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 13 },
  primaryButtonText: { color: "#FFFFFF", fontSize: 11, fontWeight: "900" },
  primaryButtonArrow: { color: "#FFFFFF", fontSize: 19 },
  sectionHeading: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 12 },
  sectionTitleWrap: { flex: 1 },
  sectionEyebrow: { color: "#9A7864", fontSize: 7, fontWeight: "900", letterSpacing: 1.4, marginBottom: 5 },
  sectionTitle: { color: "#171717", fontSize: 18, fontWeight: "900", letterSpacing: -0.5 },
  sectionAction: { color: "#77716B", fontSize: 8, fontWeight: "900", letterSpacing: 0.8 },
  statsRow: { flexDirection: "row", gap: 8, marginBottom: 23 },
  statCard: { flex: 1, minHeight: 78, borderRadius: 14, backgroundColor: "#F0ECE8", padding: 11, justifyContent: "space-between" },
  statCardDark: { backgroundColor: "#171717" },
  statValue: { color: "#171717", fontSize: 22, fontWeight: "900" },
  statLabel: { color: "#6F6862", fontSize: 8, fontWeight: "800" },
  white: { color: "#FFFFFF" },
  statLabelDark: { color: "#D0C9C2" },
  aboutCard: { backgroundColor: "#F5F2EF", borderRadius: 19, padding: 18, marginBottom: 27 },
  aboutKicker: { color: "#92745F", fontSize: 7, fontWeight: "900", letterSpacing: 1.5 },
  aboutTitle: { color: "#171717", fontSize: 22, lineHeight: 26, fontWeight: "900", letterSpacing: -0.7, marginTop: 9 },
  aboutText: { color: "#6B655F", fontSize: 10, lineHeight: 16, marginTop: 8 },
  aboutFoot: { color: "#92745F", fontSize: 7, fontWeight: "900", letterSpacing: 1, marginTop: 14 },
  features: { borderTopWidth: 1, borderTopColor: "#E8E4E0", marginBottom: 27 },
  featureCard: { paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: "#E8E4E0", position: "relative", paddingRight: 32 },
  featureNumber: { color: "#A08774", fontSize: 8, fontWeight: "900", letterSpacing: 1 },
  featureTitle: { color: "#171717", fontSize: 13, fontWeight: "900", marginTop: 6 },
  featureText: { color: "#77716B", fontSize: 9, lineHeight: 14, marginTop: 4 },
  featureArrow: { position: "absolute", right: 3, top: 22, color: "#171717", fontSize: 18 },
  feedDescription: { color: "#77716B", fontSize: 9, lineHeight: 14, marginTop: -3, marginBottom: 12 },
  feedMessage: { minHeight: 92, alignItems: "center", justifyContent: "center", backgroundColor: "#F7F5F3", borderRadius: 15, gap: 8 },
  messageText: { color: "#77716B", fontSize: 9 },
  errorCard: { padding: 15, borderRadius: 15, backgroundColor: "#F8F4F1", borderWidth: 1, borderColor: "#E9DDD4" },
  errorTitle: { color: "#171717", fontSize: 11, fontWeight: "900" },
  errorText: { color: "#77716B", fontSize: 9, lineHeight: 14, marginTop: 5 },
  retryButton: { alignSelf: "flex-start", backgroundColor: "#171717", borderRadius: 20, paddingHorizontal: 12, paddingVertical: 8, marginTop: 10 },
  retryText: { color: "#FFFFFF", fontSize: 8, fontWeight: "900" },
  inspirationRow: { gap: 10, paddingBottom: 3 },
  inspirationCard: { width: 140, backgroundColor: "#FFFFFF", borderRadius: 14, borderWidth: 1, borderColor: "#E8E4E0", padding: 7 },
  inspirationImage: { width: "100%", height: 145, borderRadius: 9, backgroundColor: "#F0ECE8" },
  inspirationName: { color: "#171717", fontSize: 9, fontWeight: "800", lineHeight: 13, marginTop: 7 },
  inspirationMeta: { color: "#8B8179", fontSize: 7, fontWeight: "900", letterSpacing: 0.7, marginTop: 5 },
  reminderCard: { flexDirection: "row", alignItems: "center", gap: 9, backgroundColor: "#F5F2EF", borderRadius: 15, padding: 12, marginTop: 23 },
  reminderIcon: { width: 31, height: 31, backgroundColor: "#FFFFFF", borderRadius: 16, alignItems: "center", justifyContent: "center" },
  reminderIconText: { fontSize: 17, color: "#171717" },
  reminderCopy: { flex: 1 },
  reminderTitle: { color: "#171717", fontSize: 9, fontWeight: "900" },
  reminderText: { color: "#77716B", fontSize: 7, lineHeight: 11, marginTop: 3 },
  reminderButton: { borderRadius: 18, backgroundColor: "#171717", paddingHorizontal: 11, paddingVertical: 8 },
  reminderButtonOn: { backgroundColor: "#DDE9DF" },
  reminderButtonText: { color: "#FFFFFF", fontSize: 8, fontWeight: "900" },
  reminderButtonTextOn: { color: "#315B3D" },
  footerNote: { textAlign: "center", color: "#948A81", fontSize: 7, fontWeight: "900", letterSpacing: 1.1, marginTop: 23 },
});
