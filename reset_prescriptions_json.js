const db = require("./db");

async function resetTable() {
    console.log("Dropping prescriptions table...");
    try {
        await db.promise().query("DROP TABLE IF EXISTS prescriptions");
        console.log("Dropped prescriptions table.");
    } catch (err) {
        console.error("Error dropping table:", err.message);
    }

    // Using LONGTEXT to store JSON array of { name, dosage }
    const createQuery = `CREATE TABLE prescriptions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      patient_name VARCHAR(100) NOT NULL,
      doctor_name VARCHAR(100) NOT NULL,
      medicines LONGTEXT NOT NULL, 
      date DATETIME DEFAULT CURRENT_TIMESTAMP,
      status VARCHAR(50) DEFAULT 'Pending'
    )`;

    console.log("Recreating prescriptions table with JSON support...");
    try {
        await db.promise().query(createQuery);
        console.log("Recreated prescriptions table successfully.");
    } catch (err) {
        console.error("Error creating table:", err.message);
    }

    process.exit();
}

resetTable();
