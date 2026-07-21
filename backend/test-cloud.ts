import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  api_key: "",
  api_secret: "",
  cloud_name: "",
});

try {
  cloudinary.uploader.upload_stream({}, (err, result) => {
    console.log("Callback:", err, result);
  }).end(Buffer.from("fake image"));
} catch (e) {
  console.error("Synchronous error:", e.message);
}
