import axios from "axios";
import { toast } from "react-toastify";

const API_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000/api";

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
        if (process.env.NODE_ENV === "development") {
          console.log("Token récupéré :", token);
        }
      }
    } catch (error) {
      console.error("Erreur lors de la récupération du token :", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      toast.error("Session expirée. Redirection vers la connexion...", {
        position: "top-center",
        autoClose: 2000,
      });

      setTimeout(() => {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }, 4000); //Attendre 4 secondes avant de rediriger
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
