import snakecaseKeys from "snakecase-keys";
import { getErrorMessage } from "./error-handler";
import axiosInstance from "./axios-instanse";

type HttpMethod = "get" | "post" | "put" | "patch" | "delete";

const toSnakeCase = (data: any) => {
  if (!data || data instanceof FormData) return data;
  return snakecaseKeys(data, { deep: true });
};

export const apiRequest = async <T = any>(
  method: HttpMethod,
  url: string,
  data?: any,
  config?: any,
): Promise<T> => {
  try {
    const isGet = method === "get";

    const response = await axiosInstance.request({
      method,
      url,

      // GET → params
      params: isGet ? data : undefined,

      // POST/PUT/PATCH → data
      data: !isGet ? toSnakeCase(data) : undefined,

      ...config,
    });

    return response.data;
  } catch (error: any) {
    throw new Error(getErrorMessage(error));
  }
};
