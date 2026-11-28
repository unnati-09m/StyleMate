import { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

export default function EditorialImage({
  source,
  style,
  resizeMode = "contain",
  fallbackLabel = "STYLEMATE",
}) {
  const [failed, setFailed] = useState(false);

  return (
    <View style={[styles.frame, style]}>
      {!failed ? (
        <Image
          source={{ uri: source }}
          style={StyleSheet.absoluteFill}
          resizeMode={resizeMode}
          onError={() => setFailed(true)}
          accessible
          accessibilityLabel={fallbackLabel}
        />
      ) : (
        <View style={styles.fallback}>
          <Text style={styles.fallbackBrand}>STYLEMATE</Text>
          <Text style={styles.fallbackText}>YOUR PERSONAL STYLE SPACE</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    overflow: "hidden",
    backgroundColor: "#EAE5DF",
  },
  fallback: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EAE5DF",
    padding: 20,
  },
  fallbackBrand: {
    color: "#171717",
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 2,
  },
  fallbackText: {
    color: "#796B61",
    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 1.4,
    marginTop: 7,
  },
});
