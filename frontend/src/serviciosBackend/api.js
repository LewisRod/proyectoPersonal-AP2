import axios from "axios"
import { obtenerToken } from "./authStorage"

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

api.interceptors.request.use(
  async (config) => { const token = await obtenerToken()

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
)

export default api
