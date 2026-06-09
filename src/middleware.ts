import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const uid = request.cookies.get("resetPasswordUid")?.value;
  const token = request.cookies.get("resetPasswordToken")?.value;
  const email = request.cookies.get("resetPasswordEmail")?.value;

  const protectedRoutes = ["/email-otp", "/update-password"];

  const isProtectedRoute = protectedRoutes.some((route) =>
    path.startsWith(route),
  );

  if (!isProtectedRoute) return NextResponse.next();

  // OTP page guard
  if (path.startsWith("/email-otp")) {
    if (!uid || !email) {
      return NextResponse.redirect(new URL("/forgot-password", request.url));
    }
  }

  // Reset password page guard
  if (path.startsWith("/update-password")) {
    if (!uid || !token) {
      return NextResponse.redirect(new URL("/forgot-password", request.url));
    }
  }

  return NextResponse.next();
}
export const config = {
  matcher: ["/email-otp/:path*", "/update-password/:path*"],
};
