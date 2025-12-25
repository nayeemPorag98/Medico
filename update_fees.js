const db = require("./db");

async function updateFees() {
    console.log("Updating Doctor Fees...");

    const updates = [
        { id: 1, fees: "৳1000" }, // Fatima
        { id: 2, fees: "৳600" },  // Fatima 2
        { id: 3, fees: "৳1200" }, // Syed
        { id: 8, fees: "৳1500" }  // Mehadi
    ];

    try {
        for (const u of updates) {
            await db.promise().query("UPDATE doctors SET fees = ? WHERE id = ?", [u.fees, u.id]);
            console.log(`Updated Doc ID ${u.id} to ${u.fees}`);
        }
    } catch (err) {
        console.error("Error updating fees:", err.message);
    }
    process.exit();
}

updateFees();
