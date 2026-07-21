import jwt from "jsonwebtoken";

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
  formData.append("image", new Blob(["fake image"], { type: "image/jpeg" }), "photo.jpg");

  try {
    const res = await fetch("http://localhost:4000/assistance", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
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
