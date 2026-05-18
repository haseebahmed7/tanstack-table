"use client";
import { useEffect } from "react";

interface ToastProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    // 3 second (3000ms) baad toast khud band ho jaye ga
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    // Cleanup function: Agar component pehle unmount ho jaye to timer clear ho jaye
    return () => clearTimeout(timer);
  }, [onClose]);

  // Type ke mutabiq rang badlein
  const bgColor = type === "success" ? "bg-green-600" : "bg-red-600";

  return (
    <div
      className={`fixed top-5 right-5 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all transform translate-y-0 animate-in fade-in duration-300`}
    >
      <div className="flex items-center gap-3">
        <span className="font-medium">{message}</span>
        <button
          onClick={onClose}
          className="ml-4 font-bold hover:text-gray-200 cursor-pointer"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
