const db = require("./db");

async function initAdmin() {
    const createTableQuery = `
    CREATE TABLE IF NOT EXISTS admins (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(50) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      name VARCHAR(100) NOT NULL
    )
  `;

    console.log("Creating admins table...");
    try {
        await db.promise().query(createTableQuery);
        console.log("Admins table checked/created.");

        // Seed default admin
        const username = "admin";
        const password = "password123";
        const name = "Super Admin";

        // Check if exists
        const [rows] = await db.promise().query("SELECT * FROM admins WHERE username = ?", [username]);
        if (rows.length === 0) {
            await db.promise().query("INSERT INTO admins (username, password, name) VALUES (?, ?, ?)", [username, password, name]);
            console.log(`Seeded admin user: ${username} / ${password}`);
        } else {
            console.log("Admin user already exists.");
        }

    } catch (err) {
        console.error("Error initializing admin table:", err.message);
    }

    process.exit();
}

initAdmin();
