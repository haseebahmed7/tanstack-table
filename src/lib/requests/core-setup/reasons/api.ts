import { apiRequest } from "@/lib/api-request";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetReasons = () =>
  useQuery({
    queryKey: ["reasons"],
    queryFn: () => apiRequest("get", "/companies/reasons/"),
  });

export const useGetReasonById = (reasonId: number | null) =>
  useQuery({
    queryKey: ["reasons", reasonId],
    queryFn: () => apiRequest("get", `/companies/grades/${reasonId}/`),
    enabled: !!reasonId,
    retry: 1,
  });

export const useCreateReson = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { message: string; type: string }) =>
      apiRequest("post", `/companies/reasons/`, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["reasons"] }),
  });
};

export const useUpdateReason = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { id: number; message: string; type: string }) =>
      apiRequest("put", `/companies/reasons/${payload.id}/`, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["reasons"] }),
  });
};

export const useDeleteReason = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reasonId: number) =>
      apiRequest("delete", `/companies/reasons/${reasonId}/`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["reasons"] }),
  });
};
