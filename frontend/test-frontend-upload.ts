import jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";

async function test() {
  const token = jwt.sign(
    { id: 1, email: "admin@store.com" }, // Assuming user ID 1 exists
    "I8JMaM15wX0ld03NcbKxNXpay-tZYWfymY2fMDQSO5OJy_E9ZPuGbMumDfaP1N4K",
    { expiresIn: "1h" }
  );

  const formData = new FormData();
  formData.append("store_id", "1");
  formData.append("team_id", "1");
  formData.append("employee_id", "1");
  formData.append("schedule_id", "1");
  formData.append("status", "PRESENTE");
  
  // Create a 1x1 pixel JPEG base64 string
  const base64Image = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=";
  const blob = await fetch(base64Image).then(res => res.blob());
  
  formData.append("image", blob);

  try {
    const res = await fetch("http://localhost:3000/api/attendance", {
      method: "POST",
      headers: {
        // Next.js App Router API might need standard headers but typically not for FormData
        // We simulate the frontend by passing the token in a cookie or auth?
        // Wait, route.js uses request.auth.accessToken?
        // Let's check how the frontend route.js authorizes.
      },
      body: formData
    });
    
    console.log("Status:", res.status);
    console.log("Body:", await res.text());
  } catch (err) {
    console.error(err);
  }
}

test();
