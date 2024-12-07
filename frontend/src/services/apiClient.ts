import axios, {
  CanceledError,
  AxiosRequestConfig,
  AxiosError,
  AxiosResponse,
} from "axios";

export { CanceledError };
interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  skipAuthRefresh: any;
  _retry?: boolean;
}

let isTokenRefreshing: boolean = false;
let subscribers: ((accessToken: string) => void)[] = [];

function onTokenRefreshed(accessToken: string): void {
  subscribers.forEach((callback) => callback(accessToken));
  subscribers = [];
}

function addSubscriber(callback: (accessToken: string) => void): void {
  subscribers.push(callback);
}

export const apiClient = axios.create({
  baseURL: "http://10.0.0.6:90",
});

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    // אם הבקשה לא דורשת רענון טוקן, לדלג על רענון
    if (originalRequest?.skipAuthRefresh) {
      return Promise.reject(error); // דלג על רענון הטוקן
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (!isTokenRefreshing) {
        isTokenRefreshing = true;
        originalRequest._retry = true;

        try {
          const accessToken = await refreshAccessToken();
          apiClient.defaults.headers.common[
            "Authorization"
          ] = `JWT ${accessToken}`;
          if (originalRequest.headers)
            originalRequest.headers["Authorization"] = `JWT ${accessToken}`;
          return apiClient(originalRequest);
        } catch (refreshError) {
          console.error("Error in token refresh", refreshError);
          return Promise.reject(refreshError);
        } finally {
          isTokenRefreshing = false;
        }
      } else {
        return new Promise((resolve) => {
          addSubscriber((accessToken: string) => {
            if (originalRequest.headers) {
              originalRequest.headers["Authorization"] = `JWT ${accessToken}`;
            }
            resolve(apiClient(originalRequest));
          });
        });
      }
    }

    return Promise.reject(error);
  }
);

export async function refreshAccessToken(): Promise<string> {
  const refreshToken: string | null = localStorage.getItem("refreshToken");
  if (!refreshToken)
    throw new Error("No refresh token available. Login required.");

  try {
    const response: AxiosResponse = await axios.post(
      `${apiClient.defaults.baseURL}/auth/refresh`,
      {},
      {
        headers: { Authorization: `JWT ${refreshToken}` },
      }
    );

    const { accessToken, refreshToken: newRefreshToken } = response.data;
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", newRefreshToken);
    apiClient.defaults.headers.common["Authorization"] = `JWT ${accessToken}`;
    onTokenRefreshed(accessToken);
    return accessToken;
  } catch (error) {
    console.error("Refresh token error: ", error);
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("accessToken");
    throw new Error("Failed to refresh token, login required.");
  }
}
export default apiClient;
