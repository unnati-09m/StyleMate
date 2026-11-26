import { ImageBackground, StyleSheet, Text, View } from "react-native";
import { COLORS, RADIUS, SPACING } from "../../constants/theme";

const HISTORY_IMAGE = "https://images.pexels.com/photos/37704838/pexels-photo-37704838.jpeg?auto=compress&cs=tinysrgb&w=900";

export default function HistoryScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.eyebrow}>YOUR OUTFIT JOURNAL</Text>
      <Text style={styles.title}>The days you wore it.</Text>
      <Text style={styles.description}>A little timeline of the outfits that made it out into the world.</Text>

      <ImageBackground source={{ uri: HISTORY_IMAGE }} style={styles.imageCard} imageStyle={styles.image}>
        <View style={styles.shade} />
        <Text style={styles.imageKicker}>STYLE, DAY BY DAY</Text>
        <Text style={styles.imageTitle}>Every day is{"\n"}another outfit story.</Text>
      </ImageBackground>

      <View style={styles.emptyCard}>
        <View style={styles.iconCircle}><Text style={styles.calendar}>▦</Text></View>
        <Text style={styles.emptyTitle}>Your story starts here</Text>
        <Text style={styles.emptyText}>Outfits you mark as worn will appear here, so you can look back at your style over time.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background, padding: SPACING.lg, paddingTop: 32 },
  eyebrow: { color: "#A47E69", fontSize: 9, fontWeight: "900", letterSpacing: 1.5 },
  title: { color: COLORS.text, fontSize: 30, fontWeight: "900", marginTop: 7, letterSpacing: -1 },
  description: { color: COLORS.textMuted, fontSize: 13, lineHeight: 19, marginTop: 8 },
  imageCard: { height: 190, justifyContent: "flex-end", padding: 18, marginTop: 24, overflow: "hidden", backgroundColor: "#D8CBC0" },
  image: { borderRadius: 20 },
  shade: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.3)" },
  imageKicker: { color: "#FFFFFF", fontSize: 8, fontWeight: "900", letterSpacing: 1.4 },
  imageTitle: { color: "#FFFFFF", fontSize: 26, lineHeight: 29, fontWeight: "900", letterSpacing: -0.7, marginTop: 7 },
  emptyCard: { backgroundColor: "#F8F6F4", borderRadius: RADIUS.lg, padding: 22, alignItems: "center", marginTop: 17, borderWidth: 1, borderColor: "#EEEAE6" },
  iconCircle: { width: 58, height: 58, borderRadius: 29, backgroundColor: "#EFE5DE", alignItems: "center", justifyContent: "center" },
  calendar: { color: COLORS.text, fontSize: 29 },
  emptyTitle: { color: COLORS.text, fontSize: 16, fontWeight: "900", marginTop: 13 },
  emptyText: { color: COLORS.textMuted, fontSize: 12, lineHeight: 18, textAlign: "center", marginTop: 7 },
});
