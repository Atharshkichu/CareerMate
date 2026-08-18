const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

async function refreshAccessToken() {
  const refreshToken =
    localStorage.getItem("refreshToken");

  if (!refreshToken) {
    return null;
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/token/refresh/`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          refresh: refreshToken,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("jobmateUser");

      return null;
    }

    localStorage.setItem(
      "accessToken",
      data.access
    );

    return data.access;
  } catch (error) {
    console.error(
      "Token refresh error:",
      error
    );

    return null;
  }
}

export async function apiFetch(
  endpoint,
  options = {}
) {
  let accessToken =
    localStorage.getItem("accessToken");

  const makeRequest = async (token) => {
    const headers = {
      ...(options.headers || {}),
    };

    if (token) {
      headers.Authorization =
        `Bearer ${token}`;
    }

    return fetch(
      `${API_BASE_URL}${endpoint}`,
      {
        ...options,
        headers,
      }
    );
  };

  let response =
    await makeRequest(accessToken);

  if (response.status === 401) {
    accessToken =
      await refreshAccessToken();

    if (!accessToken) {
      return response;
    }

    response =
      await makeRequest(accessToken);
  }

  return response;
}