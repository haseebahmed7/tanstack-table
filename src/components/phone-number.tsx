"use client";

import { useEffect, useState, useRef } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import axios from "axios";

interface PhoneNumberSettingsProps {
  value: string | undefined;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: string;
  label?: string;
  required?: boolean;
}

export function PhoneNumberSettings({
  value,
  onChange,
  disabled = false,
  error,
  label,
  required = false,
}: PhoneNumberSettingsProps) {
  const [country, setCountry] = useState("gb");
  const fetchedCountry = useRef(false);

  useEffect(() => {
    if (fetchedCountry.current) return;
    fetchedCountry.current = true;

    const fetchCountry = async () => {
      try {
        const res = await axios.get("https://api.country.is/");
        setCountry(res.data.country.toLowerCase());
      } catch (error) {
        console.error("Could not detect country:", error);
      }
    };
    fetchCountry();
  }, []);

  return (
    <div className="flex flex-col space-y-1">
      <label className="text-sm font-medium text-gray-700">
        {label || "Phone Number"}
        {required && <span className="ml-2 text-red-500">*</span>}
      </label>
      <PhoneInput
        key={country}
        country={country}
        value={value || ""}
        onChange={(val) => onChange(val)}
        disabled={disabled}
        inputStyle={{
          width: "100%",
          borderRadius: "8px",
          borderColor: error ? "red" : "#e5e7eb",
          color: disabled ? "#9ca3af" : "#111827",
        }}
        buttonStyle={{
          borderColor: error ? "red" : "#e5e7eb",
          backgroundColor: disabled ? "#f9fafb" : "white",
        }}
        placeholder="Enter your phone number"
      />
      {error && (
        <p className="text-sm font-medium text-destructive mt-2">{error}</p>
      )}
    </div>
  );
}
