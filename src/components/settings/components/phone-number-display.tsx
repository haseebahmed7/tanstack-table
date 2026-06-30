"use client";

import { parsePhoneNumberFromString } from "libphonenumber-js";
import { cn } from "@/lib/utils";

/**
 * Converts ISO 3166-1 alpha-2 country code to flag emoji.
 * e.g. "GB" -> 🇬🇧
 */
function countryToFlagEmoji(countryCode: string): string {
  if (!countryCode || countryCode.length !== 2) return "";
  return [...countryCode.toUpperCase()]
    .map((char) => String.fromCodePoint(0x1f1e6 - 65 + char.charCodeAt(0)))
    .join("");
}

export interface PhoneNumberDisplayProps {
  /** Phone number in E.164 format (digits only, e.g. "441242535900") */
  value: string | null | undefined;
  className?: string;
  /** Fallback when value is empty or invalid */
  fallback?: string;
}

/**
 * Displays a phone number with country flag and formatted with + and spaces.
 * e.g. "441242535900" -> 🇬🇧 +44 1242 535900
 */
export function PhoneNumberDisplay({
  value,
  className,
  fallback = "—",
}: PhoneNumberDisplayProps) {
  if (!value || typeof value !== "string") {
    return (
      <span className={cn("text-muted-foreground", className)}>{fallback}</span>
    );
  }

  const normalized = value.replace(/\D/g, "");
  if (!normalized.length) {
    return (
      <span className={cn("text-muted-foreground", className)}>{fallback}</span>
    );
  }

  try {
    const phoneNumber = parsePhoneNumberFromString("+" + normalized);
    if (!phoneNumber) {
      return (
        <span className={cn("text-muted-foreground", className)}>
          {value || fallback}
        </span>
      );
    }

    const formatted = phoneNumber.formatInternational();
    const country = phoneNumber.country;
    const flag = country ? countryToFlagEmoji(country) : "";

    return (
      <span className={cn("inline-flex items-center gap-1.5", className)}>
        {flag && (
          <span className="text-base leading-none" aria-hidden>
            {flag}
          </span>
        )}
        <span>{formatted}</span>
      </span>
    );
  } catch {
    return (
      <span className={cn("text-muted-foreground", className)}>
        {value || fallback}
      </span>
    );
  }
}
