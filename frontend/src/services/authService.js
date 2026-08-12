const API_URL = "http://localhost:5000/api/auth";

async function sendAuthRequest(endpoint, userDetails) {
  try {
    const response = await fetch(`${API_URL}/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
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
        "Unable to reach the server. Make sure the backend is running.", {
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