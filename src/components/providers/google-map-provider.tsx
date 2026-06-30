"use client";

import Script from "next/script";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const GOOGLE_MAPS_SCRIPT_URL = (apiKey: string) =>
  `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;

function isGoogleMapsReady(): boolean {
  return (
    typeof window !== "undefined" &&
    !!(window as unknown as { google?: { maps?: { places?: unknown } } }).google
      ?.maps?.places
  );
}

interface GoogleMapsContextValue {
  isLoaded: boolean;
  loadError: Error | null;
}

const GoogleMapsContext = createContext<GoogleMapsContextValue | null>(null);

export function useGoogleMaps(): GoogleMapsContextValue {
  const ctx = useContext(GoogleMapsContext);
  if (!ctx) {
    throw new Error("useGoogleMaps must be used within GoogleMapsProvider");
  }
  return ctx;
}

export function useGoogleMapsOptional(): GoogleMapsContextValue | null {
  return useContext(GoogleMapsContext);
}

interface GoogleMapsProviderProps {
  children: ReactNode;
  apiKey?: string;
}

export function GoogleMapsProvider({
  children,
  apiKey: apiKeyProp,
}: GoogleMapsProviderProps) {
  const apiKey =
    apiKeyProp ??
    (typeof process !== "undefined"
      ? process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
      : undefined);

  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<Error | null>(null);

  const setReady = useCallback(() => {
    if (isGoogleMapsReady()) {
      setIsLoaded(true);
      setLoadError(null);
    }
  }, []);

  const handleLoad = useCallback(() => {
    if (isGoogleMapsReady()) {
      setIsLoaded(true);
      setLoadError(null);
    } else {
      const check = setInterval(() => {
        if (isGoogleMapsReady()) {
          clearInterval(check);
          setIsLoaded(true);
          setLoadError(null);
        }
      }, 100);
      return () => clearInterval(check);
    }
  }, []);

  const handleError = useCallback(() => {
    setLoadError(new Error("Failed to load Google Maps"));
  }, []);

  useEffect(() => {
    if (isGoogleMapsReady()) {
      setIsLoaded(true);
    }
  }, []);

  const value = useMemo(
    () => ({
      isLoaded,
      loadError,
    }),
    [isLoaded, loadError],
  );

  if (!apiKey) {
    return (
      <GoogleMapsContext.Provider
        value={{
          isLoaded: false,
          loadError: new Error("Google Maps API key is missing"),
        }}
      >
        {children}
      </GoogleMapsContext.Provider>
    );
  }

  return (
    <>
      <Script
        id="google-maps-script"
        src={GOOGLE_MAPS_SCRIPT_URL(apiKey)}
        strategy="afterInteractive"
        onLoad={handleLoad}
        onError={handleError}
      />
      <GoogleMapsContext.Provider value={value}>
        {children}
      </GoogleMapsContext.Provider>
    </>
  );
}
