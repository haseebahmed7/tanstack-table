"use client";

import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useToast } from "../context/toast-context";
import { getErrorMessage, getSuccessMessage } from "@/lib/error-handler";
import { api } from "@/lib/requests/auth/api";
import FormField from "../ui/custom/formField";
import Cookies from "js-cookie";
import { useLogin } from "@/lib/requests/auth/auth-queries";
import { useUser } from "../context/user-context";
import { decodeJwtToken } from "@/lib/utils";

const schema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Write valid email" }),

  password: z.string().min(1, { message: "Password is required" }),
});

type FormData = z.infer<typeof schema>;

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const loginMutation = useLogin();
  const router = useRouter();
  const toast = useToast();
  const { setAvatarPhotoUrl } = useUser();

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  useEffect(() => {
    Cookies.remove("resetPasswordEmail");
    Cookies.remove("resetPasswordUid");
    Cookies.remove("resetPasswordToken");
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onSubmit",
  });

  const onSubmit = async (values: FormData) => {
    try {
      // clearAuthCookies();
      const response = await loginMutation.mutateAsync(values);
      const { access: token, profile, company } = response?.data || {};
      console.log("Response", response.data);

      if (token && profile && company) {
        // Extract company_id from JWT token
        const decodedToken = decodeJwtToken<{ company_id: number }>(token);
        const companyIdFromToken = decodedToken?.company_id;

        // Set cookies with proper options to ensure they're available immediately
        Cookies.set("token", token, { path: "/" });
        setAvatarPhotoUrl(profile.photo);
        Cookies.set("userId", String(profile.id), { path: "/" });
        Cookies.set("userType", profile.type, { path: "/" });
        Cookies.set("userRoles", JSON.stringify(profile.roles), { path: "/" });
        Cookies.set("companyId", String(companyIdFromToken), { path: "/" });
        Cookies.set("companyName", company.title, { path: "/" });
        Cookies.set(
          "userFirstName",
          `${profile.firstName} ${profile.lastName}`,
          { path: "/" },
        );
      }

      if (response?.status === "success") {
        // Force a full page reload to ensure middleware runs with new cookies
        router.push("/dashboard");
      }
    } catch (error: any) {
      console.error(error?.message);
    }
  };

  return (
    <div className="grid grid-cols-12 min-h-screen">
      <div className="col-span-8 bg-[#F9EFDF]"></div>

      <div className="col-span-4 flex items-center justify-center">
        <div className="w-full max-w-md p-6 space-y-4">
          <h1 className="text-4xl font-semibold">LOGIN</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <FormField label="Email" error={errors.email} required>
                <Input type="email" {...register("email")} />
              </FormField>
            </div>

            <div className="space-y-2 relative">
              <FormField label="Password" required error={errors.password}>
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

            <div className="flex justify-end">
              <Link href="/forgot-password" className="hover:text-red-600">
                Forgot Password?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-4 h-11 hover:bg-primary-400/80 cursor-pointer"
            >
              Login To Dashboard
            </Button>

            <p className="text-center">
              Don't have an account?{" "}
              <Link href="/sign-up" className="text-red-600 hover:underline">
                Sign Up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
