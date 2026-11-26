import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  ImageBackground,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useFocusEffect } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { COLORS, RADIUS, SPACING } from "../../constants/theme";
import { SAMPLE_CLOTHING } from "../../constants/sampleClothing";
import { getWardrobeItems, saveWardrobeItems } from "../../utils/wardrobeStorage";

const CATEGORIES = ["Top", "Bottom", "Dress", "Shoes", "Accessory"];
const OCCASIONS = ["Casual", "College", "Formal", "Party"];
const SEASONS = ["All season", "Summer", "Winter", "Monsoon"];

const EMPTY_FORM = {
  name: "",
  category: "Top",
  color: "",
  occasion: "Casual",
  season: "All season",
  imageUri: null,
};

function ChoiceRow({ options, selected, onSelect }) {
  return (
    <View style={styles.choiceRow}>
      {options.map((option) => (
        <Pressable
          key={option}
          onPress={() => onSelect(option)}
          style={[styles.choice, selected === option && styles.choiceSelected]}
        >
          <Text style={[styles.choiceText, selected === option && styles.choiceTextSelected]}>
            {option}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

export default function WardrobeScreen() {
  const [items, setItems] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const loadItems = useCallback(async () => {
    const savedItems = await getWardrobeItems();
    setItems(savedItems);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadItems();
    }, [loadItems])
  );

  function updateForm(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function useSample(sample) {
    setForm({
      name: sample.name,
      category: sample.category,
      color: sample.color,
      occasion: sample.occasion,
      season: sample.season,
      imageUri: sample.imageUri,
    });
  }

  async function choosePhoto() {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert("Permission needed", "Please allow photo access to add a clothing picture.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [4, 5],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        updateForm("imageUri", result.assets[0].uri);
      }
    } catch {
      Alert.alert("Couldn't open photos", "Please try again.");
    }
  }

  async function addItem() {
    if (!form.name.trim() || !form.color.trim()) {
      Alert.alert("Missing details", "Please enter an item name and colour.");
      return;
    }

    const newItem = {
      id: Date.now().toString(),
      name: form.name.trim(),
      category: form.category,
      color: form.color.trim(),
      occasion: form.occasion,
      season: form.season,
      imageUri: form.imageUri,
      createdAt: new Date().toISOString(),
    };

    try {
      setSaving(true);
      const updatedItems = [newItem, ...items];
      await saveWardrobeItems(updatedItems);
      setItems(updatedItems);
      setForm(EMPTY_FORM);
      setModalVisible(false);
    } catch {
      Alert.alert("Couldn't save item", "Please try again.");
    } finally {
      setSaving(false);
    }
  }

  function removeItem(item) {
    Alert.alert("Remove clothing item?", `Remove "${item.name}" from your wardrobe?`, [
      { text: "Keep it", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: async () => {
          const updatedItems = items.filter((entry) => entry.id !== item.id);
          try {
            await saveWardrobeItems(updatedItems);
            setItems(updatedItems);
          } catch {
            Alert.alert("Couldn't remove item", "Please try again.");
          }
        },
      },
    ]);
  }

  const visibleItems = selectedCategory === "All"
    ? items
    : items.filter((item) => item.category === selectedCategory);

  function renderItem({ item }) {
    return (
      <View style={styles.itemCard}>
        <View style={styles.itemVisual}>
          {item.imageUri ? (
            <Image source={{ uri: item.imageUri }} style={styles.itemPhoto} />
          ) : (
            <View style={styles.photoFallback}>
              <Text style={styles.itemVisualText}>{item.category === "Shoes" ? "◒" : "♧"}</Text>
            </View>
          )}
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>{item.category.toUpperCase()}</Text>
          </View>
          <Pressable style={styles.removeButton} onPress={() => removeItem(item)} hitSlop={10} accessibilityLabel={`Remove ${item.name}`}>
            <Text style={styles.removeButtonText}>×</Text>
          </Pressable>
        </View>
        <View style={styles.itemInfo}>
          <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.itemMeta}>{item.color} · {item.occasion}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <View style={styles.headerCopy}>
          <Text style={styles.eyebrow}>YOUR COLLECTION</Text>
          <Text style={styles.title}>My wardrobe</Text>
          <Text style={styles.description}>Every piece you own, all in one place.</Text>
        </View>
        <View style={styles.countBadge}>
          <Text style={styles.countNumber}>{items.length}</Text>
          <Text style={styles.countLabel}>PIECES</Text>
        </View>
      </View>

      <View style={styles.toolbar}>
        <Text style={styles.sectionTitle}>Your clothing</Text>
        <Pressable style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.addButtonText}>＋ Add item</Text>
        </Pressable>
      </View>

      {items.length === 0 ? (
        <View style={styles.emptyCard}>
          <ImageBackground source={require("../../assets/wardrobe-rack.jpg")} style={styles.emptyPhoto} imageStyle={styles.emptyPhotoImage}>
            <View style={styles.emptyPhotoShade} />
            <Text style={styles.emptyPhotoLabel}>YOUR PERSONAL COLLECTION</Text>
          </ImageBackground>
          <Text style={styles.emptyTitle}>A wardrobe full of possibilities</Text>
          <Text style={styles.emptyText}>
            Start by adding a clothing piece. Add its name, category, colour and when you like to wear it.
          </Text>
          <Pressable style={styles.emptyButton} onPress={() => setModalVisible(true)}>
            <Text style={styles.emptyButtonText}>Add your first piece</Text>
          </Pressable>
        </View>
      ) : (
        <>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
            {["All", ...CATEGORIES].map((category) => (
              <Pressable
                key={category}
                onPress={() => setSelectedCategory(category)}
                style={[styles.filterChip, selectedCategory === category && styles.filterChipSelected]}
              >
                <Text style={[styles.filterText, selectedCategory === category && styles.filterTextSelected]}>{category}</Text>
              </Pressable>
            ))}
          </ScrollView>
          <FlatList
            data={visibleItems}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            numColumns={2}
            columnWrapperStyle={styles.gridRow}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={<Text style={styles.noItems}>No pieces in this category yet.</Text>}
          />
        </>
      )}

      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setModalVisible(false)}
      >
        <ScrollView style={styles.modalScreen} contentContainerStyle={styles.modalContent} keyboardShouldPersistTaps="handled">
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.eyebrow}>MAKE IT YOURS</Text>
              <Text style={styles.modalTitle}>Add clothing</Text>
            </View>
            <Pressable onPress={() => setModalVisible(false)} style={styles.closeButton}>
              <Text style={styles.closeText}>×</Text>
            </Pressable>
          </View>

          <Text style={styles.fieldLabel}>QUICK START WITH A SAMPLE</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.sampleList}>
            {SAMPLE_CLOTHING.map((sample) => (
              <Pressable key={sample.id} style={styles.sampleCard} onPress={() => useSample(sample)}>
                <Image source={{ uri: sample.imageUri }} style={styles.samplePhoto} />
                <Text style={styles.sampleName} numberOfLines={1}>{sample.name}</Text>
                <Text style={styles.sampleCategory}>{sample.category}</Text>
              </Pressable>
            ))}
          </ScrollView>
          <Text style={styles.sampleNote}>Choose a sample or add a photo from your own gallery below.</Text>

          <Text style={styles.fieldLabel}>CLOTHING PHOTO</Text>
          <Pressable style={styles.photoPicker} onPress={choosePhoto}>
            {form.imageUri ? (
              <Image source={{ uri: form.imageUri }} style={styles.photoPreview} />
            ) : (
              <View style={styles.photoPlaceholder}>
                <Text style={styles.photoPlus}>＋</Text>
                <Text style={styles.photoPickerText}>Choose a photo from your gallery</Text>
              </View>
            )}
          </Pressable>
          {form.imageUri ? (
            <Pressable onPress={() => updateForm("imageUri", null)} style={styles.removePhotoButton}>
              <Text style={styles.removePhotoText}>Remove photo</Text>
            </Pressable>
          ) : null}

          <Text style={styles.fieldLabel}>ITEM NAME</Text>
          <TextInput
            value={form.name}
            onChangeText={(value) => updateForm("name", value)}
            placeholder="e.g. White cotton shirt"
            placeholderTextColor="#A99A90"
            style={styles.input}
          />

          <Text style={styles.fieldLabel}>CATEGORY</Text>
          <ChoiceRow options={CATEGORIES} selected={form.category} onSelect={(value) => updateForm("category", value)} />

          <Text style={styles.fieldLabel}>COLOUR</Text>
          <TextInput
            value={form.color}
            onChangeText={(value) => updateForm("color", value)}
            placeholder="e.g. White, Navy blue, Beige"
            placeholderTextColor="#A99A90"
            style={styles.input}
          />

          <Text style={styles.fieldLabel}>WHEN WOULD YOU WEAR IT?</Text>
          <ChoiceRow options={OCCASIONS} selected={form.occasion} onSelect={(value) => updateForm("occasion", value)} />

          <Text style={styles.fieldLabel}>SEASON</Text>
          <ChoiceRow options={SEASONS} selected={form.season} onSelect={(value) => updateForm("season", value)} />

          <Pressable style={[styles.saveButton, saving && styles.disabledButton]} onPress={addItem} disabled={saving}>
            <Text style={styles.saveButtonText}>{saving ? "Saving..." : "Save to my wardrobe"}</Text>
          </Pressable>
          <Text style={styles.localNote}>Your clothing details are saved locally on this device.</Text>
        </ScrollView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background, paddingHorizontal: SPACING.lg, paddingTop: 30 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  headerCopy: { flex: 1 },
  eyebrow: { color: COLORS.textMuted, fontSize: 9, fontWeight: "800", letterSpacing: 1.4 },
  title: { color: COLORS.text, fontSize: 30, fontWeight: "800", marginTop: 7 },
  description: { color: COLORS.textMuted, fontSize: 12, lineHeight: 18, marginTop: 7 },
  countBadge: { width: 62, height: 62, borderRadius: 20, backgroundColor: COLORS.surfaceMuted, alignItems: "center", justifyContent: "center", marginLeft: 10 },
  countNumber: { color: COLORS.text, fontSize: 21, fontWeight: "800" },
  countLabel: { color: COLORS.textMuted, fontSize: 7, fontWeight: "800", letterSpacing: 1 },
  toolbar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 28, marginBottom: 14 },
  filterRow: { gap: 8, paddingBottom: 15 },
  filterChip: { paddingHorizontal: 15, paddingVertical: 9, borderRadius: RADIUS.pill, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.surface },
  filterChipSelected: { backgroundColor: COLORS.text, borderColor: COLORS.text },
  filterText: { color: COLORS.textMuted, fontSize: 10, fontWeight: "700" },
  filterTextSelected: { color: "#FFFFFF" },
  sectionTitle: { color: COLORS.text, fontSize: 16, fontWeight: "800" },
  addButton: { backgroundColor: COLORS.text, borderRadius: RADIUS.pill, paddingHorizontal: 15, paddingVertical: 10 },
  addButtonText: { color: "#FFFFFF", fontSize: 11, fontWeight: "700" },
  emptyCard: { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.lg, padding: 23, alignItems: "center", marginTop: 12 },
  emptyPhoto: { width: "100%", height: 190, justifyContent: "flex-end", padding: 15, overflow: "hidden", marginBottom: 4 },
  emptyPhotoImage: { borderRadius: 16 },
  emptyPhotoShade: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.12)" },
  emptyPhotoLabel: { color: "#FFFFFF", fontSize: 9, fontWeight: "900", letterSpacing: 1.4 },
  emptyTitle: { color: COLORS.text, fontSize: 17, fontWeight: "800", textAlign: "center", marginTop: 18 },
  emptyText: { color: COLORS.textMuted, fontSize: 12, lineHeight: 19, textAlign: "center", marginTop: 8 },
  emptyButton: { backgroundColor: COLORS.text, borderRadius: RADIUS.pill, paddingHorizontal: 20, paddingVertical: 13, marginTop: 19 },
  emptyButtonText: { color: "#FFFFFF", fontSize: 12, fontWeight: "700" },
  listContent: { paddingBottom: 28 },
  gridRow: { justifyContent: "space-between", marginBottom: 13 },
  itemCard: { width: "48.5%", backgroundColor: COLORS.surface, borderRadius: 17, borderWidth: 1, borderColor: COLORS.border, overflow: "hidden" },
  itemVisual: { height: 190, backgroundColor: "#F1ECE7", position: "relative" },
  itemVisualText: { color: COLORS.accent, fontSize: 42 },
  photoFallback: { flex: 1, alignItems: "center", justifyContent: "center" },
  itemPhoto: { width: "100%", height: "100%", resizeMode: "cover" },
  categoryBadge: { position: "absolute", left: 9, bottom: 9, backgroundColor: "rgba(255,255,255,0.94)", borderRadius: 20, paddingHorizontal: 8, paddingVertical: 5 },
  categoryBadgeText: { color: COLORS.text, fontSize: 7, fontWeight: "900", letterSpacing: 0.8 },
  removeButton: { position: "absolute", right: 8, top: 8, width: 27, height: 27, borderRadius: 14, backgroundColor: "rgba(255,255,255,0.94)", alignItems: "center", justifyContent: "center" },
  removeButtonText: { color: COLORS.text, fontSize: 19, lineHeight: 21 },
  noItems: { color: COLORS.textMuted, textAlign: "center", padding: 24, fontSize: 12 },
  sampleList: { gap: 10, paddingBottom: 4 },
  sampleCard: { width: 112, padding: 7, borderWidth: 1, borderColor: COLORS.border, borderRadius: 13, backgroundColor: COLORS.surface },
  samplePhoto: { width: "100%", height: 105, borderRadius: 9, backgroundColor: COLORS.surfaceMuted },
  sampleName: { color: COLORS.text, fontSize: 10, fontWeight: "700", marginTop: 7 },
  sampleCategory: { color: COLORS.textMuted, fontSize: 9, marginTop: 2 },
  sampleNote: { color: COLORS.textMuted, fontSize: 10, marginTop: 7 },
  photoPicker: { minHeight: 150, borderWidth: 1, borderColor: COLORS.border, borderRadius: 14, overflow: "hidden", backgroundColor: COLORS.surfaceMuted },
  photoPlaceholder: { flex: 1, minHeight: 150, alignItems: "center", justifyContent: "center" },
  photoPlus: { color: COLORS.text, fontSize: 30, marginBottom: 5 },
  photoPickerText: { color: COLORS.textMuted, fontSize: 11 },
  photoPreview: { width: "100%", height: 220, resizeMode: "cover" },
  removePhotoButton: { alignSelf: "flex-end", marginTop: 8 },
  removePhotoText: { color: COLORS.textMuted, fontSize: 11, textDecorationLine: "underline" },
  itemInfo: { paddingHorizontal: 11, paddingVertical: 12 },
  itemName: { color: COLORS.text, fontSize: 12, fontWeight: "800" },
  itemMeta: { color: COLORS.textMuted, fontSize: 10, marginTop: 5 },
  modalScreen: { flex: 1, backgroundColor: COLORS.background },
  modalContent: { padding: SPACING.lg, paddingTop: 26, paddingBottom: 40 },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 28 },
  modalTitle: { color: COLORS.text, fontSize: 28, fontWeight: "800", marginTop: 5 },
  closeButton: { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.surfaceMuted, alignItems: "center", justifyContent: "center" },
  closeText: { color: COLORS.text, fontSize: 24, lineHeight: 27 },
  fieldLabel: { color: COLORS.textMuted, fontSize: 9, fontWeight: "800", letterSpacing: 1.1, marginBottom: 9, marginTop: 18 },
  input: { height: 50, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, borderRadius: 13, paddingHorizontal: 14, color: COLORS.text, fontSize: 13 },
  choiceRow: { flexDirection: "row", flexWrap: "wrap", gap: 7 },
  choice: { borderRadius: RADIUS.pill, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.surface, paddingHorizontal: 12, paddingVertical: 9 },
  choiceSelected: { backgroundColor: COLORS.text, borderColor: COLORS.text },
  choiceText: { color: COLORS.textMuted, fontSize: 10, fontWeight: "600" },
  choiceTextSelected: { color: "#FFFFFF" },
  saveButton: { minHeight: 52, borderRadius: RADIUS.pill, backgroundColor: COLORS.text, alignItems: "center", justifyContent: "center", marginTop: 30 },
  saveButtonText: { color: "#FFFFFF", fontSize: 13, fontWeight: "800" },
  disabledButton: { opacity: 0.6 },
  localNote: { color: COLORS.textMuted, fontSize: 10, textAlign: "center", marginTop: 12 },
});
