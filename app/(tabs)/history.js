import { useCallback, useState } from "react";
import { FlatList, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { COLORS, RADIUS } from "../../constants/theme";
import { EDITORIAL_IMAGES } from "../../constants/editorialImages";
import EditorialImage from "../../components/EditorialImage";
import { getWearHistory } from "../../utils/styleStorage";

function formatDate(value) {
  if (!value) return "Recently worn";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recently worn";
  return date.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
}

function HistoryCard({ item, onOpen }) {
  const firstItem = item.items?.[0];

  return (
    <Pressable style={styles.entry} onPress={() => onOpen(item)}>
      {firstItem?.imageUri ? (
        <Image source={{ uri: firstItem.imageUri }} style={styles.entryImage} />
      ) : (
        <View style={styles.entryImageFallback}><Text style={styles.fallbackMark}>✳</Text></View>
      )}
      <View style={styles.entryCopy}>
        <Text style={styles.entryDate}>{formatDate(item.wornAt)}</Text>
        <Text style={styles.entryTitle}>{item.title || item.occasion + " outfit"}</Text>
        <Text style={styles.entryMeta}>{item.items?.length || 0} pieces  ·  {item.occasion}</Text>
        <Text style={styles.openText}>View outfit  →</Text>
      </View>
    </Pressable>
  );
}

export default function HistoryScreen() {
  const router = useRouter();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let active = true;

      async function loadHistory() {
        try {
          const savedHistory = await getWearHistory();
          if (active) setHistory(savedHistory);
        } catch (error) {
          console.warn("Could not open outfit history:", error);
        } finally {
          if (active) setLoading(false);
        }
      }

      loadHistory();
      return () => { active = false; };
    }, [])
  );

  function openLook(item) {
    router.push({ pathname: "/look-details", params: { look: JSON.stringify(item) } });
  }

  return (
    <View style={styles.screen}>
      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <HistoryCard item={item} onOpen={openLook} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            <Text style={styles.eyebrow}>YOUR OUTFIT JOURNAL</Text>
            <Text style={styles.title}>Worn with love.</Text>
            <Text style={styles.description}>A little timeline of the outfits you have worn.</Text>
            <View style={styles.banner}>
              <EditorialImage source={EDITORIAL_IMAGES.history} style={StyleSheet.absoluteFill} fallbackLabel="Monochrome fashion portrait" />
              <View style={styles.bannerShade} />
              <View style={styles.bannerCopy}>
                <Text style={styles.bannerKicker}>STYLE, DAY BY DAY</Text>
                <Text style={styles.bannerTitle}>Every day gets its own story.</Text>
                <Text style={styles.bannerText}>Mark a look as worn to remember it here.</Text>
              </View>
            </View>
            <View style={styles.sectionRow}>
              <Text style={styles.sectionTitle}>Your outfit history</Text>
              <Text style={styles.count}>{history.length} ENTRIES</Text>
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyCard}>
            <Text style={styles.calendar}>▦</Text>
            <Text style={styles.emptyTitle}>{loading ? "Opening your journal…" : "Your story starts here."}</Text>
            <Text style={styles.emptyText}>After you create a look, tap “Mark as worn”. Your outfit will be saved here.</Text>
            {!loading ? (
              <Pressable style={styles.emptyButton} onPress={() => router.push("/outfit-studio")}>
                <Text style={styles.emptyButtonText}>Create an outfit  →</Text>
              </Pressable>
            ) : null}
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  listContent: { paddingHorizontal: 19, paddingTop: 26, paddingBottom: 34, flexGrow: 1 },
  eyebrow: { color: "#9A7864", fontSize: 8, fontWeight: "900", letterSpacing: 1.5 },
  title: { color: COLORS.text, fontSize: 30, fontWeight: "900", letterSpacing: -1, marginTop: 7 },
  description: { color: COLORS.textMuted, fontSize: 11, lineHeight: 17, marginTop: 7 },
  banner: { width: "100%", aspectRatio: 2 / 3, borderRadius: 17, marginTop: 21, overflow: "hidden", backgroundColor: "#EAE5DF", justifyContent: "flex-end" },
  bannerShade: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.22)" },
  bannerCopy: { padding: 18 },
  bannerKicker: { color: "#FFFFFF", fontSize: 8, fontWeight: "900", letterSpacing: 1.4 },
  bannerTitle: { color: "#FFFFFF", fontSize: 23, fontWeight: "900", marginTop: 10, maxWidth: 235, letterSpacing: -0.6 },
  bannerText: { color: "#FFFFFF", fontSize: 9, lineHeight: 14, marginTop: 7 },
  sectionRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 25, marginBottom: 12 },
  sectionTitle: { color: COLORS.text, fontSize: 15, fontWeight: "900" },
  count: { color: COLORS.textMuted, fontSize: 8, fontWeight: "900", letterSpacing: 0.8 },
  entry: { flexDirection: "row", backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: COLORS.border, borderRadius: 16, padding: 9, marginBottom: 10, gap: 12 },
  entryImage: { width: 91, height: 105, borderRadius: 11, backgroundColor: "#EEE9E3" },
  entryImageFallback: { width: 91, height: 105, borderRadius: 11, backgroundColor: "#EEE9E3", alignItems: "center", justifyContent: "center" },
  fallbackMark: { color: "#927B6A", fontSize: 34 },
  entryCopy: { flex: 1, justifyContent: "center" },
  entryDate: { color: "#9A7864", fontSize: 8, fontWeight: "900", letterSpacing: 0.6 },
  entryTitle: { color: COLORS.text, fontSize: 13, fontWeight: "900", marginTop: 7 },
  entryMeta: { color: COLORS.textMuted, fontSize: 9, marginTop: 4 },
  openText: { color: COLORS.text, fontSize: 8, fontWeight: "900", marginTop: 11 },
  emptyCard: { padding: 22, borderWidth: 1, borderColor: COLORS.border, borderRadius: 18, alignItems: "center", backgroundColor: "#F7F5F3", marginTop: 4 },
  calendar: { color: COLORS.text, fontSize: 33 },
  emptyTitle: { color: COLORS.text, fontSize: 14, fontWeight: "900", marginTop: 8 },
  emptyText: { color: COLORS.textMuted, fontSize: 10, lineHeight: 16, textAlign: "center", marginTop: 6 },
  emptyButton: { backgroundColor: COLORS.text, borderRadius: RADIUS.pill, paddingHorizontal: 15, paddingVertical: 10, marginTop: 14 },
  emptyButtonText: { color: "#FFFFFF", fontSize: 9, fontWeight: "900" },
});
