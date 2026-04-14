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

const schema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Write valid email" }),
});

type FormData = z.infer<typeof schema>;

export default function ForgotPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted },
    setError,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
    },
    mode: "onSubmit",
  });

  const onSubmit = (data: FormData) => {
    const savedUser = JSON.parse(localStorage.getItem("user") || "{}");

    if (data.email === savedUser.email) {
      // ✅ email save karo
      localStorage.setItem("resetEmail", data.email);

      // ✅ phir redirect
      router.push("/reset-password");
    } else {
      setError("email", {
        type: "manual",
        message: "Email not found",
      });
    }
  };

  return (
    <div className="grid grid-cols-12 min-h-screen">
      <div className="col-span-8 bg-gray-100"></div>

      <div className="col-span-4 flex items-center justify-center">
        <div className="w-full max-w-md p-6 space-y-4">
          <h1 className="text-4xl font-semibold">Forgot Password</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label>Email *</Label>
              <Input type="email" {...register("email")} />
              {errors.email && (
                <p className="text-red-600">{errors.email.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full mt-2 h-11 hover:bg-gray-700 cursor-pointer"
            >
              Verify Email
            </Button>

            <Link
              href={"/login"}
              className="hover:text-red-600 flex justify-center"
            >
              Return to sign in
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
