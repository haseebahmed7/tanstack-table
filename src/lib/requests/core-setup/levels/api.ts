import { apiRequest } from "@/lib/api-request";
import { getSuccessMessage } from "@/lib/error-handler";
import { ToastService } from "@/lib/toast/toast-service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DeleteLevelPayload, Level, UpdateLevelPayload } from "./types";

export const useGetLevelsById = (levelId: number | null) => {
  return useQuery({
    queryKey: ["level", levelId],
    queryFn: () => apiRequest("get", `/companies/levels/${levelId}/`),
    enabled: !!levelId,
    retry: 1,
  });
};

export const useGetLevelForest = () => {
  return useQuery({
    queryKey: ["levelForest"],
    queryFn: () => apiRequest("get", `/companies/levels/forest/`),
  });
};

export const useGetLevelTree = (levelId: number | null) => {
  return useQuery({
    queryKey: ["level", levelId],
    queryFn: () => apiRequest("get", `/companies/levels/${levelId}/tree/`),
    enabled: !!levelId,
    retry: 1,
  });
};

export const useCreateLevel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Level) =>
      apiRequest("post", `/companies/levels/`, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["levelForest"] });
      ToastService.show(getSuccessMessage(data), {
        type: "success",
      });
    },
  });
};

export const useUpdateLevel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateLevelPayload) =>
      apiRequest("put", `/companies/levels/${payload.id}/`, payload),

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["levelForest"],
      });

      ToastService.show(getSuccessMessage(data), {
        type: "success",
      });
    },
  });
};

export const useDeleteLevel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (levelId: number) =>
      apiRequest("delete", `/companies/levels/${levelId}/`),

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["levelForest"],
      });

      ToastService.show(getSuccessMessage(data), {
        type: "success",
      });
    },
  });
};
