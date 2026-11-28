import AsyncStorage from "@react-native-async-storage/async-storage";

const FAVOURITES_KEY = "stylemate-favourites";
const HISTORY_KEY = "stylemate-history";

async function readList(key) {
  try {
    const saved = await AsyncStorage.getItem(key);
    const parsed = saved ? JSON.parse(saved) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn("Could not read saved style data:", error);
    return [];
  }
}

async function writeList(key, items) {
  await AsyncStorage.setItem(key, JSON.stringify(items));
}

export function getFavouriteLooks() {
  return readList(FAVOURITES_KEY);
}

export function getWearHistory() {
  return readList(HISTORY_KEY);
}

export async function addFavouriteLook(look) {
  const saved = await getFavouriteLooks();
  const lookId = look.lookId || look.id;
  const alreadySaved = saved.some((entry) => (entry.lookId || entry.id) === lookId);

  if (alreadySaved) {
    return false;
  }

  const favourite = {
    ...look,
    id: lookId,
    lookId,
    savedAt: new Date().toISOString(),
  };

  await writeList(FAVOURITES_KEY, [favourite, ...saved]);
  return true;
}

export async function removeFavouriteLook(lookId) {
  const saved = await getFavouriteLooks();
  const updated = saved.filter((entry) => (entry.lookId || entry.id) !== lookId);
  await writeList(FAVOURITES_KEY, updated);
  return updated;
}

export async function addWearHistory(look) {
  const history = await getWearHistory();
  const lookId = look.lookId || look.id;
  const today = new Date().toISOString().slice(0, 10);
  const historyId = lookId + "-" + today;
  const alreadyAddedToday = history.some((entry) => entry.id === historyId);

  if (alreadyAddedToday) {
    return false;
  }

  const historyEntry = {
    ...look,
    id: historyId,
    lookId,
    wornAt: new Date().toISOString(),
  };

  await writeList(HISTORY_KEY, [historyEntry, ...history]);
  return true;
}
