import axios from "axios";
import { toast } from 'react-toastify';


export const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://api.coderun.site';
export const api = axios.create({
  baseURL,
});

api.interceptors.request.use(async (config) => {
  const auth_header = config.headers["x-auth-not-required"];
  if (auth_header) return config;


  const token = localStorage.getItem('accessToken');
  if(token!==null){
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error status is not 401, or if it's a 401 but the request was already for token refresh,
    // or if x-auth-not-required is set, reject the promise.
    if (
      error.response.status !== 401 ||
      originalRequest.url === '/api/auth/reissue' || // Assuming this is your reissue endpoint
      originalRequest.headers['x-auth-not-required']
    ) {
      if (error.response && (error.response.status === 401 || error.response.status === 403 || error.response.status === 419)) {
        toast.error('세션이 만료되었거나 인증되지 않았습니다. 다시 로그인해주세요.');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken'); // Ensure refreshToken is also cleared
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }

    // If a refresh is already in progress, queue the original request
    if (isRefreshing) {
      return new Promise(function (resolve, reject) {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers['Authorization'] = 'Bearer ' + token;
          return axios(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    isRefreshing = true;

    // Attempt to refresh token
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available.');
      }

      const response = await axios.post(`${baseURL}/api/auth/reissue`, { refreshToken }); // Assuming reissue endpoint
      const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;

      localStorage.setItem('accessToken', newAccessToken);
      localStorage.setItem('refreshToken', newRefreshToken); // Update refresh token if a new one is returned

      originalRequest.headers['Authorization'] = 'Bearer ' + newAccessToken;
      processQueue(null, newAccessToken); // Process all queued requests with the new token
      return axios(originalRequest); // Retry the original request

    } catch (refreshError) {
      processQueue(refreshError, null); // Reject all queued requests
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      toast.error('세션이 만료되었거나 인증되지 않았습니다. 다시 로그인해주세요.');
      window.location.href = '/login';
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);