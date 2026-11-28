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
import { COLORS, RADIUS, SPACING } from "../../constants/theme";
import { getWardrobeItems } from "../../utils/wardrobeStorage";
import { getFavouriteLooks, getWearHistory } from "../../utils/styleStorage";
import { disableDailyReminder, enableDailyReminder, isDailyReminderEnabled } from "../../utils/reminders";

const INSPIRATION_URL = "https://dummyjson.com/products/category/tops?limit=5";

function SectionHeading({ title, eyebrow, action, onAction }) {
  return (
    <View style={styles.sectionHeading}>
      <View>
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

function StatCard({ number, label, caption, onPress, dark }) {
  return (
    <Pressable onPress={onPress} style={[styles.statCard, dark && styles.statCardDark]}>
      <Text style={[styles.statNumber, dark && styles.whiteText]}>{number}</Text>
      <Text style={[styles.statLabel, dark && styles.lightText]}>{label}</Text>
      <Text style={[styles.statCaption, dark && styles.lightText]}>{caption}</Text>
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
      setStats({
        pieces: wardrobe.length,
        saved: favourites.length,
        worn: history.length,
      });
    } catch (error) {
      console.warn("Could not refresh your StyleMate home:", error);
    }
  }, []);

  const loadInspiration = useCallback(async () => {
    setInspirationState("loading");

    try {
      const response = await fetch(INSPIRATION_URL);
      if (!response.ok) {
        throw new Error("The inspiration feed is unavailable.");
      }

      const data = await response.json();
      setInspiration(Array.isArray(data.products) ? data.products : []);
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

    const appStateSubscription = AppState.addEventListener("change", (nextState) => {
      if (nextState === "active") {
        loadSummary();
        isDailyReminderEnabled().then(setReminderEnabled).catch(() => setReminderEnabled(false));
      }
    });

    return () => appStateSubscription.remove();
  }, [loadSummary, loadInspiration]);

  async function toggleReminder() {
    try {
      setReminderBusy(true);

      if (reminderEnabled) {
        await disableDailyReminder();
        setReminderEnabled(false);
        Alert.alert("Reminder turned off", "You will not receive the daily outfit reminder.");
      } else {
        const result = await enableDailyReminder();

        if (!result.granted) {
          Alert.alert(
            "Notifications are off",
            "That is okay. You can still use StyleMate anytime. Allow notifications in your device settings when you are ready."
          );
          return;
        }

        setReminderEnabled(true);
        Alert.alert(
          result.alreadyEnabled ? "Reminder is already on" : "Your reminder is set",
          "StyleMate will remind you every day at 8:00 PM to plan tomorrow's outfit."
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
          <Text style={styles.brandSub}>YOUR PERSONAL WARDROBE</Text>
        </View>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{profileName.charAt(0).toUpperCase()}</Text>
        </View>
      </View>

      <View style={styles.greetingBlock}>
        <Text style={styles.eyebrow}>A LITTLE STYLE, EVERY DAY</Text>
        <Text style={styles.greeting}>Hello, {profileName}.</Text>
        <Text style={styles.headline}>Get dressed with{"\n"}a little more ease.</Text>
        <Text style={styles.description}>Your clothes, your combinations, your kind of style.</Text>
      </View>

      <View style={styles.heroCard}>
        <View style={styles.heroTop}>
          <Text style={styles.heroKicker}>THE STYLE EDIT  /  001</Text>
          <Text style={styles.heroDot}>●  PERSONAL</Text>
        </View>
        <View style={styles.heroArtwork}>
          <View style={styles.artCircleOne} />
          <View style={styles.artCircleTwo} />
          <View style={styles.artLine} />
          <View style={styles.artTextBlock}>
            <Text style={styles.artSmall}>LESS OUTFIT STRESS</Text>
            <Text style={styles.artTitle}>More looks.{"\n"}More you.</Text>
            <Text style={styles.artNote}>A good outfit is already in your wardrobe.</Text>
          </View>
          <Text style={styles.artNumber}>SM / 26</Text>
        </View>
        <View style={styles.heroFooter}>
          <View style={{ flex: 1 }}>
            <Text style={styles.heroFooterTitle}>Your next favourite outfit is waiting.</Text>
            <Text style={styles.heroFooterText}>Mix the pieces you own into a look that feels right.</Text>
          </View>
          <Pressable style={styles.roundArrow} onPress={() => router.push("/outfit-studio")}>
            <Text style={styles.roundArrowText}>↗</Text>
          </Pressable>
        </View>
        <Pressable style={styles.primaryButton} onPress={() => router.push("/outfit-studio")}>
          <Text style={styles.primaryButtonText}>Build an outfit</Text>
          <Text style={styles.primaryArrow}>→</Text>
        </Pressable>
      </View>

      <SectionHeading title="Your style, at a glance" eyebrow="THE COLLECTION" action="WARDROBE" onAction={() => router.push("/wardrobe")} />
      <View style={styles.statsRow}>
        <StatCard number={stats.pieces} label="Pieces" caption="In your closet" onPress={() => router.push("/wardrobe")} />
        <StatCard number={stats.saved} label="Saved" caption="Looks you love" onPress={() => router.push("/favourites")} dark />
        <StatCard number={stats.worn} label="Worn" caption="Outfit journal" onPress={() => router.push("/history")} />
      </View>

      <View style={styles.quickLinks}>
        <Pressable style={styles.quickLink} onPress={() => router.push("/wardrobe")}>
          <Text style={styles.quickIcon}>＋</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.quickTitle}>Add a clothing piece</Text>
            <Text style={styles.quickText}>Keep your wardrobe up to date</Text>
          </View>
          <Text style={styles.quickArrow}>→</Text>
        </Pressable>
        <Pressable style={styles.quickLink} onPress={() => router.push("/favourites")}>
          <Text style={styles.quickIcon}>♡</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.quickTitle}>Your saved outfits</Text>
            <Text style={styles.quickText}>Come back to combinations you love</Text>
          </View>
          <Text style={styles.quickArrow}>→</Text>
        </Pressable>
      </View>

      <SectionHeading title="A little inspiration" eyebrow="FROM THE STYLE FEED" />
      <Text style={styles.sectionDescription}>A few clothing ideas from our online inspiration feed.</Text>

      {inspirationState === "loading" ? (
        <View style={styles.feedMessage}>
          <ActivityIndicator color={COLORS.text} />
          <Text style={styles.messageText}>Finding a little inspiration…</Text>
        </View>
      ) : null}

      {inspirationState === "error" ? (
        <View style={styles.errorCard}>
          <Text style={styles.errorTitle}>The style feed couldn't load.</Text>
          <Text style={styles.errorText}>Check your internet connection and try again. Your saved wardrobe still works offline.</Text>
          <Pressable style={styles.retryButton} onPress={loadInspiration}>
            <Text style={styles.retryText}>Try again  ↻</Text>
          </Pressable>
        </View>
      ) : null}

      {inspirationState === "ready" ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.inspirationRow}>
          {inspiration.map((item) => (
            <View key={String(item.id)} style={styles.inspirationCard}>
              <Image source={{ uri: item.thumbnail }} style={styles.inspirationImage} />
              <Text style={styles.inspirationName} numberOfLines={2}>{item.title}</Text>
              <Text style={styles.inspirationMeta}>STYLE INSPIRATION</Text>
            </View>
          ))}
        </ScrollView>
      ) : null}

      <View style={styles.reminderCard}>
        <View style={styles.reminderIcon}><Text style={styles.reminderIconText}>◷</Text></View>
        <View style={styles.reminderCopy}>
          <Text style={styles.reminderTitle}>A reminder to plan ahead</Text>
          <Text style={styles.reminderText}>Get a gentle 8 PM reminder to plan tomorrow's outfit. Tap it to open Outfit Studio.</Text>
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

      <Text style={styles.footerNote}>MADE TO MAKE EVERYDAY DRESSING EASIER.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  content: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 34 },
  topBar: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  brand: { color: COLORS.text, fontSize: 19, fontWeight: "900", letterSpacing: 2.1 },
  brandSub: { color: COLORS.textMuted, fontSize: 7, fontWeight: "800", letterSpacing: 1.5, marginTop: 4 },
  avatar: { height: 42, width: 42, borderRadius: 21, backgroundColor: "#EEEAE6", alignItems: "center", justifyContent: "center" },
  avatarText: { color: COLORS.text, fontSize: 15, fontWeight: "900" },
  greetingBlock: { marginTop: 32, marginBottom: 20 },
  eyebrow: { color: "#9A7864", fontSize: 9, fontWeight: "900", letterSpacing: 1.6 },
  greeting: { color: COLORS.text, fontSize: 15, fontWeight: "700", marginTop: 9 },
  headline: { color: COLORS.text, fontSize: 39, lineHeight: 42, fontWeight: "900", letterSpacing: -1.5, marginTop: 7 },
  description: { color: COLORS.textMuted, fontSize: 13, lineHeight: 19, marginTop: 10 },
  heroCard: { borderRadius: 25, padding: 14, borderWidth: 1, borderColor: COLORS.border, backgroundColor: "#FFFFFF", marginBottom: 27 },
  heroTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
  heroKicker: { color: COLORS.textMuted, fontSize: 8, fontWeight: "900", letterSpacing: 1.3 },
  heroDot: { color: "#9A7864", fontSize: 8, fontWeight: "900", letterSpacing: 0.7 },
  heroArtwork: { minHeight: 215, backgroundColor: "#E9E3DC", borderRadius: 18, overflow: "hidden", justifyContent: "center", padding: 20 },
  artCircleOne: { position: "absolute", width: 205, height: 205, borderRadius: 103, backgroundColor: "#D2C4B8", right: -52, top: -22 },
  artCircleTwo: { position: "absolute", width: 142, height: 142, borderRadius: 71, borderWidth: 1, borderColor: "rgba(255,255,255,0.7)", right: 4, bottom: -54 },
  artLine: { position: "absolute", width: 1, height: 270, backgroundColor: "rgba(255,255,255,0.55)", right: 86, top: -25, transform: [{ rotate: "28deg" }] },
  artTextBlock: { maxWidth: 240 },
  artSmall: { color: "#67564A", fontSize: 8, fontWeight: "900", letterSpacing: 1.6 },
  artTitle: { color: "#171717", fontSize: 37, lineHeight: 39, fontWeight: "900", letterSpacing: -1.5, marginTop: 10 },
  artNote: { color: "#64584F", fontSize: 11, lineHeight: 16, marginTop: 11, maxWidth: 180 },
  artNumber: { position: "absolute", bottom: 16, right: 16, color: "#6B5A4E", fontSize: 8, fontWeight: "900", letterSpacing: 1.5 },
  heroFooter: { flexDirection: "row", alignItems: "center", paddingHorizontal: 3, paddingTop: 15 },
  heroFooterTitle: { color: COLORS.text, fontSize: 13, fontWeight: "900" },
  heroFooterText: { color: COLORS.textMuted, fontSize: 10, lineHeight: 15, marginTop: 4, paddingRight: 8 },
  roundArrow: { width: 37, height: 37, borderRadius: 20, backgroundColor: "#F1EEEB", alignItems: "center", justifyContent: "center" },
  roundArrowText: { color: COLORS.text, fontSize: 19, fontWeight: "700" },
  primaryButton: { minHeight: 50, backgroundColor: COLORS.text, borderRadius: RADIUS.pill, paddingHorizontal: 18, flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 13 },
  primaryButtonText: { color: "#FFFFFF", fontSize: 12, fontWeight: "800" },
  primaryArrow: { color: "#FFFFFF", fontSize: 20 },
  sectionHeading: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 12 },
  sectionEyebrow: { color: "#9A7864", fontSize: 8, fontWeight: "900", letterSpacing: 1.4, marginBottom: 5 },
  sectionTitle: { color: COLORS.text, fontSize: 19, fontWeight: "900", letterSpacing: -0.5 },
  sectionAction: { color: COLORS.textMuted, fontSize: 9, fontWeight: "900", letterSpacing: 0.8 },
  statsRow: { flexDirection: "row", gap: 9, marginBottom: 15 },
  statCard: { flex: 1, minHeight: 104, borderRadius: 17, backgroundColor: "#F2EFEC", padding: 12, justifyContent: "space-between" },
  statCardDark: { backgroundColor: "#191919" },
  statNumber: { color: COLORS.text, fontSize: 24, fontWeight: "900" },
  statLabel: { color: COLORS.text, fontSize: 11, fontWeight: "900" },
  statCaption: { color: COLORS.textMuted, fontSize: 8, fontWeight: "600" },
  whiteText: { color: "#FFFFFF" },
  lightText: { color: "#D4CEC8" },
  quickLinks: { borderTopWidth: 1, borderTopColor: COLORS.border, marginBottom: 28 },
  quickLink: { flexDirection: "row", alignItems: "center", paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: COLORS.border, gap: 12 },
  quickIcon: { width: 34, height: 34, borderRadius: 17, backgroundColor: "#F1EEEB", textAlign: "center", textAlignVertical: "center", lineHeight: 34, fontSize: 18, color: COLORS.text },
  quickTitle: { color: COLORS.text, fontSize: 11, fontWeight: "900" },
  quickText: { color: COLORS.textMuted, fontSize: 9, marginTop: 3 },
  quickArrow: { color: COLORS.textMuted, fontSize: 18 },
  sectionDescription: { color: COLORS.textMuted, fontSize: 11, lineHeight: 16, marginTop: -3, marginBottom: 12 },
  feedMessage: { minHeight: 105, alignItems: "center", justifyContent: "center", backgroundColor: "#F7F5F3", borderRadius: 18, gap: 9 },
  messageText: { color: COLORS.textMuted, fontSize: 10 },
  errorCard: { padding: 16, borderRadius: 18, backgroundColor: "#F8F4F1", borderWidth: 1, borderColor: "#E9DDD4" },
  errorTitle: { color: COLORS.text, fontSize: 12, fontWeight: "900" },
  errorText: { color: COLORS.textMuted, fontSize: 10, lineHeight: 15, marginTop: 5 },
  retryButton: { alignSelf: "flex-start", backgroundColor: COLORS.text, borderRadius: 20, paddingHorizontal: 13, paddingVertical: 8, marginTop: 10 },
  retryText: { color: "#FFFFFF", fontSize: 9, fontWeight: "900" },
  inspirationRow: { gap: 11, paddingBottom: 4 },
  inspirationCard: { width: 142, backgroundColor: "#FFFFFF", borderRadius: 16, borderWidth: 1, borderColor: COLORS.border, padding: 8 },
  inspirationImage: { width: "100%", height: 132, borderRadius: 11, backgroundColor: "#F1EEEB" },
  inspirationName: { color: COLORS.text, fontSize: 10, fontWeight: "800", lineHeight: 14, marginTop: 8 },
  inspirationMeta: { color: COLORS.textMuted, fontSize: 7, fontWeight: "900", letterSpacing: 0.8, marginTop: 5 },
  reminderCard: { flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: "#F5F2EF", borderRadius: 17, padding: 13, marginTop: 25 },
  reminderIcon: { width: 34, height: 34, backgroundColor: "#FFFFFF", borderRadius: 17, alignItems: "center", justifyContent: "center" },
  reminderIconText: { fontSize: 19, color: COLORS.text },
  reminderCopy: { flex: 1 },
  reminderTitle: { color: COLORS.text, fontSize: 10, fontWeight: "900" },
  reminderText: { color: COLORS.textMuted, fontSize: 8, lineHeight: 12, marginTop: 3 },
  reminderButton: { borderRadius: 18, backgroundColor: COLORS.text, paddingHorizontal: 12, paddingVertical: 8 },
  reminderButtonOn: { backgroundColor: "#E0EAE2" },
  reminderButtonText: { color: "#FFFFFF", fontSize: 8, fontWeight: "900" },
  reminderButtonTextOn: { color: "#315B3D" },
  footerNote: { textAlign: "center", color: COLORS.textMuted, fontSize: 7, fontWeight: "900", letterSpacing: 1.2, marginTop: 24 },
});
