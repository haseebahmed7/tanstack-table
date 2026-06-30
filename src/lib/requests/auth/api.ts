import { User } from "./api-type";
import { apiRequest } from "../../api-request";

export const api = {
  login: (data: any) => apiRequest("post", "/users/tokens/create/", data),

  signUp: (data: any) => apiRequest("post", "/candidates/signup/otp/", data),

  forgotPassword: (data: any) =>
    apiRequest("post", "/users/reset_password_otp/", data),

  verifyOTP: (data: { uid: string; otp: string }) =>
    apiRequest("post", "/users/reset_password_verify_otp/", data),

  resetPasswordConfirm: (data: {
    uid: string;
    token: string;
    newPassword: string;
  }) => apiRequest("post", "/users/reset_password_confirm/", data),

  getUserProfile: () => apiRequest("get", "/users/me/"),

  updateProfile: (data: User) => apiRequest("put", "/users/me/", data),
};
