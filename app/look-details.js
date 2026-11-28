import { useMemo, useState } from "react";
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, RADIUS } from "../constants/theme";
import { addFavouriteLook, addWearHistory } from "../utils/styleStorage";

function readLook(value) {
  try {
    const parsed = Array.isArray(value) ? value[0] : value;
    return parsed ? JSON.parse(parsed) : null;
  } catch (error) {
    return null;
  }
}

function getColor(color) {
  const value = (color || "").toLowerCase();
  if (value.includes("white")) return "#EAE7E2";
  if (value.includes("black")) return "#242424";
  if (value.includes("blue")) return "#8FA6BA";
  if (value.includes("pink")) return "#DAB6BA";
  if (value.includes("green")) return "#A8B9A5";
  if (value.includes("red")) return "#B87972";
  if (value.includes("yellow")) return "#E1D19A";
  if (value.includes("brown") || value.includes("beige")) return "#CBB8A5";
  return "#D9D2CB";
}

function ClothingCard({ item, index }) {
  return (
    <View style={styles.clothingCard}>
      <View style={[styles.clothingVisual, { backgroundColor: getColor(item.color) }]}>
        {item.imageUri ? (
          <Image source={{ uri: item.imageUri }} style={styles.clothingImage} />
        ) : (
          <Text style={styles.clothingMark}>{index + 1}</Text>
        )}
      </View>
      <View style={styles.clothingCopy}>
        <Text style={styles.clothingCategory}>{item.category?.toUpperCase()}</Text>
        <Text style={styles.clothingName}>{item.name}</Text>
        <Text style={styles.clothingMeta}>{item.color}  ·  {item.season}</Text>
      </View>
    </View>
  );
}

export default function LookDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const look = useMemo(() => readLook(params.look), [params.look]);
  const [actionStatus, setActionStatus] = useState("idle");

  async function saveLook() {
    if (!look) return;

    try {
      setActionStatus("saving");
      const added = await addFavouriteLook(look);
      setActionStatus(added ? "saved" : "already-saved");
    } catch (error) {
      console.error("Saving a favourite failed:", error);
      setActionStatus("failed");
      Alert.alert("Couldn't save this look", "Your wardrobe is unchanged. Please try again.");
    }
  }

  async function markAsWorn() {
    if (!look) return;

    try {
      setActionStatus("saving");
      const added = await addWearHistory(look);
      setActionStatus(added ? "worn" : "already-worn");
    } catch (error) {
      console.error("Saving outfit history failed:", error);
      setActionStatus("failed");
      Alert.alert("Couldn't update your history", "Please try again.");
    }
  }

  if (!look || !Array.isArray(look.items)) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <View style={styles.screen}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>←  BACK</Text>
        </Pressable>
        <View style={styles.invalidCard}>
          <Text style={styles.invalidTitle}>This outfit could not be opened.</Text>
          <Text style={styles.invalidText}>Go back and create or open another look.</Text>
        </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>←  BACK</Text>
        </Pressable>

        <Text style={styles.eyebrow}>YOUR PERSONAL STYLE EDIT</Text>
        <Text style={styles.title}>{look.title || "Your outfit."}</Text>
        <Text style={styles.description}>
          {look.occasion || "Everyday"}  ·  {look.season || "All season"}  ·  {look.items.length} pieces
        </Text>

        <View style={styles.lookBanner}>
          <Text style={styles.bannerKicker}>STYLEMATE / LOOK DETAIL</Text>
          <Text style={styles.bannerTitle}>Made from pieces you already own.</Text>
          <Text style={styles.bannerText}>A simple combination, ready whenever you are.</Text>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>The pieces</Text>
          <Text style={styles.pieceCount}>{look.items.length} ITEMS</Text>
        </View>

        {look.items.map((item, index) => (
          <ClothingCard key={item.id || String(index)} item={item} index={index} />
        ))}

        {actionStatus !== "idle" ? (
          <View style={[
            styles.statusBox,
            (actionStatus === "saved" || actionStatus === "worn") && styles.statusSuccess,
            actionStatus === "failed" && styles.statusError,
          ]}>
            <Text style={styles.statusText}>
              {actionStatus === "saving" ? "Saving your update…" :
                actionStatus === "saved" ? "Saved to your favourites." :
                  actionStatus === "already-saved" ? "This look is already in your favourites." :
                    actionStatus === "worn" ? "Added to your outfit history." :
                      actionStatus === "already-worn" ? "This look is already in today's history." :
                        "Something went wrong. Please try again."}
            </Text>
          </View>
        ) : null}
      </ScrollView>

      <View style={styles.bottomBar}>
        <Pressable
          style={styles.secondaryButton}
          onPress={saveLook}
          disabled={actionStatus === "saving"}
        >
          <Text style={styles.secondaryButtonText}>♡  Save look</Text>
        </Pressable>
        <Pressable
          style={styles.primaryButton}
          onPress={markAsWorn}
          disabled={actionStatus === "saving"}
        >
          <Text style={styles.primaryButtonText}>Mark as worn  →</Text>
        </Pressable>
      </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  screen: { flex: 1, backgroundColor: COLORS.background },
  content: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 25 },
  backButton: { alignSelf: "flex-start", paddingVertical: 8, paddingRight: 15 },
  backText: { color: COLORS.textMuted, fontSize: 8, fontWeight: "900", letterSpacing: 1 },
  eyebrow: { color: "#9A7864", fontSize: 8, fontWeight: "900", letterSpacing: 1.5, marginTop: 19 },
  title: { color: COLORS.text, fontSize: 31, lineHeight: 36, fontWeight: "900", letterSpacing: -1, marginTop: 7 },
  description: { color: COLORS.textMuted, fontSize: 10, marginTop: 8 },
  lookBanner: { backgroundColor: "#1A1A1A", padding: 18, borderRadius: 19, marginTop: 20 },
  bannerKicker: { color: "#D3C5B9", fontSize: 8, fontWeight: "900", letterSpacing: 1.3 },
  bannerTitle: { color: "#FFFFFF", fontSize: 21, lineHeight: 25, fontWeight: "900", marginTop: 10, maxWidth: 260 },
  bannerText: { color: "#C8C1BA", fontSize: 9, marginTop: 6 },
  sectionHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 25, marginBottom: 12 },
  sectionTitle: { color: COLORS.text, fontSize: 15, fontWeight: "900" },
  pieceCount: { color: COLORS.textMuted, fontSize: 8, fontWeight: "900", letterSpacing: 0.8 },
  clothingCard: { flexDirection: "row", borderWidth: 1, borderColor: COLORS.border, borderRadius: 15, padding: 8, marginBottom: 9, backgroundColor: "#FFFFFF", gap: 12, alignItems: "center" },
  clothingVisual: { width: 80, height: 89, borderRadius: 10, overflow: "hidden", alignItems: "center", justifyContent: "center" },
  clothingImage: { width: "100%", height: "100%", resizeMode: "cover" },
  clothingMark: { color: "rgba(0,0,0,0.45)", fontSize: 25, fontWeight: "900" },
  clothingCopy: { flex: 1 },
  clothingCategory: { color: "#9A7864", fontSize: 7, fontWeight: "900", letterSpacing: 1 },
  clothingName: { color: COLORS.text, fontSize: 12, fontWeight: "900", marginTop: 6 },
  clothingMeta: { color: COLORS.textMuted, fontSize: 9, marginTop: 5 },
  statusBox: { borderRadius: 12, backgroundColor: "#F3F0ED", padding: 12, marginTop: 10 },
  statusSuccess: { backgroundColor: "#EFF5EF" },
  statusError: { backgroundColor: "#F8F0EC" },
  statusText: { color: COLORS.text, fontSize: 9, fontWeight: "800", textAlign: "center" },
  bottomBar: { flexDirection: "row", gap: 9, paddingHorizontal: 16, paddingTop: 11, paddingBottom: 18, backgroundColor: "#FFFFFF", borderTopWidth: 1, borderTopColor: COLORS.border },
  secondaryButton: { flex: 1, minHeight: 48, borderRadius: RADIUS.pill, borderWidth: 1, borderColor: COLORS.border, alignItems: "center", justifyContent: "center" },
  secondaryButtonText: { color: COLORS.text, fontSize: 9, fontWeight: "900" },
  primaryButton: { flex: 1.3, minHeight: 48, borderRadius: RADIUS.pill, backgroundColor: COLORS.text, alignItems: "center", justifyContent: "center" },
  primaryButtonText: { color: "#FFFFFF", fontSize: 9, fontWeight: "900" },
  invalidCard: { backgroundColor: "#F7F5F3", borderRadius: 16, padding: 18, marginTop: 25 },
  invalidTitle: { color: COLORS.text, fontSize: 13, fontWeight: "900" },
  invalidText: { color: COLORS.textMuted, fontSize: 10, marginTop: 6 },
});
