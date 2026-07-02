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
import Link from "next/link";
import { useToast } from "../context/toast-context";
import { getErrorMessage, getSuccessMessage } from "@/lib/error-handler";
import { api } from "@/lib/requests/auth/api";
import FormField from "../ui/custom/formField";

const schema = z
  .object({
    email: z
      .string()
      .min(1, { message: "Email is required" })
      .email({ message: "Write valid email" }),

    fullName: z.string().min(3, { message: "Please write valid name" }),

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

export default function SignUpForm() {
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
    defaultValues: {
      email: "",
      fullName: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onSubmit",
  });

  const onSubmit = async (data: FormData) => {
    try {
      const res = await api.signUp(data);
      toast.success(getSuccessMessage(res));
      router.push("/login");
    } catch (error: any) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div className="grid grid-cols-12 min-h-screen">
      <div className="col-span-8 bg-[#F9EFDF]"></div>

      <div className="col-span-4 flex items-center justify-center">
        <div className="w-full max-w-md p-6 space-y-4 bg-white">
          <h1 className="text-3xl font-semibold">Sign Up</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <div className="space-y-2">
              <FormField label="Email" error={errors.email} required>
                <Input type="email" {...register("email")} />
              </FormField>
            </div>

            {/* Full Name */}
            <div className="space-y-2">
              <FormField label="Full Name" error={errors.fullName} required>
                <Input type="text" {...register("fullName")} />
              </FormField>
            </div>

            {/* Password */}
            <div className="space-y-2 relative">
              <FormField label="Password" error={errors.password} required>
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
                error={errors.confirmPassword}
                required
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
              {isSubmitting ? "Creating..." : "Create Account"}
            </Button>

            {/* Login Link */}
            <p className="text-center">
              Already have an account?{" "}
              <Link href="/login" className="text-red-600 hover:underline">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
