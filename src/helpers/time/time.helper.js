export function getCurrentIndianTime() {
  let currentDate = new Date();
  let utcTime = currentDate.getTime();
  let istOffset = 5.5 * 60 * 60 * 1000;
  let istTime = new Date(utcTime + istOffset);
  return istTime;
}

export function convertToIST(date) {
  let currentDate = new Date(date);
  let utcTime = currentDate.getTime();
  let istOffset = 5.5 * 60 * 60 * 1000;
  let istTime = new Date(utcTime + istOffset);
  return istTime;
}

export function getCurrentUTCTime() {
  return new Date();
}

export function getCurrentHoursMinutes(dateInput) {
  let dateString;
  if (dateInput instanceof Date) {
    dateString = dateInput.toISOString();
  } else if (typeof dateInput === "string") {
    dateString = dateInput;
  } else {
    throw new TypeError("Input must be a string or Date object");
  }
  const cleanDateString = dateString.replace("Z", "");

  const timePart = cleanDateString.split("T")[1];

  const hours = timePart.slice(0, 2);
  const minutes = timePart.slice(3, 5);

  const currentHour = parseInt(hours, 10);
  const currentMinute = parseInt(minutes, 10);

  return { currentHour, currentMinute };
}
