export const addOrUpdateEntry = async (
  messDocument,
  date,
  type,
  isDone = false
) => {
  const dateKey = date.toISOString().split("T")[0];

  if (messDocument.data.has(dateKey)) {
    const existingEntries = messDocument.data.get(dateKey);

    const mealIndex = existingEntries.findIndex((entry) => entry.type === type);

    if (mealIndex > -1) {
      existingEntries[mealIndex].isDone = isDone;
    } else {
      existingEntries.push({ type, isDone });
    }

    messDocument.data.set(dateKey, existingEntries);
  } else {
    messDocument.data.set(dateKey, [{ type, isDone }]);
  }

  await messDocument.save();
};
