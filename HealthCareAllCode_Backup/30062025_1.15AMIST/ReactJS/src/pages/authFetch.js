// pages/authFetch.js
export const authFetch = async (url, options = {}) => {
  const token = localStorage.getItem("jwtToken");

  console.log("[authFetch] Request URL:", url);
  if (!token) {
    console.warn("[authFetch] ⚠️ JWT token not found!");
    throw new Error("JWT token missing");
  }
  console.log("[authFetch] ✅ JWT Token found");

  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  try {
    const response = await fetch(url, { ...options, headers });
    console.log(`[authFetch] ✅ Response status: ${response.status}`);
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("[authFetch] ❌ Fetch error:", error.message);
    throw error;
  }
};
