// Sirf input wali fields
export interface LocationInput {
  title: string;
  address: string;
  phoneNumber: string;
  country?: string | null;
  state?: string | null;
  city?: string | null;
  zipCode?: string | null;
  street?: string | null;
  buildingNumber?: string | null;
  floor?: string | null;
  apartmentNumber?: string | null;
  additionalInfo?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}

// Jo server se record aata hai
export interface Location extends LocationInput {
  id: number;
  created: string;
  modified: string;
}

// Create ke liye: Sirf input fields chahiye
export type CreateLocationPayload = LocationInput;

// Update ke liye: ID + Input fields
export type UpdateLocationPayload = {
  id: number;
  data: LocationInput;
};

export interface PlaceDetails {
  address: string;
  lat: number;
  lng: number;
  placeId?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
}

export interface LatLng {
  lat: number;
  lng: number;
}

export interface PlacePrediction {
  placeId: string;
  description: string;
  structuredFormat?: { mainText: string; secondaryText: string };
}
