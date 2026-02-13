export function safeUrlEncode(str) {
  try {
    const base64Encode = btoa(str);
    const encodeStr = encodeURIComponent(base64Encode);
    return encodeStr;
  } catch (error) {
    return null;
  }
}

export function safeUrlDecode(str) {
  if (typeof str !== "string") return null;

  try {
    const decodeStr = decodeURIComponent(str);
    const base64Decode = atob(decodeStr);
    return base64Decode;
  } catch (error) {
    return null;
  }
}
