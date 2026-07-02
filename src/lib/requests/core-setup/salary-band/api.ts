import { apiRequest } from "@/lib/api-request";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Grade, GradeResponse } from "./types";

export const useGetGrades = () =>
  useQuery({
    queryKey: ["grades"],
    queryFn: () => apiRequest("get", "/companies/grades/"),
  });

export const useGetGradeById = (gradeId: number | null) =>
  useQuery({
    queryKey: ["grade", gradeId],
    queryFn: () => apiRequest("get", `/companies/grades/${gradeId}/`),
    enabled: !!gradeId,
    retry: 1,
  });

export const useCreateGrade = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { title: string }) =>
      apiRequest("post", `/companies/grades/`, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["grades"] }),
  });
};

export const useUpdateGrade = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Grade) =>
      apiRequest("put", `/companies/grades/${payload.id}/`, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["grades"] }),
  });
};

export const useDeleteGrade = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (gradeId: number) =>
      apiRequest("delete", `/companies/grades/${gradeId}/`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["grades"] }),
  });
};
