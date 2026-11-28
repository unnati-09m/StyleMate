import AsyncStorage from "@react-native-async-storage/async-storage";

const WARDROBE_KEY = "stylemate-wardrobe";

export async function getWardrobeItems() {
  try {
    const savedItems = await AsyncStorage.getItem(WARDROBE_KEY);
    const parsedItems = savedItems ? JSON.parse(savedItems) : [];
    return Array.isArray(parsedItems) ? parsedItems : [];
  } catch (error) {
    console.warn("Could not read wardrobe items:", error);
    return [];
  }
}

export async function saveWardrobeItems(items) {
  try {
    await AsyncStorage.setItem(WARDROBE_KEY, JSON.stringify(items));
  } catch (error) {
    console.warn("Could not save wardrobe items:", error);
    throw error;
  }
}
