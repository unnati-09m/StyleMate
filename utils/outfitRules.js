function matchesFilters(item, occasion, season) {
  const occasionMatches = item.occasion === occasion || item.occasion === "Casual";
  const seasonMatches =
    season === "All season" ||
    item.season === "All season" ||
    item.season === season;

  return occasionMatches && seasonMatches;
}

export function buildOutfit(items, occasion, season) {
  if (!Array.isArray(items) || items.length === 0) return null;

  const suitableItems = items.filter((item) =>
    matchesFilters(item, occasion, season)
  );

  const dress = suitableItems.find((item) => item.category === "Dress");
  const top = suitableItems.find((item) => item.category === "Top");
  const bottom = suitableItems.find((item) => item.category === "Bottom");
  const shoes = suitableItems.find((item) => item.category === "Shoes");
  const accessory = suitableItems.find((item) => item.category === "Accessory");

  let selectedItems = [];

  if (dress) {
    selectedItems = [dress];
  } else if (top && bottom) {
    selectedItems = [top, bottom];
  } else {
    return null;
  }

  if (shoes) selectedItems.push(shoes);
  if (accessory) selectedItems.push(accessory);

  const itemIds = selectedItems.map((item) => item.id).sort();

  return {
    id: "look-" + itemIds.join("-") + "-" + occasion.toLowerCase(),
    title: occasion + " outfit",
    occasion,
    season,
    items: selectedItems,
    createdAt: new Date().toISOString(),
  };
}
