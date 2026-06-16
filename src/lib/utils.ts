import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Converts a string from snake_case to camelCase
 * @param str The string to convert
 * @returns camelCase string
 */
const toCamelCase = (str: string): string => {
  return str.replace(/([-_][a-z])/g, (group) =>
    group.toUpperCase().replace("-", "").replace("_", ""),
  );
};

/**
 * Recursively converts all keys in an object (or array of objects) to camelCase
 * @param obj The object or array to convert
 * @returns A new object with camelCase keys
 */
export const convertKeysToCamelCase = <T>(obj: T): T => {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => convertKeysToCamelCase(item)) as unknown as T;
  }

  const newObj: Record<string, unknown> = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const camelCaseKey = toCamelCase(key);
      newObj[camelCaseKey] = convertKeysToCamelCase(
        (obj as Record<string, unknown>)[key],
      );
    }
  }

  return newObj as T;
};

export const isoToDateNTime = (dt_str: string): string[] => {
  const dateObject = new Date(dt_str);

  // Format the date part as YYYY-MM-DD
  const year = dateObject.getFullYear();
  const month = String(dateObject.getMonth() + 1).padStart(2, "0");
  const day = String(dateObject.getDate()).padStart(2, "0");
  const dateString = `${year}-${month}-${day}`;

  // Format the time part as HH:MM
  const hours = String(dateObject.getHours()).padStart(2, "0");
  const minutes = String(dateObject.getMinutes()).padStart(2, "0");
  const timeString = `${hours}:${minutes}`;

  // Return the results as a list of strings
  return [dateString, timeString];
};

/**
 * Decode JWT token and return the payload
 * @param token JWT token string
 * @returns Decoded payload or null if invalid
 */
export const decodeJwtToken = <T = Record<string, any>>(
  token: string,
): T | null => {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;

    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );

    return JSON.parse(jsonPayload) as T;
  } catch (error) {
    console.error("Error decoding JWT token:", error);
    return null;
  }
};
