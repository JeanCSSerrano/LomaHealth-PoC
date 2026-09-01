document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch('/api/resident');
        const data = await response.json();
        
        // Populate Summary Cards
        document.getElementById('sum-apt').textContent = data.summary.appointments;
        document.getElementById('sum-rec').textContent = data.summary.records;

        // Populate Dashboard with Server Data
        document.getElementById('welcome-msg').textContent = `Good day, ${data.name}.`;
        
        // Populate Appointment Details
        document.getElementById('apt-service').textContent = data.upcomingAppointment.service;
        document.getElementById('apt-date').textContent = data.upcomingAppointment.date;
        document.getElementById('apt-time').textContent = data.upcomingAppointment.time;
        document.getElementById('apt-loc').textContent = data.upcomingAppointment.location;
        
        const statusEl = document.getElementById('apt-status');
        statusEl.textContent = data.upcomingAppointment.status;
        
        // Dynamic color for Dashboard status
        if(data.upcomingAppointment.status === 'Pending') {
            statusEl.style.backgroundColor = '#fde68a';
            statusEl.style.color = '#92400e';
        } else if (data.upcomingAppointment.status === 'Confirmed') {
            statusEl.style.backgroundColor = '#115e59';
            statusEl.style.color = 'white';
        } else if (data.upcomingAppointment.status === 'Attended') {
            statusEl.style.backgroundColor = '#4ade80';
            statusEl.style.color = '#064e3b';
        } else if (data.upcomingAppointment.status === 'Missed') {
            statusEl.style.backgroundColor = '#ef4444';
            statusEl.style.color = 'white';
        } else {
            statusEl.style.backgroundColor = '#d1d5db';
            statusEl.style.color = '#374151';
        }

        // Populate Recent Activity List
        const activityList = document.getElementById('activity-list');
        data.recentActivity.forEach(activity => {
            const li = document.createElement('li');
            li.innerHTML = `
                <div>
                    <strong>${activity.name}</strong><br>
                    <small style="color:#a0aec0">${activity.date}</small>
                </div>
                <span class="status-btn">${activity.status}</span>
            `;
            activityList.appendChild(li);
        });
    } catch (error) {
        console.error("Error fetching data:", error);
    }
});