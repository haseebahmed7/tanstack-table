"use client";

import { fDate } from "@/lib/format-date";
import { useEffect, useState } from "react";

export default function CurrentTime() {
  const [dateTime, setDateTime] = useState(new Date());
  const [timeString, setTimeString] = useState("");
  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const dayName = dateTime.toLocaleDateString("en-US", { weekday: "long" });
  const monthName = dateTime.toLocaleDateString("en-US", { month: "long" });

  const day = String(dateTime.getDate()).padStart(2, "0");
  const month = monthName;
  const year = dateTime.getFullYear();
  const dateString = `${day}-${month}-${year}`;

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formatted = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      setTimeString(formatted);
    };

    updateTime(); // initial render
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!timeString) return null; // ensures no mismatch on SSR

  return (
    <div className="text-md flex space-x-2">
      <div className="flex gap-1">
        <p>{dayName}</p>
        <p>{fDate(dateString)}</p>
      </div>
      <div>
        <p> - {timeString}</p>
      </div>
    </div>
  );
}
