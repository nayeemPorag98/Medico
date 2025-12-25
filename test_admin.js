
const BASE_URL = "http://localhost:5001/api";
let adminToken = null; // actually the user object string

async function runTests() {
    console.log("=== STARTING ADMIN TESTS ===");

    // 1. Login as Admin
    try {
        const res = await fetch(`${BASE_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: "admin", password: "password123", role: "Admin" })
        });
        const data = await res.json();
        if (data.success) {
            console.log(" Admin Login Success");
            adminToken = JSON.stringify(data.user);
        } else {
            console.error(" Admin Login Failed:", data.message);
            process.exit(1);
        }
    } catch (e) {
        console.error(" Login Error:", e.message);
        process.exit(1);
    }

    // 2. Add Doctor
    let doctorId = null;
    try {
        const res = await fetch(`${BASE_URL}/admin/doctors`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "user": adminToken },
            body: JSON.stringify({ username: "testdocuser", password: "password", name: "Test Doctor", specialty: "General" })
        });
        const data = await res.json();
        if (data.success) console.log(" Add Doctor Success");
        else console.error(" Add Doctor Failed:", data.message);
    } catch (e) { console.error(e); }

    // 3. Verify Doctor and Get ID (Need to implement GET /api/admin/data or just rely on public endpoint)
    try {
        const res = await fetch(`${BASE_URL}/admin/data`, { headers: { "user": adminToken } });
        const data = await res.json();
        if (data.success) {
            const doc = data.doctors.find(d => d.username === "testdocuser");
            if (doc) {
                console.log(" Doctor found in list");
                doctorId = doc.id;
            } else {
                console.error(" Doctor not found in list");
            }
        }
    } catch (e) { console.error(e); }

    // 4. Delete Doctor
    if (doctorId) {
        try {
            const res = await fetch(`${BASE_URL}/admin/doctors/${doctorId}`, {
                method: "DELETE", headers: { "user": adminToken }
            });
            const data = await res.json();
            if (data.success) console.log(" Delete Doctor Success");
            else console.error(" Delete Doctor Failed:", data.message);
        } catch (e) { console.error(e); }
    }

    console.log("=== TESTS COMPLETED ===");
}

runTests();
