import axios from "axios";

export const baseURL = import.meta.env.VITE_BASE_URL;
export const api = axios.create({ baseURL });

// REQUEST INTERCEPTOR
api.interceptors.request.use(async (config) => {
  const skipAuth = config.headers["x-auth-not-required"];
  if (skipAuth) return config;

  const accessToken = localStorage.getItem("access_token");
  if (accessToken) {
    config.headers["Authorization"] = `Bearer ${accessToken}`;
  }

  return config;
});

// RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 419) {
      // 토큰 만료 처리
      alert("토큰이 만료되었습니다. 다시 로그인해주세요.");
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);