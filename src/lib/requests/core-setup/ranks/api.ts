import { apiRequest } from "@/lib/api-request";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { RankPayload } from "./type";

export const useGetRanks = () =>
  useQuery({
    queryKey: ["ranks"],
    queryFn: () => apiRequest("get", "/companies/ranks/"),
  });

export const useCreateRanks = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: RankPayload) =>
      apiRequest("post", `/companies/ranks/`, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["ranks"] }),
  });
};

export const useUpdateRanks = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: RankPayload) =>
      apiRequest("put", `/companies/ranks/${payload.id}/`, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["ranks"] }),
  });
};

export const useDeleteRanks = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (rankId: number) =>
      apiRequest("delete", `/companies/ranks/${rankId}/`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["ranks"] }),
  });
};

export const useGetPresignedUrl = () => {
  return useMutation({
    mutationFn: (payload: { s3Key: string }) =>
      apiRequest("post", "/core/s3/presigned_url/", payload),
  });
};
