const extractMessage = (data: any, fallback: string): string => {
  // Agar 'data' object khud null/undefined ho
  if (!data) return fallback;

  // 1. Top-level 'messages' array check (Success & Failure dono ke liye)
  if (Array.isArray(data.messages) && data.messages.length > 0) {
    return data.messages[0];
  }

  // 2. Nested 'data.messages' (kuch APIs mein aise hota hai)
  if (Array.isArray(data.data?.messages) && data.data.messages.length > 0) {
    return data.data.messages[0];
  }

  // 3. Fallback for string 'message' field
  return data.message || data.data?.message || fallback;
};

export const getSuccessMessage = (
  response: any,
  fallback = "Operation successful",
): string => {
  // Success mein response object hota hai
  return extractMessage(response, fallback);
};

export const getErrorMessage = (error: any): string => {
  // Error mein 'error.response.data' hota hai
  // Agar server response na de, to 'error.message' fallback ban jayega
  const serverData = error?.response?.data;
  return extractMessage(serverData, error?.message || "Something went wrong");
};
