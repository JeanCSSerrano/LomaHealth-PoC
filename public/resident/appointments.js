document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch('/api/appointments');
        const allAppointments = await response.json();

        // 1. Filter ONLY for Juana
        const myAppointments = allAppointments.filter(apt => apt.name === "Juana Dela Cruz");

        // 2. Sort by date (Newest first)
        myAppointments.sort((a, b) => new Date(b.date) - new Date(a.date));

        // 3. Clear the hardcoded table rows
        const tbody = document.getElementById('appointments-tbody');
        tbody.innerHTML = ''; 

        // 4. Draw the dynamic rows
        myAppointments.forEach(apt => {
            const tr = document.createElement('tr');

            // Dynamic Colors for the Status Pill
            let bgStr = '#fde68a'; let colStr = '#92400e'; // Pending (Yellow)
            if(apt.status === 'Confirmed') { bgStr = '#115e59'; colStr = 'white'; } // Teal
            if(apt.status === 'Attended') { bgStr = '#4ade80'; colStr = '#064e3b'; } // Green
            if(apt.status === 'Missed') { bgStr = '#ef4444'; colStr = 'white'; } // Red

            tr.innerHTML = `
                <td>${apt.reference}</td>
                <td>${apt.service}</td>
                <td>${apt.date} - ${apt.time}</td>
                <td>${apt.location}</td>
                <td><span class="status-btn" style="background-color: ${bgStr}; color: ${colStr};">${apt.status}</span></td>
            `;

            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error("Error fetching appointments:", error);
    }
});