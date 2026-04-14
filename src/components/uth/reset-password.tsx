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

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePassword = () => setShowPassword((prev) => !prev);
  const toggleConfirmPassword = () => setShowConfirmPassword((prev) => !prev);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onSubmit",
  });

  // ✅ submit logic
  const onSubmit = (data: FormData) => {
    const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
    const resetEmail = localStorage.getItem("resetEmail");

    // agar email hi nahi hai
    if (!resetEmail || savedUser.email !== resetEmail) {
      alert("Something went wrong. Try again.");
      router.push("/forgot-password");
      return;
    }

    // password update
    const updatedUser = {
      ...savedUser,
      password: data.password,
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));

    // cleanup
    localStorage.removeItem("resetEmail");

    alert("Password updated successfully!");

    router.push("/login");
  };

  return (
    <div className="grid grid-cols-12 min-h-screen">
      <div className="col-span-8 bg-gray-100"></div>

      <div className="col-span-4 flex items-center justify-center">
        <div className="w-full max-w-md p-6 space-y-4 bg-white">
          <h1 className="text-3xl font-semibold">Reset Password</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Password */}
            <div className="space-y-2 relative">
              <Label>New Password *</Label>
              <Input
                type={showPassword ? "text" : "password"}
                {...register("password")}
              />

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

              {errors.password && (
                <p className="text-red-600">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2 relative">
              <Label>Confirm Password *</Label>
              <Input
                type={showConfirmPassword ? "text" : "password"}
                {...register("confirmPassword")}
              />

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

              {errors.confirmPassword && (
                <p className="text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Button */}
            <Button
              type="submit"
              className="w-full h-11 hover:bg-gray-700 cursor-pointer"
            >
              Reset Password
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
