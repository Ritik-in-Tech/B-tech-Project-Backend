export const isTimeInRange = (start, end, currentTime) => {
  if (end < start) {
    return currentTime >= start || currentTime <= end;
  }
  return currentTime >= start && currentTime <= end;
};
