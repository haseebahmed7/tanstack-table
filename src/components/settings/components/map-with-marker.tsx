"use client";

import { useGoogleMapsOptional } from "@/components/providers/google-map-provider";
import { LatLng } from "@/lib/requests/company/types";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useRef, useState } from "react";

const DEFAULT_CENTER: LatLng = { lat: 20, lng: 0 };
const DEFAULT_ZOOM = 2;
const MARKER_ZOOM = 16;

export interface ReverseGeocodeDetails {
  address: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
}

export interface MapWithMarkerProps {
  /** Center of the map; when set, marker is shown and map pans to this location */
  center: LatLng | null;
  /** Called when user drags the marker to a new position (with reverse-geocoded address and address components) */
  onMarkerPositionChange?: (
    lat: number,
    lng: number,
    address: string,
    details: ReverseGeocodeDetails,
  ) => void;
  className?: string;
  /** Zoom when no center (world view). Default 2 */
  defaultZoom?: number;
  /** Zoom when center is set. Default 16 */
  centerZoom?: number;
  /** Map height. Default 240 */
  height?: number;
}

export function MapWithMarker({
  center,
  onMarkerPositionChange,
  className,
  defaultZoom = DEFAULT_ZOOM,
  centerZoom = MARKER_ZOOM,
  height = 240,
}: MapWithMarkerProps) {
  const { isLoaded } = useGoogleMapsOptional() ?? { isLoaded: false };
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);
  const [isReady, setIsReady] = useState(false);

  const parseAddressComponents = useCallback(
    (components: Array<{ long_name: string; types: string[] }> | undefined) => {
      const result: {
        city?: string;
        state?: string;
        country?: string;
        postalCode?: string;
      } = {};
      if (!components?.length) return result;
      for (const c of components) {
        if (c.types.includes("locality")) result.city = c.long_name;
        if (c.types.includes("administrative_area_level_1"))
          result.state = c.long_name;
        if (c.types.includes("country")) result.country = c.long_name;
        if (c.types.includes("postal_code")) result.postalCode = c.long_name;
      }
      return result;
    },
    [],
  );

  const reverseGeocode = useCallback(
    (lat: number, lng: number): Promise<ReverseGeocodeDetails> => {
      return new Promise((resolve) => {
        if (!geocoderRef.current) {
          resolve({ address: "" });
          return;
        }
        geocoderRef.current.geocode(
          { location: { lat, lng } },
          (results, status) => {
            if (status === "OK" && results?.[0]) {
              const r = results[0];
              const address = r.formatted_address ?? "";
              const parsed = parseAddressComponents(r.address_components);
              resolve({
                address,
                city: parsed.city,
                state: parsed.state,
                country: parsed.country,
                postalCode: parsed.postalCode,
              });
            } else {
              resolve({ address: "" });
            }
          },
        );
      });
    },
    [parseAddressComponents],
  );

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !window.google?.maps ||
      !mapRef.current
    )
      return;
    geocoderRef.current = new window.google.maps.Geocoder();

    const map = new window.google.maps.Map(mapRef.current, {
      center: DEFAULT_CENTER,
      zoom: defaultZoom,
      mapId: undefined,
      disableDefaultUI: false,
      zoomControl: true,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
    });

    mapInstanceRef.current = map;
    setIsReady(true);

    const resizeMap = () => {
      const map = mapInstanceRef.current;
      if (map && window.google?.maps?.event) {
        window.google.maps.event.trigger(map, "resize");
      }
    };
    const t = setTimeout(resizeMap, 100);
    const t2 = setTimeout(resizeMap, 500);

    return () => {
      clearTimeout(t);
      clearTimeout(t2);
      if (markerRef.current) {
        markerRef.current.setMap(null);
        markerRef.current = null;
      }
      mapInstanceRef.current = null;
      geocoderRef.current = null;
    };
  }, [defaultZoom, isLoaded]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (
      !map ||
      !isReady ||
      typeof window === "undefined" ||
      !window.google?.maps
    )
      return;

    if (!center) {
      map.setCenter(DEFAULT_CENTER);
      map.setZoom(defaultZoom);
      if (markerRef.current) {
        markerRef.current.setMap(null);
        markerRef.current = null;
      }
      return;
    }

    const latLng = new window.google.maps.LatLng(center.lat, center.lng);
    map.setCenter(latLng);
    map.setZoom(centerZoom);

    if (markerRef.current) {
      markerRef.current.setPosition(latLng);
      markerRef.current.setMap(map);
    } else {
      const marker = new window.google.maps.Marker({
        map,
        position: latLng,
        draggable: true,
        title: "Drag to change location",
      });

      marker.addListener("dragend", async () => {
        const pos = marker.getPosition();
        if (!pos) return;
        const lat = pos.lat();
        const lng = pos.lng();
        const details = await reverseGeocode(lat, lng);
        onMarkerPositionChange?.(lat, lng, details.address, details);
      });

      markerRef.current = marker;
    }
  }, [
    center,
    isReady,
    centerZoom,
    defaultZoom,
    onMarkerPositionChange,
    reverseGeocode,
  ]);

  useEffect(() => {
    const el = mapRef.current;
    const map = mapInstanceRef.current;
    if (!el || !map || !window.google?.maps?.event) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          window.google.maps.event.trigger(map, "resize");
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [isReady]);

  if (!isLoaded) {
    return (
      <div
        className={cn(
          "bg-muted flex items-center justify-center rounded-lg border text-muted-foreground text-sm",
          className,
        )}
        style={{ height }}
      >
        Loading map...
      </div>
    );
  }

  return (
    <div
      ref={mapRef}
      className={cn("rounded-lg border overflow-hidden w-full", className)}
      style={{ height, width: "100%", minHeight: height }}
      aria-label="Map"
    />
  );
}
