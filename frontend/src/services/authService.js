const API_URL =
  import.meta.env.VITE_AUTH_API_URL || "http://localhost:5000/api/auth";

if (
  !API_URL.startsWith("http://localhost") &&
  !API_URL.startsWith("http://127.0.0.1") &&
  !API_URL.startsWith("https://")
) {
  throw new Error("Authentication API URL must use HTTPS outside local development.");
}

async function sendAuthRequest(endpoint, userDetails) {
  try {
    const response = await fetch(`${API_URL}/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(userDetails),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Unable to complete the request.");
    }
    return data;
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        "Unable to reach the server. Make sure the backend is running.",
        {
          cause: error,
        }
      );
    }
    throw error;
  }
}

export function registerUser(userDetails) {
  return sendAuthRequest("register", userDetails);
}

export function loginUser(userDetails) {
  return sendAuthRequest("login", userDetails);
}