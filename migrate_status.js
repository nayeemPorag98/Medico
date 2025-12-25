const db = require("./db");

console.log("Migrating database schema...");

const query = "ALTER TABLE appointments ADD COLUMN status VARCHAR(20) DEFAULT 'Pending'";

db.query(query, (err, result) => {
    if (err) {
        if (err.code === 'ER_DUP_FIELDNAME') {
            console.log("Column 'status' already exists.");
        } else {
            console.error("Migration Error:", err);
        }
    } else {
        console.log("Migration Success: Added 'status' column.");
    }
    process.exit(0);
});
