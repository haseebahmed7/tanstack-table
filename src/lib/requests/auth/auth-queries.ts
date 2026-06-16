import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "./api";

// USER
export const useGetUserProfile = () =>
  useQuery({
    queryKey: ["user-profile"],
    queryFn: api.getUserProfile,
  });

// UPDATE USER
export const useUpdateUserProfile = () =>
  useMutation({
    mutationFn: api.updateProfile,
  });

// AUTH (example)
export const useLogin = () =>
  useMutation({
    mutationFn: api.login,
  });
