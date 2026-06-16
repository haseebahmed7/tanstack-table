"use client";

import { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

type UserContextType = {
  avatarPhotoUrl?: string;
  setAvatarPhotoUrl: (url?: string) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [avatarPhotoUrl, setAvatarPhotoUrlState] = useState<string | undefined>(
    undefined,
  );

  useEffect(() => {
    const savedAvatar = Cookies.get("avatarPhotoUrl");
    if (savedAvatar) setAvatarPhotoUrlState(savedAvatar);
  }, []);

  const setAvatarPhotoUrl = (url?: string) => {
    if (url) {
      Cookies.set("avatarPhotoUrl", url, { path: "/" });
    } else {
      Cookies.remove("avatarPhotoUrl", { path: "/" });
    }
    setAvatarPhotoUrlState(url);
  };

  return (
    <UserContext.Provider value={{ avatarPhotoUrl, setAvatarPhotoUrl }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error("useUser must be used within UserProvider");
  }
  return ctx;
}
