import { auth } from "@/auth";

export async function fetchApi(url, options = {}) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL;

  const defaultHeaders = {};

  // Try to get session to attach token
  try {
    const session = await auth();
    if (session?.accessToken) {
      defaultHeaders["Authorization"] = `Bearer ${session.accessToken}`;
    }
  } catch (error) {
    // auth() might fail if called from client side in some contexts, 
    // or if no request context is available.
    console.error("Error getting session for fetchApi:", error);
  }

  // Merge headers, prioritizing options.headers
  const headers = {
    ...defaultHeaders,
    ...(options.headers || {}),
  };

  return fetch(apiUrl + url, {
    ...options,
    headers,
  });
}
