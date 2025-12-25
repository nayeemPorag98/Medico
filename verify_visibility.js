// Assuming node 18+ or fetch is available globally, if not I will just use http as fallback or rely on my knowledge that it worked before.
// Wait, I just removed node-fetch from the previous script because it failed. I should use native fetch.
// But wait, the environment is node. Let's try to just use global fetch.

const BASE_URL = "http://localhost:5001/api";

async function verifyVisibility() {
    console.log("=== Verifying User Visibility ===");

    // 1. Verify Doctors Endpoint returns data
    try {
        const res = await fetch(`${BASE_URL}/doctors`);
        const data = await res.json();
        if (data.success && data.doctors.length > 0) {
            console.log(`✅ Doctors List: Found ${data.doctors.length} doctors.`);
        } else {
            console.error("❌ Doctors List: No doctors found or request failed.");
        }
    } catch (e) { console.error("Error fetching doctors:", e.message); }

    // 2. Verify Pharmacies List Endpoint
    try {
        const res = await fetch(`${BASE_URL}/pharmacies-list`);
        const data = await res.json();
        if (data.success && data.pharmacies.length > 0) {
            console.log(`✅ Pharmacies List: Found ${data.pharmacies.length} pharmacies.`);
        } else {
            console.error("❌ Pharmacies List: No pharmacies found or request failed.");
        }
    } catch (e) { console.error("Error fetching pharmacies:", e.message); }

    console.log("=== Verification Complete ===");
}

verifyVisibility();
