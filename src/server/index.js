import axios from "axios";


export const baseURL = import.meta.env.VITE_BASE_URL;
export const api = axios.create(/*{baseURL}*/);

api.interceptors.request.use(async (config) => {
  const auth_header = config.headers["x-auth-not-required"];
  if (auth_header) return config;


  const token = localStorage.getItem('token');
  if(token!==null){
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(function (response) {
  // before then
  return response;
}, function (error) {
  // before catch
  if(error.response && error.response.status === 419){
    alert('토큰이 만료되었습니다. 다시 로그인해주세요.')
    localStorage.removeItem('token');
  }
  return Promise.reject(error);
});