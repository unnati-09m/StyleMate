import AsyncStorage from "@react-native-async-storage/async-storage";

const FAVOURITES_KEY = "stylemate-favourites";
const HISTORY_KEY = "stylemate-history";

function getLocalDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return year + "-" + month + "-" + day;
}

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
  const today = getLocalDateKey();
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
