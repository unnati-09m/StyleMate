import { useCallback, useState } from "react";
import { Alert, FlatList, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, RADIUS } from "../../constants/theme";
import { EDITORIAL_IMAGES } from "../../constants/editorialImages";
import EditorialImage from "../../components/EditorialImage";
import { getFavouriteLooks, removeFavouriteLook } from "../../utils/styleStorage";

function LookCard({ item, onOpen, onRemove }) {
  const firstItem = item.items?.[0];

  return (
    <Pressable style={styles.card} onPress={() => onOpen(item)}>
      <View style={styles.cardImageWrap}>
        {firstItem?.imageUri ? (
          <Image source={{ uri: firstItem.imageUri }} style={styles.cardImage} />
        ) : (
          <View style={styles.cardImageFallback}><Text style={styles.fallbackMark}>✳</Text></View>
        )}
        <View style={styles.savedTag}><Text style={styles.savedTagText}>SAVED LOOK</Text></View>
        <Pressable style={styles.removeButton} onPress={() => onRemove(item)} hitSlop={8}>
          <Text style={styles.removeText}>×</Text>
        </Pressable>
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.lookTitle}>{item.title || item.occasion + " outfit"}</Text>
        <Text style={styles.lookMeta}>{item.occasion}  ·  {item.items?.length || 0} pieces</Text>
        <Text style={styles.openText}>View this look  →</Text>
      </View>
    </Pressable>
  );
}

export default function FavouritesScreen() {
  const router = useRouter();
  const [looks, setLooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let active = true;

      async function loadLooks() {
        try {
          const savedLooks = await getFavouriteLooks();
          if (active) setLooks(savedLooks);
        } catch (error) {
          Alert.alert("Couldn't load your saved looks", "Please try again.");
        } finally {
          if (active) setLoading(false);
        }
      }

      loadLooks();
      return () => { active = false; };
    }, [])
  );

  function openLook(item) {
    router.push({ pathname: "/look-details", params: { look: JSON.stringify(item) } });
  }

  function confirmRemove(item) {
    Alert.alert("Remove saved look?", "This will only remove it from your favourites.", [
      { text: "Keep it", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: async () => {
          try {
            const updated = await removeFavouriteLook(item.lookId || item.id);
            setLooks(updated);
          } catch (error) {
            Alert.alert("Couldn't remove this look", "Please try again.");
          }
        },
      },
    ]);
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.screen}>
      <FlatList
        data={looks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <LookCard item={item} onOpen={openLook} onRemove={confirmRemove} />}
        numColumns={2}
        columnWrapperStyle={styles.gridRow}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            <Text style={styles.eyebrow}>THE LOOKS YOU LOVE</Text>
            <Text style={styles.title}>Your saved edit.</Text>
            <Text style={styles.description}>Keep the combinations you love, ready for another day.</Text>
            <View style={styles.banner}>
              <EditorialImage source={EDITORIAL_IMAGES.favourites} style={StyleSheet.absoluteFill} fallbackLabel="Beige fashion lookbook" />
              <View style={styles.bannerShade} />
              <View style={styles.bannerCopy}>
                <Text style={styles.bannerKicker}>YOUR PERSONAL STYLE FILE</Text>
                <Text style={styles.bannerTitle}>Good outfits are worth keeping.</Text>
                <Text style={styles.bannerText}>Save a look from Outfit Studio and it will live here.</Text>
              </View>
            </View>
            <View style={styles.sectionRow}>
              <Text style={styles.sectionTitle}>Saved looks</Text>
              <Text style={styles.count}>{looks.length} TOTAL</Text>
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyCard}>
            <Text style={styles.emptyHeart}>♡</Text>
            <Text style={styles.emptyTitle}>{loading ? "Opening your saved edit…" : "Nothing saved just yet."}</Text>
            <Text style={styles.emptyText}>Build an outfit from the pieces in your wardrobe, then save it here.</Text>
            {!loading ? (
              <Pressable style={styles.emptyButton} onPress={() => router.push("/outfit-studio")}>
                <Text style={styles.emptyButtonText}>Build your first look  →</Text>
              </Pressable>
            ) : null}
          </View>
        }
      />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  screen: { flex: 1, backgroundColor: COLORS.background },
  listContent: { paddingHorizontal: 19, paddingTop: 26, paddingBottom: 34, flexGrow: 1 },
  eyebrow: { color: "#9A7864", fontSize: 8, fontWeight: "900", letterSpacing: 1.5 },
  title: { color: COLORS.text, fontSize: 30, fontWeight: "900", letterSpacing: -1, marginTop: 7 },
  description: { color: COLORS.textMuted, fontSize: 11, lineHeight: 17, marginTop: 7 },
  banner: { width: "100%", aspectRatio: 2 / 3, borderRadius: 17, marginTop: 21, overflow: "hidden", backgroundColor: "#EAE5DF", justifyContent: "flex-end" },
  bannerShade: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.22)" },
  bannerCopy: { padding: 17 },
  bannerKicker: { color: "#FFFFFF", fontSize: 8, fontWeight: "900", letterSpacing: 1.4 },
  bannerTitle: { color: "#FFFFFF", fontSize: 22, fontWeight: "900", marginTop: 9, letterSpacing: -0.5 },
  bannerText: { color: "#FFFFFF", fontSize: 9, marginTop: 6, lineHeight: 14 },
  sectionRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 25, marginBottom: 13 },
  sectionTitle: { color: COLORS.text, fontSize: 15, fontWeight: "900" },
  count: { color: COLORS.textMuted, fontSize: 8, fontWeight: "900", letterSpacing: 0.8 },
  gridRow: { justifyContent: "space-between", marginBottom: 12 },
  card: { width: "48.5%", backgroundColor: "#FFFFFF", borderRadius: 16, borderWidth: 1, borderColor: COLORS.border, overflow: "hidden" },
  cardImageWrap: { height: 165, backgroundColor: "#EEE9E3", position: "relative" },
  cardImage: { width: "100%", height: "100%", resizeMode: "cover" },
  cardImageFallback: { flex: 1, alignItems: "center", justifyContent: "center" },
  fallbackMark: { color: "#927B6A", fontSize: 36 },
  savedTag: { position: "absolute", left: 8, bottom: 8, backgroundColor: "#FFFFFF", borderRadius: 20, paddingHorizontal: 8, paddingVertical: 5 },
  savedTagText: { color: COLORS.text, fontSize: 7, fontWeight: "900", letterSpacing: 0.7 },
  removeButton: { position: "absolute", right: 8, top: 8, height: 26, width: 26, borderRadius: 13, backgroundColor: "#FFFFFF", alignItems: "center", justifyContent: "center" },
  removeText: { color: COLORS.text, fontSize: 18, lineHeight: 21 },
  cardBody: { padding: 10 },
  lookTitle: { color: COLORS.text, fontSize: 11, fontWeight: "900" },
  lookMeta: { color: COLORS.textMuted, fontSize: 9, marginTop: 4 },
  openText: { color: COLORS.text, fontSize: 8, fontWeight: "900", marginTop: 9 },
  emptyCard: { padding: 22, borderWidth: 1, borderColor: COLORS.border, borderRadius: 18, alignItems: "center", backgroundColor: "#F7F5F3", marginTop: 4 },
  emptyHeart: { color: COLORS.text, fontSize: 38 },
  emptyTitle: { color: COLORS.text, fontSize: 14, fontWeight: "900", marginTop: 8 },
  emptyText: { color: COLORS.textMuted, fontSize: 10, lineHeight: 16, textAlign: "center", marginTop: 6 },
  emptyButton: { backgroundColor: COLORS.text, borderRadius: RADIUS.pill, paddingHorizontal: 15, paddingVertical: 10, marginTop: 14 },
  emptyButtonText: { color: "#FFFFFF", fontSize: 9, fontWeight: "900" },
});
