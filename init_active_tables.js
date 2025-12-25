const db = require("./db");

async function initTables() {
  const queries = [
    `CREATE TABLE IF NOT EXISTS pharmacies (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(50) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      name VARCHAR(100) NOT NULL,
      location VARCHAR(255)
    )`,
    `CREATE TABLE IF NOT EXISTS medicines (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      price DECIMAL(10, 2) NOT NULL,
      description TEXT,
      pharmacy_id INT,
      FOREIGN KEY (pharmacy_id) REFERENCES pharmacies(id) ON DELETE CASCADE
    )`,
    `CREATE TABLE IF NOT EXISTS prescriptions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      patient_name VARCHAR(100) NOT NULL,
      doctor_name VARCHAR(100) NOT NULL,
      medicine_name VARCHAR(100) NOT NULL,
      dosage VARCHAR(255) NOT NULL,
      date DATETIME DEFAULT CURRENT_TIMESTAMP,
      status VARCHAR(50) DEFAULT 'Pending'
    )`
  ];

  console.log("Initializing tables...");
  
  for (const query of queries) {
    try {
      await db.promise().query(query);
      console.log("Table check/creation successful.");
    } catch (err) {
      console.error("Error creating table:", err.message);
    }
  }

  // Seed a pharmacy user for testing if not exists
  try {
     const [rows] = await db.promise().query("SELECT * FROM pharmacies WHERE username = 'pharmacy1'");
     if (rows.length === 0) {
         await db.promise().query("INSERT INTO pharmacies (username, password, name, location) VALUES (?, ?, ?, ?)", 
             ['pharmacy1', 'password123', 'MedLife Pharmacy', 'Mirpur']);
         console.log("Seeded test pharmacy user.");
     }
  } catch(err) {
      console.error("Error seeding pharmacy:", err.message);
  }

  process.exit();
}

initTables();
