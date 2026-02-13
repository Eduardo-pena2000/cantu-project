export const safeUrlEncode = (str: any) => {
  try {
    const base64Encode = btoa(str);

    const encodeStr = encodeURIComponent(base64Encode);

    return encodeStr;
  } catch (error) {
    return null;
  }
};
