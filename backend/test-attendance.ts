import { Sequelize } from "sequelize";
import jwt from "jsonwebtoken";

const sequelize = new Sequelize("postgres://postgres:postgres@localhost:5432/stores_db", {
  logging: false,
});

async function run() {
  try {
    const [users] = await sequelize.query(`
      SELECT tu.user_id, tu.team_id, u.email
      FROM team_users tu
      JOIN users u ON u.id = tu.user_id
      WHERE tu.is_active = true
      LIMIT 1
    `);
    
    if (!users.length) {
      console.log("No users found in teams!");
      return;
    }
    
    const user = users[0];
    console.log("Testing with user:", user);
    
    const token = jwt.sign(
      { id: user.user_id, email: user.email },
      "I8JMaM15wX0ld03NcbKxNXpay-tZYWfymY2fMDQSO5OJy_E9ZPuGbMumDfaP1N4K",
      { expiresIn: "1h" }
    );

    const formData = new FormData();
    formData.append("store_id", "1"); // Assuming store 1 exists
    formData.append("team_id", String(user.team_id));
    formData.append("employee_id", String(user.user_id));
    formData.append("schedule_id", "1"); // Assuming schedule 1 exists
    formData.append("status", "PRESENTE");
    
    const blob = new Blob(["fake image data"], { type: "image/jpeg" });
    formData.append("image", blob, "assistance-photo.jpg");

    const res = await fetch("http://localhost:4000/assistance", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });
    
    console.log("Status:", res.status);
    console.log("Body:", await res.text());
  } catch (error) {
    console.error(error);
  } finally {
    await sequelize.close();
  }
}

run();
