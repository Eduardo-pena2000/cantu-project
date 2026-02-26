export async function fetchApi(url, options = {}) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL;
  return fetch(apiUrl + url, {
    ...options,
  });
}
