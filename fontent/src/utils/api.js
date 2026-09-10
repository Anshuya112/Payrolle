import { getToken, logout } from "./auth";

const API_BASE_URL = "http://127.0.0.1:8000/api";

export async function apiFetch(endpoint, options = {}) {
  const token = getToken();

  const headers = {
    Accept: "application/json",
    ...(options.headers || {}),
  };

  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

 
  if (
    options.body &&
    typeof options.body === "string" &&
    !headers["Content-Type"]
  ) {
    headers["Content-Type"] = "application/json";
  }

  const url = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE_URL}${endpoint}`;

  console.log("🌐 API Request:", {
    url,
    method: options.method || "GET",
    hasToken: !!token,
  });

  const response = await fetch(url, {
    ...options,
    headers,
  });

 
  if (response.status === 401) {
    console.error(
      "API Unauthorized:",
      url
    );

    
    logout();
  }

  return response;
}
