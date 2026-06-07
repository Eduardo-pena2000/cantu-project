import "dotenv/config";

import { get } from "env-var";

export const envs = {
  NODE_ENV: get("NODE_ENV").default("development").asString(),
  APP_PORT: get("APP_PORT").asPortNumber(),
  DB_USER: get("DB_USER").required().asString(),
  DB_PASSWORD: get("DB_PASSWORD").required().asString(),
  DB_HOST: get("DB_HOST").required().asString(),
  DB_PORT: get("DB_PORT").required().asPortNumber(),
  DB_NAME: get("DB_NAME").required().asString(),
  JWT_SECRET: get("JWT_SECRET").required().asString(),
  JWT_ACCESS_EXPIRES: get("JWT_ACCESS_EXPIRES").required().asString() as any,
  JWT_REFRESH_EXPIRES: get("JWT_REFRESH_EXPIRES").required().asString() as any,
  CLOUDINARY_CLOUD_NAME: get("CLOUDINARY_CLOUD_NAME").asString() || "",
  CLOUDINARY_API_KEY: get("CLOUDINARY_API_KEY").asString() || "",
  CLOUDINARY_SECRET: get("CLOUDINARY_SECRET").asString() || "",
  FIREBASE_PROJECT_ID: get("FIREBASE_PROJECT_ID").asString() || "",
  FIREBASE_SENDER_ID: get("FIREBASE_SENDER_ID").asString() || "",
  FIREBASE_PRIVATE_KEY: get("FIREBASE_PRIVATE_KEY").asString() || "",
  FIREBASE_CLIENT_EMAIL: get("FIREBASE_CLIENT_EMAIL").asString() || "",
  APP_FRONT_HOST: get("APP_FRONT_HOST").required().asString(),
};
