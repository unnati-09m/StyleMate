import { ImageBackground, StyleSheet, Text, View } from "react-native";
import { COLORS, RADIUS, SPACING } from "../../constants/theme";

const FAVOURITE_IMAGE = "https://images.pexels.com/photos/7383102/pexels-photo-7383102.jpeg?auto=compress&cs=tinysrgb&w=900";

export default function FavouritesScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.eyebrow}>THE LOOKS YOU LOVE</Text>
      <Text style={styles.title}>Your saved edit.</Text>
      <Text style={styles.description}>Keep the combinations you love, all in one place.</Text>

      <ImageBackground source={{ uri: FAVOURITE_IMAGE }} style={styles.imageCard} imageStyle={styles.image}>
        <View style={styles.shade} />
        <Text style={styles.imageKicker}>YOUR PERSONAL COLLECTION</Text>
        <Text style={styles.imageTitle}>Good outfits{"\n"}are worth keeping.</Text>
      </ImageBackground>

      <View style={styles.emptyCard}>
        <View style={styles.heartCircle}><Text style={styles.heart}>♡</Text></View>
        <Text style={styles.emptyTitle}>Nothing saved just yet</Text>
        <Text style={styles.emptyText}>When you save an outfit combination, it will be ready for you here.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background, padding: SPACING.lg, paddingTop: 32 },
  eyebrow: { color: "#A47E69", fontSize: 9, fontWeight: "900", letterSpacing: 1.5 },
  title: { color: COLORS.text, fontSize: 31, fontWeight: "900", marginTop: 7, letterSpacing: -1 },
  description: { color: COLORS.textMuted, fontSize: 13, lineHeight: 19, marginTop: 8 },
  imageCard: { height: 190, justifyContent: "flex-end", padding: 18, marginTop: 24, overflow: "hidden", backgroundColor: "#D8CBC0" },
  image: { borderRadius: 20 },
  shade: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.3)" },
  imageKicker: { color: "#FFFFFF", fontSize: 8, fontWeight: "900", letterSpacing: 1.4 },
  imageTitle: { color: "#FFFFFF", fontSize: 26, lineHeight: 29, fontWeight: "900", letterSpacing: -0.7, marginTop: 7 },
  emptyCard: { backgroundColor: "#F8F6F4", borderRadius: RADIUS.lg, padding: 23, alignItems: "center", marginTop: 17, borderWidth: 1, borderColor: "#EEEAE6" },
  heartCircle: { width: 58, height: 58, borderRadius: 29, backgroundColor: "#EFE5DE", alignItems: "center", justifyContent: "center" },
  heart: { color: COLORS.text, fontSize: 34, lineHeight: 39 },
  emptyTitle: { color: COLORS.text, fontSize: 16, fontWeight: "900", marginTop: 13 },
  emptyText: { color: COLORS.textMuted, fontSize: 12, lineHeight: 18, textAlign: "center", marginTop: 7 },
});
