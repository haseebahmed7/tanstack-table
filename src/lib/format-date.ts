import {
  format,
  formatDistanceToNow,
  getTime,
  isValid as isDateValid,
  startOfDay,
  toDate,
} from "date-fns";

export type DatePickerFormat = Date | string | number | null | undefined;

/**
 * Docs: https://date-fns.org/v2.30.0/docs/format
 */
/** 12-hour time display format: "8:00 AM", "5:30 PM" */
export const FORMAT_TIME_12H = "h:mm a";

export const formatStr = {
  dateTime: "dd MMM yyyy HH:mm", // 17 Apr 2022 23:00
  date: "dd MMM yyyy", // 17 Apr 2022
  isoDate: "yyyy-MM-dd", // 2022-04-17
  time: "HH:mm", // 23:00
  time12h: FORMAT_TIME_12H,
  dateTimeShort: "MMM d, HH:mm", // Apr 17, 23:00
  split: {
    dateTime: "dd/MM/yyyy HH:mm", // 17/04/2022 23:00
    date: "dd/MM/yyyy", // 17/04/2022
    dateUS: "MM/dd/yyyy", // 04/17/2022
    dateUSTime: "MM/dd/yyyy HH:mm", // 04/17/2022 23:00
  },
  paramCase: {
    dateTime: "dd-MM-yyyy HH:mm", // 17-04-2022 23:00
    date: "dd-MM-yyyy", // 17-04-2022
    dateTimeUS: "MM-dd-yyyy HH:mm",
  },
};

export function today(formatString?: string) {
  return format(startOfDay(new Date()), formatString ?? formatStr.date);
}

/** output: 17 Apr 2022 12:00 am
 */
export function fDateTime(date: DatePickerFormat, formatStrParam?: string) {
  if (!date) return null;

  const dateObj = toDate(date);
  const isValid = isDateValid(dateObj);

  return isValid
    ? format(dateObj, formatStrParam ?? formatStr.dateTime)
    : "Invalid date-time value";
}

export function parseToUTCISOString(dateStr: string): string {
  // Note: date-fns doesn't have direct UTC parsing like dayjs
  // This implementation might need adjustment based on your exact needs
  return new Date(dateStr).toISOString();
}

/** output: 17 Apr 2022
 */
export function fDate(date: DatePickerFormat, formatStrParam?: string) {
  if (!date) {
    return null;
  }

  const dateObj = toDate(date);
  const isValid = isDateValid(dateObj);

  return isValid
    ? format(dateObj, formatStrParam ?? formatStr.split.date)
    : "Invalid time value";
}

export function fDateISO(date: DatePickerFormat) {
  if (!date) {
    return null;
  }

  const dateObj = toDate(date);
  const isValid = isDateValid(dateObj);

  return isValid
    ? format(dateObj, formatStr.isoDate)
    : "Invalid ISO date value";
}

/**
 * Convert 24-hour time string (HH:mm:ss or HH:mm) to 12-hour format with AM/PM.
 * E.g. "08:00:00" → "8:00 AM", "17:30:00" → "5:30 PM"
 */
export function formatTime12h(timeStr: string | null | undefined): string {
  if (!timeStr || typeof timeStr !== "string") return "";
  const parts = timeStr.trim().split(":");
  const hours = parseInt(parts[0] || "0", 10);
  const minutes = parseInt(parts[1] || "0", 10);
  const date = new Date(2000, 0, 1, hours, minutes);
  return format(date, FORMAT_TIME_12H);
}

/**
 * Format a time range in 12-hour format.
 * E.g. ("08:00:00", "17:00:00") → "8:00 AM - 5:00 PM"
 */
export function formatTimeRange12h(
  start: string | null | undefined,
  end: string | null | undefined,
): string {
  if (!start || !end) return "";
  return `${formatTime12h(start)} - ${formatTime12h(end)}`;
}

/**
 * Parse time string (HH:mm:ss or HH:mm) to total minutes from midnight.
 */
function timeToMinutes(timeStr: string): number {
  const parts = timeStr.trim().split(":");
  const h = parseInt(parts[0] || "0", 10);
  const m = parseInt(parts[1] || "0", 10);
  return h * 60 + m;
}

/**
 * Calculate total paid hours for a shift.
 * If break is included in cost: total = end - start.
 * If break excluded: total = end - start - breakDuration.
 */
export function getShiftTotalHours(
  startTime: string,
  endTime: string,
  breakDurationMinutes: number,
  isBreakIncludedInCost: boolean,
): number {
  const startMins = timeToMinutes(startTime);
  const endMins = timeToMinutes(endTime);
  let totalMins = endMins - startMins;
  if (totalMins < 0) totalMins += 24 * 60; // handle overnight
  if (!isBreakIncludedInCost) totalMins -= breakDurationMinutes;
  return Math.max(0, totalMins) / 60;
}

/** output: 12:00 am
 */
export function fTime(date: DatePickerFormat, formatStrParam?: string) {
  if (!date) {
    return null;
  }

  const dateObj = toDate(date);
  const isValid = isDateValid(dateObj);

  if (!isValid) return "Invalid time value";

  // If the input is a string ending with 'Z', we want to show the UTC time
  // to avoid timezone conversion issues on the client side.
  // We use UTC methods to ensure we get the same hours/minutes as stored in the string.
  if (typeof date === "string" && date.endsWith("Z")) {
    const utcHours = dateObj.getUTCHours().toString().padStart(2, "0");
    const utcMinutes = dateObj.getUTCMinutes().toString().padStart(2, "0");

    if (formatStrParam === formatStr.time || !formatStrParam) {
      return `${utcHours}:${utcMinutes}`;
    }
  }

  // Fallback to local time for non-ISO strings or explicit formats
  return format(dateObj, formatStrParam ?? formatStr.time);
}

/** output: 1713250100
 */
export function fTimestamp(date: DatePickerFormat) {
  if (!date) {
    return null;
  }

  const dateObj = toDate(date);
  const isValid = isDateValid(dateObj);

  return isValid ? getTime(dateObj) : "Invalid timestamp value";
}

/** output: a few seconds, 2 years
 */
export function fToNow(date: DatePickerFormat) {
  if (!date) {
    return null;
  }

  const dateObj = toDate(date);
  const isValid = isDateValid(dateObj);

  return isValid
    ? formatDistanceToNow(dateObj, { addSuffix: false })
    : "Invalid relative time value";
}
