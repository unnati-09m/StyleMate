import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  AppState,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { COLORS, RADIUS } from "../constants/theme";
import { EDITORIAL_IMAGES } from "../constants/editorialImages";
import EditorialImage from "../components/EditorialImage";
import { getWardrobeItems } from "../utils/wardrobeStorage";
import { buildOutfit } from "../utils/outfitRules";

const OCCASIONS = ["Casual", "College", "Formal", "Party"];
const SEASONS = ["All season", "Summer", "Winter", "Monsoon"];

function FilterGroup({ title, options, selected, onSelect }) {
  return (
    <View style={styles.filterGroup}>
      <Text style={styles.filterTitle}>{title}</Text>
      <View style={styles.chips}>
        {options.map((option) => (
          <Pressable
            key={option}
            onPress={() => onSelect(option)}
            style={[styles.chip, selected === option && styles.chipSelected]}
          >
            <Text style={[styles.chipText, selected === option && styles.chipTextSelected]}>
              {option}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

export default function OutfitStudioScreen() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [occasion, setOccasion] = useState("Casual");
  const [season, setSeason] = useState("All season");
  const [generatedLook, setGeneratedLook] = useState(null);
  const [actionStatus, setActionStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useFocusEffect(
    useCallback(() => {
      let active = true;

      async function loadWardrobe() {
        try {
          const savedItems = await getWardrobeItems();
          if (active) setItems(savedItems);
        } catch (error) {
          if (active) setErrorMessage("Your wardrobe could not be opened. Please try again.");
        } finally {
          if (active) setLoading(false);
        }
      }

      loadWardrobe();

      const appStateSubscription = AppState.addEventListener("change", (state) => {
        if (state === "active") loadWardrobe();
      });

      return () => {
        active = false;
        appStateSubscription.remove();
      };
    }, [])
  );

  async function generateLook() {
    setActionStatus("generating");
    setErrorMessage("");
    setGeneratedLook(null);

    try {
      const latestItems = await getWardrobeItems();
      setItems(latestItems);

      const nextLook = buildOutfit(latestItems, occasion, season);
      if (!nextLook) {
        setActionStatus("failed");
        setErrorMessage(
          "We need a dress, or both a top and a bottom that match these filters. Add the missing pieces or choose another occasion."
        );
        return;
      }

      setGeneratedLook(nextLook);
      setActionStatus("success");
    } catch (error) {
      console.error("Outfit generation failed:", error);
      setActionStatus("failed");
      setErrorMessage("We couldn't build your outfit this time. Check your saved wardrobe and try again.");
    }
  }

  function viewLook() {
    if (!generatedLook) return;
    router.push({
      pathname: "/look-details",
      params: { look: JSON.stringify(generatedLook) },
    });
  }

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>←  BACK</Text>
        </Pressable>

        <View style={styles.editorialHero}>
          <EditorialImage source={EDITORIAL_IMAGES.studio} style={StyleSheet.absoluteFill} fallbackLabel="Minimalist black suit fashion editorial" />
          <View style={styles.editorialShade} />
          <View style={styles.editorialCopy}>
            <Text style={styles.editorialKicker}>THE OUTFIT ROOM</Text>
            <Text style={styles.editorialTitle}>One wardrobe.{"\n"}A hundred ways to wear it.</Text>
          </View>
        </View>
        <Text style={styles.title}>Let's put a look together.</Text>
        <Text style={styles.description}>
          Pick the moment and the season. StyleMate will combine pieces you have already added.
        </Text>

        <View style={styles.wardrobeCount}>
          <View style={styles.countDot} />
          <Text style={styles.countText}>
            {loading ? "Opening your wardrobe…" : items.length + " pieces available in your wardrobe"}
          </Text>
          <Pressable onPress={() => router.push("/wardrobe")}>
            <Text style={styles.editText}>EDIT</Text>
          </Pressable>
        </View>

        <View style={styles.filterCard}>
          <FilterGroup title="01  /  WHERE ARE YOU GOING?" options={OCCASIONS} selected={occasion} onSelect={(value) => { setOccasion(value); setGeneratedLook(null); setActionStatus("idle"); }} />
          <View style={styles.divider} />
          <FilterGroup title="02  /  WHICH SEASON?" options={SEASONS} selected={season} onSelect={(value) => { setSeason(value); setGeneratedLook(null); setActionStatus("idle"); }} />
        </View>

        <View style={styles.noteCard}>
          <Text style={styles.noteMark}>✳</Text>
          <View style={styles.noteCopy}>
            <Text style={styles.noteTitle}>A simple styling rule.</Text>
            <Text style={styles.noteText}>
              We match your selected occasion and season, then pair a dress or a top and bottom. Shoes and accessories are added when available.
            </Text>
          </View>
        </View>

        {actionStatus === "generating" ? (
          <View style={styles.statusCard}>
            <ActivityIndicator color={COLORS.text} />
            <Text style={styles.statusText}>Looking through your wardrobe…</Text>
          </View>
        ) : null}

        {actionStatus === "failed" ? (
          <View style={styles.errorCard}>
            <Text style={styles.errorTitle}>We couldn't make this look yet.</Text>
            <Text style={styles.errorText}>{errorMessage}</Text>
            <Pressable onPress={() => router.push("/wardrobe")}>
              <Text style={styles.errorLink}>Add or update clothing  →</Text>
            </Pressable>
          </View>
        ) : null}

        {actionStatus === "success" && generatedLook ? (
          <View style={styles.successCard}>
            <View style={styles.successTop}>
              <Text style={styles.successKicker}>YOUR LOOK IS READY</Text>
              <Text style={styles.successCheck}>✓</Text>
            </View>
            <Text style={styles.successTitle}>{generatedLook.title}</Text>
            <Text style={styles.successText}>
              {generatedLook.items.length} pieces selected for {occasion.toLowerCase()}.
              Save it for later or mark it as worn from the next screen.
            </Text>
            <View style={styles.pieceList}>
              {generatedLook.items.map((item) => (
                <View key={item.id} style={styles.pieceRow}>
                  <View style={styles.pieceDot} />
                  <Text style={styles.pieceName}>{item.name}</Text>
                  <Text style={styles.pieceCategory}>{item.category}</Text>
                </View>
              ))}
            </View>
            <Pressable style={styles.viewButton} onPress={viewLook}>
              <Text style={styles.viewButtonText}>View and save this look  →</Text>
            </Pressable>
          </View>
        ) : null}
      </ScrollView>

      <View style={styles.bottomBar}>
        <View style={styles.bottomCopy}>
          <Text style={styles.bottomTitle}>A look made from your own clothes.</Text>
          <Text style={styles.bottomSub}>No AI. Just simple styling rules.</Text>
        </View>
        <Pressable
          style={[styles.generateButton, actionStatus === "generating" && styles.disabledButton]}
          onPress={generateLook}
          disabled={loading || actionStatus === "generating"}
        >
          <Text style={styles.generateText}>{actionStatus === "generating" ? "Building…" : "Build my look  →"}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  content: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 24 },
  editorialHero: { width: "100%", aspectRatio: 2 / 3, borderRadius: 17, overflow: "hidden", backgroundColor: "#EAE5DF", marginTop: 15, justifyContent: "flex-end" },
  editorialShade: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.2)" },
  editorialCopy: { padding: 18 },
  editorialKicker: { color: "#FFFFFF", fontSize: 8, fontWeight: "900", letterSpacing: 1.4 },
  editorialTitle: { color: "#FFFFFF", fontSize: 30, lineHeight: 33, fontWeight: "900", letterSpacing: -1, marginTop: 8 },
  backButton: { alignSelf: "flex-start", paddingVertical: 8, paddingRight: 15 },
  backText: { color: COLORS.textMuted, fontSize: 8, fontWeight: "900", letterSpacing: 1 },
  eyebrow: { color: "#9A7864", fontSize: 8, fontWeight: "900", letterSpacing: 1.5, marginTop: 18 },
  title: { color: COLORS.text, fontSize: 32, lineHeight: 36, fontWeight: "900", letterSpacing: -1.1, marginTop: 8 },
  description: { color: COLORS.textMuted, fontSize: 11, lineHeight: 17, marginTop: 9 },
  wardrobeCount: { flexDirection: "row", alignItems: "center", paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: COLORS.border, marginTop: 19 },
  countDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: "#6D8A72", marginRight: 8 },
  countText: { color: COLORS.textMuted, fontSize: 9, flex: 1 },
  editText: { color: COLORS.text, fontSize: 8, fontWeight: "900", letterSpacing: 0.8 },
  filterCard: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 19, padding: 16, marginTop: 18, backgroundColor: "#FFFFFF" },
  filterGroup: { gap: 11 },
  filterTitle: { color: COLORS.textMuted, fontSize: 8, fontWeight: "900", letterSpacing: 1 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 7 },
  chip: { paddingHorizontal: 13, paddingVertical: 9, borderRadius: RADIUS.pill, borderWidth: 1, borderColor: COLORS.border, backgroundColor: "#FFFFFF" },
  chipSelected: { backgroundColor: COLORS.text, borderColor: COLORS.text },
  chipText: { color: COLORS.textMuted, fontSize: 9, fontWeight: "700" },
  chipTextSelected: { color: "#FFFFFF" },
  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: 17 },
  noteCard: { flexDirection: "row", backgroundColor: "#F1EEEB", padding: 15, borderRadius: 16, marginTop: 16, gap: 11 },
  noteMark: { color: "#9A7864", fontSize: 22 },
  noteCopy: { flex: 1 },
  noteTitle: { color: COLORS.text, fontSize: 10, fontWeight: "900" },
  noteText: { color: COLORS.textMuted, fontSize: 9, lineHeight: 14, marginTop: 4 },
  statusCard: { minHeight: 75, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, backgroundColor: "#F7F5F3", borderRadius: 16, marginTop: 17 },
  statusText: { color: COLORS.textMuted, fontSize: 10, fontWeight: "700" },
  errorCard: { backgroundColor: "#F8F1ED", borderRadius: 16, padding: 15, marginTop: 17, borderWidth: 1, borderColor: "#E8D9D0" },
  errorTitle: { color: COLORS.text, fontSize: 11, fontWeight: "900" },
  errorText: { color: COLORS.textMuted, fontSize: 9, lineHeight: 15, marginTop: 5 },
  errorLink: { color: COLORS.text, fontSize: 9, fontWeight: "900", marginTop: 10 },
  successCard: { borderRadius: 18, borderWidth: 1, borderColor: "#CADBCB", backgroundColor: "#F3F7F2", padding: 16, marginTop: 17 },
  successTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  successKicker: { color: "#52765A", fontSize: 8, fontWeight: "900", letterSpacing: 1.2 },
  successCheck: { color: "#52765A", fontSize: 17, fontWeight: "900" },
  successTitle: { color: COLORS.text, fontSize: 20, fontWeight: "900", marginTop: 8 },
  successText: { color: COLORS.textMuted, fontSize: 9, lineHeight: 15, marginTop: 5 },
  pieceList: { borderTopWidth: 1, borderTopColor: "#DCE7DB", marginTop: 12, paddingTop: 6 },
  pieceRow: { flexDirection: "row", alignItems: "center", paddingVertical: 7 },
  pieceDot: { height: 6, width: 6, borderRadius: 3, backgroundColor: "#718A75", marginRight: 8 },
  pieceName: { color: COLORS.text, fontSize: 9, fontWeight: "800", flex: 1 },
  pieceCategory: { color: COLORS.textMuted, fontSize: 8 },
  viewButton: { borderRadius: RADIUS.pill, backgroundColor: COLORS.text, paddingHorizontal: 15, paddingVertical: 12, alignItems: "center", marginTop: 12 },
  viewButtonText: { color: "#FFFFFF", fontSize: 9, fontWeight: "900" },
  bottomBar: { flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 17, paddingVertical: 12, backgroundColor: "#FFFFFF", borderTopWidth: 1, borderTopColor: COLORS.border, paddingBottom: 18 },
  bottomCopy: { flex: 1 },
  bottomTitle: { color: COLORS.text, fontSize: 9, fontWeight: "900" },
  bottomSub: { color: COLORS.textMuted, fontSize: 8, marginTop: 3 },
  generateButton: { backgroundColor: COLORS.text, borderRadius: RADIUS.pill, paddingHorizontal: 17, paddingVertical: 14 },
  generateText: { color: "#FFFFFF", fontSize: 9, fontWeight: "900" },
  disabledButton: { opacity: 0.55 },
});
