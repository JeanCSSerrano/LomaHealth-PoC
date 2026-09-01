// Global variable to hold user's choices as they click through
let appointmentData = {
    service: "",
    date: "",
    time: "",
    location: "",
    notes: ""
};

// 1. Navigation Logic for Tabs
function nextStep(stepNumber) {
    // Hide all steps
    document.querySelectorAll('.form-step').forEach(el => el.classList.remove('active-step'));
    // Un-highlight all tracker numbers
    document.querySelectorAll('.step').forEach(el => el.classList.remove('active'));
    
    // Show the target step
    document.getElementById(`step-${stepNumber}`).classList.add('active-step');
    document.getElementById(`tracker-${stepNumber}`).classList.add('active');
}

// 2. Time Slot Selection Logic
function selectTime(btnElement, time) {
    // Remove background from all buttons
    document.querySelectorAll('.time-btn').forEach(btn => btn.style.backgroundColor = '');
    // Highlight selected button
    btnElement.style.backgroundColor = '#d8b4e2'; 
    // Save to variable
    appointmentData.time = time;
}

// 3. Move from Step 2 to Step 3 (Collect Data & Populate Summary)
function goToConfirm() {
    // Grab selected service
    const serviceInput = document.querySelector('input[name="service"]:checked');
    appointmentData.service = serviceInput ? serviceInput.value : "Unknown";
    
    // Grab Date & Location
    appointmentData.date = document.getElementById('booking-date').value;
    appointmentData.location = document.getElementById('booking-loc').value;

    // Validation check!
    if (!appointmentData.time) {
        alert("Please select an available time slot!");
        return;
    }

    // Populate the Summary text on Step 3
    document.getElementById('summary-service').textContent = appointmentData.service;
    document.getElementById('summary-date').textContent = appointmentData.date;
    document.getElementById('summary-time').textContent = appointmentData.time;
    document.getElementById('summary-loc').textContent = appointmentData.location;

    nextStep(3); // Move to final tab
}

// 4. Submit to Backend & Show Modal
async function submitAppointment() {
    // Grab the notes just before sending
    appointmentData.notes = document.getElementById('booking-notes').value;

    try {
        // Send a POST request to your Express server
        const response = await fetch('/api/appointments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(appointmentData)
        });

        const result = await response.json();

        if (result.success) {
            // Show the success popup!
            document.getElementById('appointment-modal').style.display = 'flex';
        }
    } catch (error) {
        console.error("Failed to save appointment:", error);
        alert("Server error. Is server.js running?");
    }
}

// Modal Close logic
function closePopup() {
    document.getElementById('appointment-modal').style.display = 'none';
    window.location.href = 'my-appointments.html'; // Redirect them to see their new appt!
}