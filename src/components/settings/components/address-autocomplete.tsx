"use client";

/// <reference path="../../../types/google-maps.d.ts" />

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { PlaceDetails } from "@/lib/requests/core-setup/locations/types";
import { useGoogleMapsOptional } from "@/components/providers/google-map-provider";

// Extract city, state, country, postal code from Google address_components
function parseAddressComponents(
  components: Array<{ long_name: string; types: string[] }> | undefined,
): Pick<PlaceDetails, "city" | "state" | "country" | "postalCode"> {
  const result: Pick<
    PlaceDetails,
    "city" | "state" | "country" | "postalCode"
  > = {};
  if (!components?.length) return result;
  for (const c of components) {
    if (c.types.includes("locality")) result.city = c.long_name;
    if (c.types.includes("administrative_area_level_1"))
      result.state = c.long_name;
    if (c.types.includes("country")) result.country = c.long_name;
    if (c.types.includes("postal_code")) result.postalCode = c.long_name;
  }
  return result;
}

const DEBOUNCE_MS = 300;
const MIN_QUERY_LENGTH = 2;

export interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onPlaceSelect?: (details: PlaceDetails) => void;
  label?: ReactNode;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  id?: string;
  className?: string;
  containerClassName?: string;
  countryRestriction?: string;
}

export function AddressAutocomplete({
  value,
  onChange,
  onPlaceSelect,
  label,
  placeholder = "Search address...",
  required,
  disabled = false,
  error,
  id,
  className,
  containerClassName,
  countryRestriction,
}: AddressAutocompleteProps) {
  const { isLoaded } = useGoogleMapsOptional() ?? { isLoaded: false };
  const [query, setQuery] = useState(value);
  const [predictions, setPredictions] = useState<
    google.maps.places.AutocompletePrediction[]
  >([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isFetching, setIsFetching] = useState(false);
  const [dropdownRect, setDropdownRect] = useState<{
    top: number;
    left: number;
    width: number;
    relativeTop: number;
    relativeLeft: number;
  } | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const selectingRef = useRef(false);
  const skipNextFetchRef = useRef(false);
  const prevValueRef = useRef<string>(value);

  const autocompleteService =
    useRef<google.maps.places.AutocompleteService | null>(null);
  const placesService = useRef<google.maps.places.PlacesService | null>(null);
  const geocoder = useRef<google.maps.Geocoder | null>(null);
  const placesServiceDivRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !window.google?.maps?.places) return;
    const places = window.google.maps.places as typeof google.maps.places & {
      AutocompleteService: new () => google.maps.places.AutocompleteService;
      PlacesService: new (
        attr: HTMLDivElement,
      ) => google.maps.places.PlacesService;
    };
    const maps = window.google.maps as typeof google.maps & {
      Geocoder: new () => google.maps.Geocoder;
    };
    autocompleteService.current = new places.AutocompleteService();
    geocoder.current = new maps.Geocoder();
    const div = placesServiceDivRef.current;
    if (div) {
      placesService.current = new places.PlacesService(div);
    }
  }, [isLoaded]);

  useEffect(() => {
    if (!isLoaded || placesService.current) return;
    const div = placesServiceDivRef.current;
    if (div && window.google?.maps?.places) {
      const places = window.google.maps.places as typeof google.maps.places & {
        PlacesService: new (
          attr: HTMLDivElement,
        ) => google.maps.places.PlacesService;
      };
      placesService.current = new places.PlacesService(div);
    }
  });

  useEffect(() => {
    const prev = prevValueRef.current;
    prevValueRef.current = value;
    if (prev !== value) {
      setQuery(value);
      skipNextFetchRef.current = true;
      setPredictions([]);
      setIsOpen(false);
      setActiveIndex(-1);
    }
  }, [value]);

  const fetchPredictions = useCallback(
    (input: string) => {
      if (!autocompleteService.current || input.length < MIN_QUERY_LENGTH) {
        setPredictions([]);
        setIsOpen(false);
        return;
      }
      setIsFetching(true);
      const request: google.maps.places.AutocompletionRequest = {
        input,
      };
      if (countryRestriction) {
        request.componentRestrictions = { country: countryRestriction };
      }
      autocompleteService.current.getPlacePredictions(
        request,
        (results, status) => {
          setIsFetching(false);
          if (status === "OK" && results?.length) {
            setPredictions(results);
            setIsOpen(true);
            setActiveIndex(-1);
          } else {
            setPredictions([]);
            setIsOpen(false);
          }
        },
      );
    },
    [countryRestriction],
  );

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (skipNextFetchRef.current) {
      skipNextFetchRef.current = false;
      setPredictions([]);
      setIsOpen(false);
      return;
    }
    if (!query.trim()) {
      setPredictions([]);
      setIsOpen(false);
      return;
    }
    if (value.trim() && query.trim() === value.trim()) {
      setPredictions([]);
      setIsOpen(false);
      return;
    }
    debounceRef.current = setTimeout(() => {
      fetchPredictions(query);
      debounceRef.current = null;
    }, DEBOUNCE_MS);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, value, fetchPredictions]);

  const getPlaceDetails = useCallback(
    (placeId: string): Promise<PlaceDetails | null> => {
      return new Promise((resolve) => {
        if (placesService.current) {
          placesService.current.getDetails(
            {
              placeId,
              fields: ["formatted_address", "geometry", "address_components"],
            },
            (place, status) => {
              if (
                status === "OK" &&
                place?.geometry?.location &&
                place.formatted_address
              ) {
                const loc = place.geometry!.location!;
                const parsed = parseAddressComponents(place.address_components);
                resolve({
                  address: place.formatted_address,
                  lat: loc.lat(),
                  lng: loc.lng(),
                  placeId,
                  ...parsed,
                });
                return;
              }
              resolve(null);
            },
          );
          return;
        }
        if (geocoder.current) {
          geocoder.current.geocode({ placeId }, (results, status) => {
            if (
              status === "OK" &&
              results?.[0]?.geometry?.location &&
              results[0].formatted_address
            ) {
              const loc = results[0].geometry!.location!;
              const parsed = parseAddressComponents(
                results[0].address_components,
              );
              resolve({
                address: results[0].formatted_address,
                lat: loc.lat(),
                lng: loc.lng(),
                placeId,
                ...parsed,
              });
            } else {
              resolve(null);
            }
          });
        } else {
          resolve(null);
        }
      });
    },
    [],
  );

  const geocodeAddress = useCallback(
    (address: string): Promise<PlaceDetails | null> => {
      return new Promise((resolve) => {
        if (!geocoder.current) {
          resolve(null);
          return;
        }
        geocoder.current.geocode({ address }, (results, status) => {
          if (
            status === "OK" &&
            results?.[0]?.geometry?.location &&
            results[0].formatted_address
          ) {
            const loc = results[0].geometry!.location!;
            const parsed = parseAddressComponents(
              results[0].address_components,
            );
            resolve({
              address: results[0].formatted_address,
              lat: loc.lat(),
              lng: loc.lng(),
              ...parsed,
            });
          } else {
            resolve(null);
          }
        });
      });
    },
    [],
  );

  const handleSelect = useCallback(
    async (prediction: google.maps.places.AutocompletePrediction) => {
      if (selectingRef.current) return;
      selectingRef.current = true;
      setPredictions([]);
      setIsOpen(false);
      skipNextFetchRef.current = true;
      try {
        const details = await getPlaceDetails(prediction.place_id);
        const addressToShow = details?.address ?? prediction.description;
        onChange(addressToShow);
        setQuery(addressToShow);
        if (details) {
          onPlaceSelect?.(details);
        } else {
          const fallback = await geocodeAddress(prediction.description);
          if (fallback) {
            onPlaceSelect?.(fallback);
          }
        }
      } finally {
        setTimeout(() => {
          selectingRef.current = false;
        }, 300);
      }
    },
    [getPlaceDetails, geocodeAddress, onChange, onPlaceSelect],
  );

  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    const next = e.relatedTarget as Node | null;
    if (listRef.current?.contains(next)) {
      return;
    }
    setTimeout(() => {
      setIsOpen(false);
      setActiveIndex(-1);
    }, 200);
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (!isOpen || !predictions.length) return;
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setActiveIndex((prev) =>
            prev < predictions.length - 1 ? prev + 1 : 0,
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setActiveIndex((prev) =>
            prev <= 0 ? predictions.length - 1 : prev - 1,
          );
          break;
        case "Enter":
          e.preventDefault();
          if (activeIndex >= 0 && predictions[activeIndex]) {
            handleSelect(predictions[activeIndex]);
          }
          break;
        case "Escape":
          setIsOpen(false);
          setActiveIndex(-1);
          break;
        default:
          break;
      }
    },
    [isOpen, predictions, activeIndex, handleSelect],
  );

  useEffect(() => {
    if (activeIndex < 0 || !listRef.current) return;
    const el = listRef.current.children[activeIndex] as HTMLElement;
    el?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [activeIndex]);

  const updateDropdownRect = useCallback(() => {
    const input = inputRef.current;
    const container = containerRef.current;
    if (!input || !container) return;
    const inputRect = input.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    setDropdownRect({
      top: inputRect.bottom,
      left: inputRect.left,
      width: inputRect.width,
      relativeTop: inputRect.bottom - containerRect.top,
      relativeLeft: inputRect.left - containerRect.left,
    });
  }, []);

  useLayoutEffect(() => {
    if (isOpen && predictions.length > 0) {
      updateDropdownRect();
    } else {
      setDropdownRect(null);
    }
  }, [isOpen, predictions.length, updateDropdownRect]);

  useEffect(() => {
    if (!isOpen) return;
    const onScrollOrResize = () => updateDropdownRect();
    window.addEventListener("scroll", onScrollOrResize, true);
    window.addEventListener("resize", onScrollOrResize);
    return () => {
      window.removeEventListener("scroll", onScrollOrResize, true);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [isOpen, updateDropdownRect]);

  const inputId = useMemo(
    () =>
      id ?? `address-autocomplete-${Math.random().toString(36).slice(2, 9)}`,
    [id],
  );

  return (
    <div
      ref={containerRef}
      className={cn("relative space-y-1.5", containerClassName)}
    >
      {/* Hidden div required by Google PlacesService.getDetails() */}
      <div
        ref={placesServiceDivRef}
        className="absolute size-0 overflow-hidden opacity-0 pointer-events-none"
        aria-hidden
      />
      {label && (
        <label
          htmlFor={inputId}
          className={cn(
            "text-sm font-medium leading-none",
            error && "text-destructive",
          )}
        >
          {label}
          {required && <span className="text-destructive ml-0.5">*</span>}
        </label>
      )}
      <div className="relative">
        <Input
          id={inputId}
          ref={inputRef}
          type="text"
          autoComplete="off"
          role="combobox"
          aria-expanded={isOpen}
          aria-autocomplete="list"
          aria-controls={isOpen ? `${inputId}-listbox` : undefined}
          aria-activedescendant={
            isOpen && activeIndex >= 0
              ? `${inputId}-option-${activeIndex}`
              : undefined
          }
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          onFocus={() =>
            query.length >= MIN_QUERY_LENGTH &&
            predictions.length > 0 &&
            setIsOpen(true)
          }
          placeholder={placeholder}
          disabled={disabled}
          className={cn(className)}
          aria-invalid={!!error}
        />
        {isFetching && (
          <div className="text-muted-foreground pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs">
            Searching...
          </div>
        )}
      </div>
      {isOpen && predictions.length > 0 && dropdownRect && (
        <ul
          id={`${inputId}-listbox`}
          ref={listRef}
          role="listbox"
          className="absolute max-h-60 overflow-auto rounded-md border border-gray-200 bg-white py-1 text-gray-900 shadow-lg"
          style={{
            top: dropdownRect.relativeTop,
            left: dropdownRect.relativeLeft,
            width: dropdownRect.width,
            zIndex: 9999,
            isolation: "isolate",
          }}
        >
          {predictions.map((p, i) => (
            <li
              key={p.place_id}
              id={`${inputId}-option-${i}`}
              role="option"
              aria-selected={activeIndex === i}
              tabIndex={-1}
              className={cn(
                "cursor-pointer px-3 py-2 text-sm outline-none transition-colors select-none hover:bg-accent hover:text-accent-foreground",
                activeIndex === i && "bg-accent text-accent-foreground",
              )}
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleSelect(p);
              }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleSelect(p);
              }}
            >
              {p.description}
            </li>
          ))}
        </ul>
      )}
      {error && (
        <p className="text-destructive text-sm" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
