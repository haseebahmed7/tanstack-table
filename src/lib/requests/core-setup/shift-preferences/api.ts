import { apiRequest } from "@/lib/api-request";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getSuccessMessage } from "@/lib/error-handler";
import { ToastService } from "@/lib/toast/toast-service";
import {
  ShiftTypePayload,
  TimeoutRulePayload,
  UpdateShiftTypePayload,
  UpdateTimeoutRulePayload,
} from "./types";

export const useGetShiftTypes = () => {
  return useQuery({
    queryKey: ["shift-types"],
    queryFn: () => apiRequest("get", "/shifts/types/"),
  });
};

export const useGetShiftById = (shiftId: number | null) =>
  useQuery({
    queryKey: ["shift-types", shiftId],
    queryFn: () => apiRequest("get", `/shifts/types/${shiftId}/`),
    enabled: !!shiftId,
    retry: 1,
  });

export const useCreateShiftType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ShiftTypePayload) =>
      apiRequest("post", `/shifts/types/`, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["shift-types"] });

      ToastService.show(getSuccessMessage(data), {
        type: "success",
      });
    },
  });
};

export const useUpdateShiftType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateShiftTypePayload) =>
      apiRequest("put", `/shifts/types/${payload.id}/`, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["shift-types"] });

      ToastService.show(getSuccessMessage(data), {
        type: "success",
      });
    },
  });
};

export const useDeleteShiftType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (shiftTypeId: number) =>
      apiRequest("delete", `/shifts/types/${shiftTypeId}/`),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["shift-types"] });

      ToastService.show(getSuccessMessage(data), {
        type: "success",
      });
    },
  });
};

export const useGetTimeoutRules = () => {
  return useQuery({
    queryKey: ["timeout-rules"],
    queryFn: () => apiRequest("get", "/shifts/timeout_rules/"),
  });
};

export const useCreateTimeoutRules = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: TimeoutRulePayload) =>
      apiRequest("post", `/shifts/timeout_rules/`, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["timeout-rules"] });

      ToastService.show(getSuccessMessage(data), {
        type: "success",
      });
    },
  });
};

export const useUpdateTimeoutRules = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateTimeoutRulePayload) =>
      apiRequest("put", `/shifts/timeout_rules/${payload.id}/`, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["timeout-rules"] });

      ToastService.show(getSuccessMessage(data), {
        type: "success",
      });
    },
  });
};

export const useDeleteTimeoutRules = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (timeoutRuleId: number) =>
      apiRequest("delete", `/shifts/timeout_rules/${timeoutRuleId}/`),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["timeout-rules"] });

      ToastService.show(getSuccessMessage(data), {
        type: "success",
      });
    },
  });
};

export const useEvaluateTimeoutRules = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: TimeoutRulePayload) =>
      apiRequest("post", `/shifts/timeout_rules/evaluate/`, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["timeout-rules"] });

      ToastService.show(getSuccessMessage(data), {
        type: "success",
      });
    },
  });
};
