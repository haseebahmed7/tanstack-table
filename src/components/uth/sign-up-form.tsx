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
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useToast } from "../context/toast-context";
import { auth } from "@/lib/firebase";

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
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onSubmit",
  });

  const onSubmit = async (data: FormData) => {
    try {
      await createUserWithEmailAndPassword(auth, data.email, data.password);
      toast.success("Sign Up Successfully!✅");
      router.push("/login");
    } catch (error: any) {
      if (error.code === "auth/email-already-in-use") {
        toast.error("This email is already registered.");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="grid grid-cols-12 min-h-screen">
      <div className="col-span-8 bg-gray-100"></div>

      <div className="col-span-4 flex items-center justify-center">
        <div className="w-full max-w-md p-6 space-y-4 bg-white">
          <h1 className="text-3xl font-semibold">Sign Up</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-2">
              <Label>Full Name *</Label>
              <Input type="text" {...register("fullName")} />
              {errors.fullName && (
                <p className="text-red-600">{errors.fullName.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label>Email *</Label>
              <Input type="email" {...register("email")} />
              {errors.email && (
                <p className="text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2 relative">
              <Label>Password *</Label>
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
              Create Account
            </Button>

            {/* Login Link */}
            <p className="text-center">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-600 hover:underline">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
