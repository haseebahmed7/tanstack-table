"use client";

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useToast } from "../context/toast-context";
import { getErrorMessage, getSuccessMessage } from "@/lib/error-handler";
import FormField from "../ui/custom/formField";
import { useEffect, useState } from "react";
import { api } from "@/lib/requests/auth/api";
import Cookies from "js-cookie";
import { Loader2 } from "lucide-react";

export default function OtpEmailPage() {
  const router = useRouter();
  const toast = useToast();

  // const [otpError, setOtpError] = useState<string | null>(null);
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [reSendLoading, setreSendLoading] = useState(false);

  // 1. Cookies se email retrieve karna
  useEffect(() => {
    const storedEmail = Cookies.get("resetPasswordEmail");
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      // If no email in cookies, redirect to forgot password page
      router.push("/forgot-password");
    }
  }, [router]);

  const onSubmit = async () => {
    const otpValue = otp.join("");

    const otpIncomplete =
      otpValue.length !== 6 || otp.some((digit) => digit === "");

    if (otpIncomplete) {
      toast.error("Please enter complete 6 digit OTP");
      return;
    }

    try {
      // useState
      setLoading(true);

      const uid = Cookies.get("resetPasswordUid");
      if (!uid) {
        toast.error("Session expired. Please try again.");
        router.push("/forgot-password");
        return;
      }

      const payload = {
        uid,
        otp: otpValue,
      };

      const res = await api.verifyOTP(payload);

      if (res?.status === "success" && res?.data?.token) {
        Cookies.set("resetPasswordToken", res.data.token);
        toast.success(getSuccessMessage(res));
        router.push("/update-password");
      }
    } catch (error: any) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text");
    if (!pasteData) return;

    const digits = pasteData.split("").slice(0, 6);
    const newOtp = [...otp];

    digits.forEach((digit, idx) => {
      newOtp[idx] = digit;
    });

    setOtp(newOtp);
  };

  const handleChange = (value: string, index: number) => {
    // setOtpError(null);
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      document.getElementById(`otp-input-${index + 1}`)?.focus();
    }
  };

  const reSendOTP = async () => {
    // 1. Cookie se wahi email uthayein jo save thi
    const email = Cookies.get("resetPasswordEmail");

    if (!email) {
      toast.error("Session expired. Please start again.");
      router.push("/forgot-password");
      return;
    }

    try {
      // useState
      setreSendLoading(true);

      // 2. Wahi API call karein jo ForgotPassword page par ki thi
      const res = await api.forgotPassword({ email });

      // 3. Agar success ho, toh naya UID save karein aur message dikhayein
      if (res?.status === "success" && res?.data?.uid) {
        Cookies.set("resetPasswordUid", res.data.uid); // Naya UID update ho gaya
        toast.success("New OTP has been sent to your email!");

        // OTP inputs ko reset kar dein
        setOtp(Array(6).fill(""));
      }
    } catch (error: any) {
      toast.error(getErrorMessage(error));
    } finally {
      setreSendLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-12 min-h-screen">
      <div className="col-span-8 bg-[#F9EFDF]"></div>

      <div className="col-span-4 flex items-center justify-center">
        <div className="w-full max-w-md p-6 space-y-4">
          <h1 className="text-4xl font-semibold">Forgot Password?</h1>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit();
            }}
            className="space-y-4"
          >
            <FormField label="Email">
              <Input type="email" disabled value={email} className="w-full" />
            </FormField>
            <div className="grid grid-cols-6 gap-2 mt-4">
              {otp.map((digit, index) => (
                <input
                  style={{ color: "black" }}
                  key={index}
                  id={`otp-input-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(e.target.value, index)}
                  onPaste={handlePaste}
                  className="focus:ring-dark-red h-13 rounded-lg border border-gray-300 p-0 text-center text-lg text-black focus:border-transparent focus:ring-2 focus:outline-none"
                />
              ))}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full mt-2 h-10"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  Verifying...
                  <Loader2 className="animate-spin" />
                </span>
              ) : (
                "Verify OTP"
              )}
            </Button>

            <div className="flex w-full justify-center">
              <p>
                Didn’t receive a code?{" "}
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => reSendOTP()}
                  className="cursor-pointer text-red-500 hover:text-red-400"
                >
                  {reSendLoading ? (
                    <span className="flex items-center gap-2">
                      Sending...
                      <Loader2 className="animate-spin" />
                    </span>
                  ) : (
                    "Resend Code"
                  )}
                </button>
              </p>
            </div>

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
