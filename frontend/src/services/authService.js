const API_URL =
  import.meta.env.VITE_AUTH_API_URL || "http://localhost:5000/api/auth";

const { protocol, hostname } = new URL(API_URL);
const isLocalHost = hostname === "localhost" || hostname === "127.0.0.1";

if (!isLocalHost && protocol !== "https:") {
  throw new Error("Authentication API URL must use HTTPS outside local development.");
}

function getCsrfToken() {
  const cookie = document.cookie
    .split("; ")
    .find((item) => item.startsWith("notes_app_csrf="));
  return cookie ? decodeURIComponent(cookie.split("=")[1]) : null;
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

export async function getCurrentUser() {
  try {
    const response = await fetch(`${API_URL}/me`, {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    });
    if (response.status === 401) {
      return null;
    }
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Unable to validate the session.");
    }
    return data.user;
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "Unable to validate the session."
    ) {
      throw error;
    }
    throw new Error("Unable to validate the session.", {
      cause: error,
    });
  }
}

export async function logoutUser() {
  try {
    const csrfToken = getCsrfToken();
    const response = await fetch(`${API_URL}/logout`, {
      method: "POST",
      headers: {
        "X-CSRF-Token": csrfToken || "",
      },
      credentials: "include",
    });
    if (!response.ok) {
      const data = await response.json().catch(() => null);
      throw new Error(data?.message || "Unable to log out. Please try again.");
    }
    return response.json();
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "Unable to log out. Please try again."
    ) {
      throw error;
    }
    throw new Error("Unable to log out. Please try again.", {
      cause: error,
    });
  }
}

export function registerUser(userDetails) {
  return sendAuthRequest("register", userDetails);
}

export function loginUser(userDetails) {
  return sendAuthRequest("login", userDetails);
}