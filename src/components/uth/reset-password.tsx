"use client";

import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "../ui/label";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "../context/toast-context";
import { getErrorMessage, getSuccessMessage } from "@/lib/error-handler";
import { api } from "@/lib/requests/auth/api";
import Cookies from "js-cookie";
import FormField from "../ui/custom/formField";

// ✅ schema
const schema = z
  .object({
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),

    confirmPassword: z
      .string()
      .min(1, { message: "Confirm password is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;

export default function ResetPassword() {
  const router = useRouter();
  const toast = useToast();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePassword = () => setShowPassword((prev) => !prev);
  const toggleConfirmPassword = () => setShowConfirmPassword((prev) => !prev);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onSubmit",
  });

  // ✅ submit logic
  const onSubmit = async (data: FormData) => {
    debugger;
    try {
      const uid = Cookies.get("resetPasswordUid");
      const token = Cookies.get("resetPasswordToken");

      if (!uid || !token) {
        debugger;
        toast.error("Session expired");
        router.push("/forgot-password");
        return;
      }

      const payload = {
        uid,
        token,
        newPassword: data.password,
      };

      const res = await api.resetPasswordConfirm(payload);
      toast.success(getSuccessMessage(res));
      router.push("/login");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div className="grid grid-cols-12 min-h-screen">
      <div className="col-span-8 bg-[#F9EFDF]"></div>

      <div className="col-span-4 flex items-center justify-center">
        <div className="w-full max-w-md p-6 space-y-4 bg-white">
          <h1 className="text-3xl font-semibold">Reset Password</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Password */}
            <div className="space-y-2 relative">
              <FormField label="New Password" required error={errors.password}>
                <Input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                />
              </FormField>

              <div
                onClick={togglePassword}
                className="absolute right-3 top-7 cursor-pointer text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2 relative">
              <FormField
                label="Confirm Password"
                required
                error={errors.confirmPassword}
              >
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  {...register("confirmPassword")}
                />
              </FormField>

              <div
                onClick={toggleConfirmPassword}
                className="absolute right-3 top-7 cursor-pointer text-gray-600"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </div>
            </div>

            {/* Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 hover:bg-primary-400/80 cursor-pointer"
            >
              Reset Password
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
