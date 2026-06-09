"use client";

import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "../ui/label";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { useToast } from "../context/toast-context";
import { getErrorMessage, getSuccessMessage } from "@/lib/error-handler";
import { api } from "@/lib/api";
import Cookies from "js-cookie";
import FormField from "../ui/custom/formField";

const schema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Write valid email" }),
});

type FormData = z.infer<typeof schema>;

export default function ForgotPassword() {
  const router = useRouter();
  const toast = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
    },
    mode: "onSubmit",
  });

  const onSubmit = async (data: FormData) => {
    debugger;
    try {
      const res = await api.forgotPassword(data);
      if (res?.status === "success" && res?.data?.uid) {
        Cookies.set("resetPasswordUid", res.data.uid);
        Cookies.set("resetPasswordEmail", data.email);
        toast.success(getSuccessMessage(res));
        router.push("/email-otp");
      } else {
        Cookies.remove("resetPasswordEmail");
      }
    } catch (error: any) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div className="grid grid-cols-12 min-h-screen">
      <div className="col-span-8 bg-gray-100"></div>

      <div className="col-span-4 flex items-center justify-center">
        <div className="w-full max-w-md p-6 space-y-4">
          <h1 className="text-4xl font-semibold">Forgot Password?</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <FormField label="Email" required error={errors.email}>
                <Input type="email" {...register("email")} />
              </FormField>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 h-11 hover:bg-primary-400/80 cursor-pointer"
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
