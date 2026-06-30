/**
 * Minimal declarations for Google Maps JavaScript API (loaded at runtime).
 */
declare namespace google {
  namespace maps {
    interface GeocoderAddressComponent {
      long_name: string;
      short_name: string;
      types: string[];
    }
    namespace places {
      interface AutocompletePrediction {
        place_id: string;
        description: string;
        structured_formatting?: { main_text: string; secondary_text: string };
      }
      interface AutocompletionRequest {
        input: string;
        componentRestrictions?: { country: string };
      }
      enum PlacesServiceStatus {
        OK = "OK",
        ZERO_RESULTS = "ZERO_RESULTS",
      }
      interface AutocompleteService {
        getPlacePredictions(
          request: AutocompletionRequest,
          callback: (
            results: AutocompletePrediction[] | null,
            status: PlacesServiceStatus,
          ) => void,
        ): void;
      }
      interface PlaceResult {
        place_id?: string;
        formatted_address?: string;
        geometry?: { location?: { lat(): number; lng(): number } };
        address_components?: google.maps.GeocoderAddressComponent[];
      }
      interface PlaceDetailsRequest {
        placeId: string;
        fields?: string[];
      }
      class PlacesService {
        constructor(attrContainer: HTMLDivElement | google.maps.Map);
        getDetails(
          request: PlaceDetailsRequest,
          callback: (
            place: PlaceResult | null,
            status: PlacesServiceStatus,
          ) => void,
        ): void;
      }
    }
    enum GeocoderStatus {
      OK = "OK",
      ERROR = "ERROR",
    }
    interface GeocoderResult {
      formatted_address?: string;
      geometry?: { location?: { lat(): number; lng(): number } };
      address_components?: GeocoderAddressComponent[];
    }
    class Geocoder {
      geocode(
        request: {
          placeId?: string;
          location?: { lat: number; lng: number };
          address?: string;
        },
        callback: (
          results: GeocoderResult[] | null,
          status: GeocoderStatus,
        ) => void,
      ): void;
    }
    class Map {
      constructor(el: HTMLElement, opts?: object);
      setCenter(center: LatLng | LatLngLiteral): void;
      setZoom(zoom: number): void;
    }
    class Marker {
      constructor(opts?: object);
      setMap(map: Map | null): void;
      setPosition(position: LatLng): void;
      getPosition(): LatLng | null;
      addListener(event: string, handler: () => void): void;
    }
    interface LatLngLiteral {
      lat: number;
      lng: number;
    }
    class LatLng {
      constructor(lat: number, lng: number);
      lat(): number;
      lng(): number;
    }
    namespace event {
      function trigger(instance: object, eventName: string): void;
    }
  }
}
