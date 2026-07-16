import { apiRequest } from "@/lib/api-request";
import { useQuery } from "@tanstack/react-query";

export const useGetShiftTypes = () => {
  return useQuery({
    queryKey: ["shift-types"],
    queryFn: () => apiRequest("get", "/shifts/types/"),
  });
};
