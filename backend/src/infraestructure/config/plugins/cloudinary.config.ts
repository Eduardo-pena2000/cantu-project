import { v2 as cloudinary } from "cloudinary";

import { envs } from "./envs.config";

cloudinary.config({
  api_key: envs.CLOUDINARY_API_KEY,
  api_secret: envs.CLOUDINARY_SECRET,
  cloud_name: envs.CLOUDINARY_CLOUD_NAME,
});

export default cloudinary;
