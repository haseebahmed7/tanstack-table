import { User } from "./api-type";
import { apiRequest } from "../../api-request";

// const apiRequest = async (
//   method: "get" | "post" | "put" | "delete",
//   url: string,
//   data?: any,
// ) => {
//   // Yahan hum data ko snake_case mein convert kar rahe hain (except FormData)
//   const formattedData =
//     data && !(data instanceof FormData) ? snakecaseKeys(data) : data;

//   try {
//     const response = await axiosInstance[method](url, formattedData);
//     return response.data;
//   } catch (error) {
//     throw new Error(getErrorMessage(error));
//   }
// };

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
