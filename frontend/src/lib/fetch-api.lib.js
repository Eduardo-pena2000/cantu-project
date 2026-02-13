export async function fetchApi(url, options = {}) {
  return fetch(process.env.API_URL + url, {
    ...options,
  });
}
