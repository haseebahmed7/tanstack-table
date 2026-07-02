"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import Toast from "../common/toast";

type ToastType = "success" | "error";

interface ToastContextType {
  success: (message: string) => void;
  error: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);

  const toastMethods = {
    success: (message: string) => setToast({ message, type: "success" }),
    error: (message: string) => setToast({ message, type: "error" }),
  };

  return (
    <ToastContext.Provider value={toastMethods}>
      {/* children ka matlab hai aapki poori app ka code */}
      {children}

      {/* Agar state mein toast hai, to UI par dikhao */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </ToastContext.Provider>
  );
};

// Custom Hook taakay doosre components isay asaani se use kar saken
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
