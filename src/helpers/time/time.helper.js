export function getCurrentIndianTime() {
  let currentDate = new Date();
  let utcTime = currentDate.getTime();
  let istOffset = 5.5 * 60 * 60 * 1000;
  let istTime = new Date(utcTime + istOffset);
  return istTime;
}

export function getCurrentUTCTime() {
  return new Date();
}
