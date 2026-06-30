import { apiRequest } from "@/lib/api-request";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CreateLocationPayload,
  Location,
  UpdateLocationPayload,
} from "./types";

export const useGetLocations = () =>
  useQuery({
    queryKey: ["locations"],
    queryFn: () => apiRequest("get", "/companies/locations/"),
  });

export const useDeleteLocation = () => {
  const queryClient = useQueryClient();
  // useQueryClient hum is liye use karte hain kyun ke React Query ka sara data cache me hota hai. Kabhi kabhi jab hum koi mutation (jaise delete, update, add) karte hain to cache automatically update nahi hota.

  return useMutation({
    mutationFn: (locationId: number) =>
      apiRequest("delete", `/companies/locations/${locationId}/`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["locations"] }),
    // jab delete successfully ho jaye, to hum "locations" wali query ko invalidate kar dete hain
    // invalidateQueries ka matlab: purana cached data invalid ho jata hai
    // aur React Query dobara fresh data API se fetch karta hai
  });
};
//Kab use hota hai:
// Jab aap data delete karte ho
// Jab aap data update karte ho
// Jab aap naya data add karte ho

export const useCreateLocation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateLocationPayload) =>
      apiRequest("post", `/companies/locations/`, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["locations"] }),
  });
};

export const useUpdateLocation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: UpdateLocationPayload) =>
      apiRequest("put", `/companies/locations/${id}/`, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["locations"] }),
  });
};
