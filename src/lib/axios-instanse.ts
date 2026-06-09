import axios, { AxiosResponse } from "axios";
import Cookies from "js-cookie";
const baseURL = process.env.NEXT_PUBLIC_API_URL;

const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Axios request interceptor to add Authorization header and attach Bearer token
axiosInstance.interceptors.request.use(
  async (config) => {
    if (typeof window !== "undefined") {
      const token = Cookies.get("token");
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Global Error Handler (Response Interceptor)
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response, // Return response if it's successful
  async (error) => {
    // Token expired, try refreshing
    // Handle 401 error by signing out and redirecting to sign-in
    if (error.response && error.response.status === 401) {
      Cookies.remove("token");

      // // Redirect to login page using Next.js router
      // if (typeof window !== 'undefined') {
      //   const router = useRouter();
      //   router.push('/login'); // Navigate to login page
      // }

      return Promise.reject(error);
    } else if (error?.response) {
      // Check if the error has a response (meaning the server responded)
      // Handle API-specific errors here
      const suppressLog =
        error?.config?.headers?.["X-Suppress-Error-Log"] === "1" ||
        error?.config?.headers?.["x-suppress-error-log"] === "1";
      if (!suppressLog) {
        console.error("API Error:", error?.response?.data);
      }
      // Optionally, display an error message to the user
    } else if (error?.request) {
      // Handle network errors (e.g., no response from the server)
      console.error("Network Error:", error?.request);
      // Optionally, display a "no connection" message
    } else {
      // General error (e.g., something went wrong during the setup)
      console.error("Error:", error?.message);
    }
    // You can throw the error here or return a custom error object
    return Promise.reject(error);
  },
);

export default axiosInstance;
