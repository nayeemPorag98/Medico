
const BASE_URL = "http://localhost:5001/api";

async function testFlow() {
    console.log("1. Testing Login...");
    try {
        const loginRes = await fetch(`${BASE_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: "testpatient", // Ensure this user exists or use one created via signup
                password: "password123",
                role: "Patient"
            })
        });

        const loginData = await loginRes.json();
        console.log("Login Response:", loginData);

        if (!loginData.success) {
            console.error("Login Failed - cannot proceed to booking test.");

            // Try signing up first if login failed
            console.log("Attempting Signup for test user...");
            const signupRes = await fetch(`${BASE_URL}/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: "testpatient",
                    password: "password123",
                    name: "Test Patient",
                    role: "Patient"
                })
            });
            console.log("Signup Response:", await signupRes.json());
            console.log("Please re-run this script to test login again.");
            return;
        }

        const userString = JSON.stringify(loginData.user);
        console.log("User object for header:", userString);

        console.log("\n2. Testing Book Appointment (Protected Route)...");
        const bookRes = await fetch(`${BASE_URL}/book-appointment`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "user": userString
            },
            body: JSON.stringify({
                patientName: "Test Patient",
                doctorName: "Dr. Test",
                date: "2025-01-01",
                time: "10:00"
            })
        });

        const bookData = await bookRes.json();
        console.log("Booking Response:", bookData);

    } catch (err) {
        console.error("Test Script Error:", err);
    }
}

testFlow();
