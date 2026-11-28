import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  AppState,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Linking,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useFocusEffect } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { File, Paths } from "expo-file-system";
import { COLORS, RADIUS, SPACING } from "../../constants/theme";
import { EDITORIAL_IMAGES } from "../../constants/editorialImages";
import EditorialImage from "../../components/EditorialImage";
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
  imageStorage: null,
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

function FieldLabel({ children }) {
  return <Text style={styles.fieldLabel}>{children}</Text>;
}

export default function WardrobeScreen() {
  const [items, setItems] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const loadItems = useCallback(async () => {
    try {
      const savedItems = await getWardrobeItems();
      setItems(savedItems);
    } catch (error) {
      Alert.alert("Couldn't load your wardrobe", "Close and reopen this screen to try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      let screenIsActive = true;

      async function refreshItems() {
        const savedItems = await getWardrobeItems();
        if (screenIsActive) setItems(savedItems);
        if (screenIsActive) setLoading(false);
      }

      refreshItems();

      const appStateSubscription = AppState.addEventListener("change", (state) => {
        if (state === "active") refreshItems();
      });

      return () => {
        screenIsActive = false;
        appStateSubscription.remove();
      };
    }, [])
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
      imageStorage: "remote",
    });
  }

  async function copyPhotoToApp(uri) {
    const sourceFile = new File(uri);
    const extensionMatch = uri.match(/\.(jpg|jpeg|png|webp)(?:\?|$)/i);
    const extension = extensionMatch ? extensionMatch[1].toLowerCase() : "jpg";
    const savedFile = new File(Paths.document, "stylemate-" + Date.now() + "." + extension);

    await sourceFile.copy(savedFile);
    return savedFile.uri;
  }

  function showPermissionMessage(permission, feature) {
    const message = permission.canAskAgain
      ? "Allow " + feature + " access when your device asks so StyleMate can add a clothing picture."
      : "Access is currently turned off for StyleMate. You can enable it in your device settings.";

    const buttons = [{ text: "Not now", style: "cancel" }];
    if (!permission.canAskAgain) {
      buttons.push({
        text: "Open settings",
        onPress: () => Linking.openSettings().catch(() => {}),
      });
    }

    Alert.alert("Permission needed", message, buttons);
  }

  async function choosePhoto(source) {
    try {
      const permission =
        source === "camera"
          ? await ImagePicker.requestCameraPermissionsAsync()
          : await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        showPermissionMessage(permission, source === "camera" ? "camera" : "photo library");
        return;
      }

      const options = {
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [4, 5],
        quality: 0.85,
      };

      const result =
        source === "camera"
          ? await ImagePicker.launchCameraAsync(options)
          : await ImagePicker.launchImageLibraryAsync(options);

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return;
      }

      const savedUri = await copyPhotoToApp(result.assets[0].uri);
      setForm((current) => ({
        ...current,
        imageUri: savedUri,
        imageStorage: "documents",
      }));
    } catch (error) {
      console.error("Photo selection failed:", error);
      Alert.alert("Couldn't add that photo", "Please try again or choose another image.");
    }
  }

  async function addItem() {
    if (!form.name.trim() || !form.color.trim()) {
      Alert.alert("A few details are missing", "Please enter an item name and colour.");
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
      imageStorage: form.imageStorage,
      createdAt: new Date().toISOString(),
    };

    try {
      setSaving(true);
      const updatedItems = [newItem, ...items];
      await saveWardrobeItems(updatedItems);
      setItems(updatedItems);
      setForm(EMPTY_FORM);
      setModalVisible(false);
    } catch (error) {
      Alert.alert("Couldn't save this piece", "Your existing wardrobe is safe. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  function removeItem(item) {
    Alert.alert("Remove this piece?", "This will remove it from your StyleMate wardrobe.", [
      { text: "Keep it", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: async () => {
          const updatedItems = items.filter((entry) => entry.id !== item.id);

          try {
            await saveWardrobeItems(updatedItems);
            setItems(updatedItems);

            if (item.imageStorage === "documents" && item.imageUri) {
              try {
                await new File(item.imageUri).delete();
              } catch (error) {
                console.warn("The saved photo could not be removed:", error);
              }
            }
          } catch (error) {
            Alert.alert("Couldn't remove this piece", "Please try again.");
          }
        },
      },
    ]);
  }

  const visibleItems =
    selectedCategory === "All"
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
              <Text style={styles.itemVisualText}>✳</Text>
              <Text style={styles.fallbackCategory}>{item.category}</Text>
            </View>
          )}
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>{item.category.toUpperCase()}</Text>
          </View>
          <Pressable
            style={styles.removeButton}
            onPress={() => removeItem(item)}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel={"Remove " + item.name}
          >
            <Text style={styles.removeButtonText}>×</Text>
          </Pressable>
        </View>
        <View style={styles.itemInfo}>
          <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.itemMeta}>{item.color}  ·  {item.occasion}</Text>
        </View>
      </View>
    );
  }

  function renderHeader() {
    return (
      <View>
        <View style={styles.header}>
          <View style={styles.headerCopy}>
            <Text style={styles.eyebrow}>THE COLLECTION</Text>
            <Text style={styles.title}>My wardrobe.</Text>
            <Text style={styles.description}>Every piece you own, in one thoughtful place.</Text>
          </View>
          <View style={styles.countBadge}>
            <Text style={styles.countNumber}>{items.length}</Text>
            <Text style={styles.countLabel}>PIECES</Text>
          </View>
        </View>

        <View style={styles.collectionPhoto}>
          <EditorialImage
            source={EDITORIAL_IMAGES.wardrobe}
            style={StyleSheet.absoluteFill}
            fallbackLabel="Monochrome studio fashion editorial"
          />
          <View style={styles.collectionPhotoOverlay} />
          <View style={styles.collectionPhotoCopy}>
            <Text style={styles.bannerKicker}>YOUR CLOSET, YOUR RULES</Text>
            <Text style={styles.bannerTitle}>Wear more of what you have.</Text>
            <Text style={styles.bannerText}>Add a piece, choose its details and build outfits around it.</Text>
          </View>
        </View>

        <View style={styles.toolbar}>
          <View>
            <Text style={styles.sectionTitle}>Your clothing</Text>
            <Text style={styles.smallMeta}>{items.length} pieces saved on this device</Text>
          </View>
          <Pressable style={styles.addButton} onPress={() => setModalVisible(true)}>
            <Text style={styles.addButtonText}>＋  Add piece</Text>
          </Pressable>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          {["All", ...CATEGORIES].map((category) => (
            <Pressable
              key={category}
              onPress={() => setSelectedCategory(category)}
              style={[styles.filterChip, selectedCategory === category && styles.filterChipSelected]}
            >
              <Text style={[styles.filterText, selectedCategory === category && styles.filterTextSelected]}>
                {category}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      {loading ? (
        <View style={styles.loadingState}>
          <ActivityIndicator color={COLORS.text} />
          <Text style={styles.loadingText}>Opening your wardrobe…</Text>
        </View>
      ) : (
        <FlatList
          data={visibleItems}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          numColumns={2}
          columnWrapperStyle={styles.gridRow}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={
            <View style={styles.emptyCard}>
              <View style={styles.emptyArtwork}>
                <View style={styles.emptyShapeOne} />
                <View style={styles.emptyShapeTwo} />
                <Text style={styles.emptyMark}>＋</Text>
              </View>
              <Text style={styles.emptyTitle}>
                {items.length === 0 ? "Start with one favourite piece." : "Nothing in this category yet."}
              </Text>
              <Text style={styles.emptyText}>
                {items.length === 0
                  ? "Add a top, a bottom or a dress. Your pieces stay saved on this device."
                  : "Try another category or add something new to your collection."}
              </Text>
              <Pressable style={styles.emptyButton} onPress={() => setModalVisible(true)}>
                <Text style={styles.emptyButtonText}>Add clothing  →</Text>
              </Pressable>
            </View>
          }
        />
      )}

      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalScreen}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView contentContainerStyle={styles.modalContent} keyboardShouldPersistTaps="handled">
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.eyebrow}>MAKE IT YOURS</Text>
                <Text style={styles.modalTitle}>Add a piece.</Text>
              </View>
              <Pressable onPress={() => setModalVisible(false)} style={styles.closeButton}>
                <Text style={styles.closeText}>×</Text>
              </Pressable>
            </View>

            <FieldLabel>QUICK START WITH A SAMPLE</FieldLabel>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.sampleList}>
              {SAMPLE_CLOTHING.map((sample) => (
                <Pressable key={sample.id} style={styles.sampleCard} onPress={() => useSample(sample)}>
                  <Image source={{ uri: sample.imageUri }} style={styles.samplePhoto} />
                  <Text style={styles.sampleName} numberOfLines={1}>{sample.name}</Text>
                  <Text style={styles.sampleCategory}>{sample.category}</Text>
                </Pressable>
              ))}
            </ScrollView>

            <FieldLabel>ADD YOUR OWN PHOTO</FieldLabel>
            <View style={styles.photoActions}>
              <Pressable style={styles.photoAction} onPress={() => choosePhoto("camera")}>
                <Text style={styles.photoActionIcon}>◎</Text>
                <Text style={styles.photoActionText}>Take photo</Text>
              </Pressable>
              <Pressable style={styles.photoAction} onPress={() => choosePhoto("gallery")}>
                <Text style={styles.photoActionIcon}>▧</Text>
                <Text style={styles.photoActionText}>Choose from gallery</Text>
              </Pressable>
            </View>

            {form.imageUri ? (
              <View style={styles.previewWrap}>
                <Image source={{ uri: form.imageUri }} style={styles.photoPreview} />
                <View style={styles.previewCopy}>
                  <Text style={styles.previewTitle}>Photo preview</Text>
                  <Text style={styles.previewText}>
                    {form.imageStorage === "documents"
                      ? "A copy is stored inside StyleMate and will remain available after restart."
                      : "This sample image is loaded from the internet."}
                  </Text>
                  <Pressable onPress={() => setForm((current) => ({ ...current, imageUri: null, imageStorage: null }))}>
                    <Text style={styles.removePhotoText}>Remove photo</Text>
                  </Pressable>
                </View>
              </View>
            ) : (
              <View style={styles.photoNote}>
                <Text style={styles.photoNoteText}>Your photo is shown here before you save the clothing item.</Text>
              </View>
            )}

            <FieldLabel>ITEM NAME</FieldLabel>
            <TextInput
              value={form.name}
              onChangeText={(value) => updateForm("name", value)}
              placeholder="e.g. White cotton shirt"
              placeholderTextColor="#9A918B"
              style={styles.input}
            />

            <FieldLabel>CATEGORY</FieldLabel>
            <ChoiceRow options={CATEGORIES} selected={form.category} onSelect={(value) => updateForm("category", value)} />

            <FieldLabel>COLOUR</FieldLabel>
            <TextInput
              value={form.color}
              onChangeText={(value) => updateForm("color", value)}
              placeholder="e.g. White, navy blue, beige"
              placeholderTextColor="#9A918B"
              style={styles.input}
            />

            <FieldLabel>WHEN WOULD YOU WEAR IT?</FieldLabel>
            <ChoiceRow options={OCCASIONS} selected={form.occasion} onSelect={(value) => updateForm("occasion", value)} />

            <FieldLabel>SEASON</FieldLabel>
            <ChoiceRow options={SEASONS} selected={form.season} onSelect={(value) => updateForm("season", value)} />

            <Pressable
              style={[styles.saveButton, saving && styles.disabledButton]}
              onPress={addItem}
              disabled={saving}
            >
              <Text style={styles.saveButtonText}>{saving ? "Saving your piece…" : "Save to my wardrobe"}</Text>
            </Pressable>
            <Text style={styles.localNote}>Your clothing details are stored locally on this device.</Text>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  listContent: { paddingHorizontal: 19, paddingTop: 25, paddingBottom: 35, flexGrow: 1 },
  loadingState: { flex: 1, alignItems: "center", justifyContent: "center", gap: 9 },
  loadingText: { color: COLORS.textMuted, fontSize: 11 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  headerCopy: { flex: 1 },
  eyebrow: { color: "#9A7864", fontSize: 8, fontWeight: "900", letterSpacing: 1.5 },
  title: { color: COLORS.text, fontSize: 31, fontWeight: "900", marginTop: 7, letterSpacing: -1 },
  description: { color: COLORS.textMuted, fontSize: 11, lineHeight: 17, marginTop: 6 },
  countBadge: { width: 61, height: 61, borderRadius: 18, backgroundColor: "#F0EDE9", alignItems: "center", justifyContent: "center", marginLeft: 10 },
  countNumber: { color: COLORS.text, fontSize: 21, fontWeight: "900" },
  countLabel: { color: COLORS.textMuted, fontSize: 7, fontWeight: "900", letterSpacing: 1 },
  collectionPhoto: { width: "100%", aspectRatio: 2 / 3, borderRadius: 17, overflow: "hidden", backgroundColor: "#EAE5DF", marginTop: 21, justifyContent: "flex-end" },
  collectionPhotoOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.18)" },
  collectionPhotoCopy: { padding: 17 },
  bannerKicker: { color: "#FFFFFF", fontSize: 8, fontWeight: "900", letterSpacing: 1.4 },
  bannerTitle: { color: "#FFFFFF", fontSize: 22, fontWeight: "900", marginTop: 10, letterSpacing: -0.6 },
  bannerText: { color: "#FFFFFF", fontSize: 10, lineHeight: 16, marginTop: 6, maxWidth: 270 },
  toolbar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 25, marginBottom: 13 },
  sectionTitle: { color: COLORS.text, fontSize: 16, fontWeight: "900" },
  smallMeta: { color: COLORS.textMuted, fontSize: 8, marginTop: 4 },
  addButton: { backgroundColor: COLORS.text, borderRadius: RADIUS.pill, paddingHorizontal: 14, paddingVertical: 10 },
  addButtonText: { color: "#FFFFFF", fontSize: 10, fontWeight: "800" },
  filterRow: { gap: 7, paddingBottom: 15 },
  filterChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: RADIUS.pill, borderWidth: 1, borderColor: COLORS.border, backgroundColor: "#FFFFFF" },
  filterChipSelected: { backgroundColor: COLORS.text, borderColor: COLORS.text },
  filterText: { color: COLORS.textMuted, fontSize: 9, fontWeight: "700" },
  filterTextSelected: { color: "#FFFFFF" },
  gridRow: { justifyContent: "space-between", marginBottom: 12 },
  itemCard: { width: "48.5%", backgroundColor: "#FFFFFF", borderRadius: 16, borderWidth: 1, borderColor: COLORS.border, overflow: "hidden" },
  itemVisual: { height: 176, backgroundColor: "#F0EDE9", position: "relative" },
  itemPhoto: { width: "100%", height: "100%", resizeMode: "cover" },
  photoFallback: { flex: 1, alignItems: "center", justifyContent: "center" },
  itemVisualText: { color: "#8A7566", fontSize: 37 },
  fallbackCategory: { color: "#8A7566", fontSize: 9, marginTop: 5, fontWeight: "800" },
  categoryBadge: { position: "absolute", left: 8, bottom: 8, backgroundColor: "rgba(255,255,255,0.94)", borderRadius: 20, paddingHorizontal: 8, paddingVertical: 5 },
  categoryBadgeText: { color: COLORS.text, fontSize: 7, fontWeight: "900", letterSpacing: 0.7 },
  removeButton: { position: "absolute", right: 8, top: 8, width: 27, height: 27, borderRadius: 14, backgroundColor: "rgba(255,255,255,0.95)", alignItems: "center", justifyContent: "center" },
  removeButtonText: { color: COLORS.text, fontSize: 19, lineHeight: 21 },
  itemInfo: { paddingHorizontal: 10, paddingVertical: 11 },
  itemName: { color: COLORS.text, fontSize: 11, fontWeight: "900" },
  itemMeta: { color: COLORS.textMuted, fontSize: 9, marginTop: 5 },
  emptyCard: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 20, padding: 22, alignItems: "center", marginTop: 4, marginBottom: 20 },
  emptyArtwork: { height: 130, width: "100%", borderRadius: 15, backgroundColor: "#EEE8E1", alignItems: "center", justifyContent: "center", overflow: "hidden" },
  emptyShapeOne: { position: "absolute", height: 180, width: 180, borderRadius: 90, backgroundColor: "#DCD0C5", right: -34, top: -40 },
  emptyShapeTwo: { position: "absolute", height: 90, width: 90, borderRadius: 45, borderWidth: 1, borderColor: "#FFFFFF", left: 25, bottom: -40 },
  emptyMark: { color: COLORS.text, fontSize: 47, fontWeight: "300" },
  emptyTitle: { color: COLORS.text, fontSize: 15, fontWeight: "900", marginTop: 16, textAlign: "center" },
  emptyText: { color: COLORS.textMuted, fontSize: 10, lineHeight: 16, textAlign: "center", marginTop: 7 },
  emptyButton: { backgroundColor: COLORS.text, borderRadius: 22, paddingHorizontal: 17, paddingVertical: 11, marginTop: 15 },
  emptyButtonText: { color: "#FFFFFF", fontSize: 10, fontWeight: "900" },
  modalScreen: { flex: 1, backgroundColor: COLORS.background },
  modalContent: { padding: 20, paddingTop: 25, paddingBottom: 44 },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 25 },
  modalTitle: { color: COLORS.text, fontSize: 29, fontWeight: "900", marginTop: 5, letterSpacing: -0.9 },
  closeButton: { width: 35, height: 35, borderRadius: 18, backgroundColor: "#F0EDE9", alignItems: "center", justifyContent: "center" },
  closeText: { color: COLORS.text, fontSize: 23, lineHeight: 26 },
  fieldLabel: { color: COLORS.textMuted, fontSize: 8, fontWeight: "900", letterSpacing: 1.1, marginBottom: 9, marginTop: 18 },
  sampleList: { gap: 9, paddingBottom: 3 },
  sampleCard: { width: 105, padding: 7, borderWidth: 1, borderColor: COLORS.border, borderRadius: 13, backgroundColor: "#FFFFFF" },
  samplePhoto: { width: "100%", height: 91, borderRadius: 9, backgroundColor: "#F0EDE9" },
  sampleName: { color: COLORS.text, fontSize: 9, fontWeight: "800", marginTop: 6 },
  sampleCategory: { color: COLORS.textMuted, fontSize: 8, marginTop: 3 },
  photoActions: { flexDirection: "row", gap: 9 },
  photoAction: { flex: 1, minHeight: 48, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 7, backgroundColor: "#FFFFFF" },
  photoActionIcon: { color: COLORS.text, fontSize: 17 },
  photoActionText: { color: COLORS.text, fontSize: 9, fontWeight: "800" },
  previewWrap: { flexDirection: "row", gap: 12, padding: 10, backgroundColor: "#F4F1EE", borderRadius: 14, marginTop: 11 },
  photoPreview: { width: 82, height: 98, borderRadius: 9, resizeMode: "cover" },
  previewCopy: { flex: 1, justifyContent: "center" },
  previewTitle: { color: COLORS.text, fontSize: 10, fontWeight: "900" },
  previewText: { color: COLORS.textMuted, fontSize: 8, lineHeight: 12, marginTop: 4 },
  removePhotoText: { color: "#8B5F4A", fontSize: 8, fontWeight: "900", marginTop: 7 },
  photoNote: { backgroundColor: "#F5F2EF", borderRadius: 11, padding: 12, marginTop: 10 },
  photoNoteText: { color: COLORS.textMuted, fontSize: 9, lineHeight: 14 },
  input: { minHeight: 48, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, paddingHorizontal: 13, color: COLORS.text, fontSize: 12 },
  choiceRow: { flexDirection: "row", flexWrap: "wrap", gap: 7 },
  choice: { borderRadius: RADIUS.pill, borderWidth: 1, borderColor: COLORS.border, backgroundColor: "#FFFFFF", paddingHorizontal: 11, paddingVertical: 8 },
  choiceSelected: { backgroundColor: COLORS.text, borderColor: COLORS.text },
  choiceText: { color: COLORS.textMuted, fontSize: 9, fontWeight: "700" },
  choiceTextSelected: { color: "#FFFFFF" },
  saveButton: { minHeight: 51, borderRadius: RADIUS.pill, backgroundColor: COLORS.text, alignItems: "center", justifyContent: "center", marginTop: 28 },
  saveButtonText: { color: "#FFFFFF", fontSize: 11, fontWeight: "900" },
  disabledButton: { opacity: 0.6 },
  localNote: { color: COLORS.textMuted, fontSize: 8, textAlign: "center", marginTop: 10 },
});
