"use client";

import axios from "axios";
import { API_URL } from "./constants";

export const $http = axios.create({
  baseURL: API_URL,
});

// Request interceptor to add Bearer token
$http.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("bearer_token");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle authentication errors
$http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token is invalid or expired
      console.warn("Authentication failed, redirecting to login");

      // Only redirect if we're on a protected route
      if (
        typeof window !== "undefined" &&
        (window.location.pathname.startsWith("/dashboard") ||
          window.location.pathname.startsWith("/upload-paper"))
      ) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);
