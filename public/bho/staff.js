document.addEventListener("DOMContentLoaded", () => {
    loadStaff();
});

// 1. Fetch & Render Table
async function loadStaff() {
    try {
        const response = await fetch('/api/staff');
        const staffs = await response.json();
        const tbody = document.getElementById('staff-tbody');
        tbody.innerHTML = ''; 

        staffs.forEach(s => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><div class="res-avatar" style="background-color: #f3f4f6;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg></div></td>
                <td style="text-align: left; padding-left: 10px; font-weight: 500;">${s.name}</td>
                <td>${s.email}</td>
                <td>${s.role}</td>
                <td>${s.area}</td>
                <td><span class="status-pill status-complete">${s.status}</span></td>
                <td>${s.lastLogin}</td>
                <td class="action-icons">
                    <!-- VIEW ICON -->
                    <svg onclick="openViewModal('${s.name}', '${s.email}', '${s.role}', '${s.area}', '${s.status}', '${s.lastLogin}')" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    <!-- EDIT ICON -->
                    <svg onclick="openEditModal(${s.id}, '${s.name}', '${s.email}', '${s.role}', '${s.area}')" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    <!-- TRASH ICON -->
                    <svg onclick="deleteStaff(${s.id})" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    <!-- HISTORY/LOGS (Static) -->
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error("Error loading staff:", error);
    }
}

// 2. Add Staff
async function submitNewStaff() {
    const name = document.getElementById('add-name').value;
    if (!name) { alert("Name is required!"); return; }

    const newStaff = {
        name: name,
        email: document.getElementById('add-email').value,
        role: document.getElementById('add-role').value,
        area: document.getElementById('add-area').value
    };

    await fetch('/api/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStaff)
    });

    closeAddModal();
    document.querySelectorAll('#add-staff-modal input').forEach(input => input.value = ''); // reset
    loadStaff(); // render table
}

// 3. Edit Staff 
async function submitEditStaff() {
    const id = document.getElementById('edit-id').value;
    
    const updatedData = {
        name: document.getElementById('edit-name').value,
        email: document.getElementById('edit-email').value,
        role: document.getElementById('edit-role').value,
        area: document.getElementById('edit-area').value
    };

    await fetch(`/api/staff/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
    });

    closeEditModal();
    loadStaff(); // Render the new data instantly!
}

// 4. Delete Staff
async function deleteStaff(id) {
    if(confirm("Are you sure you want to remove this staff member?")) {
        await fetch(`/api/staff/${id}`, { method: 'DELETE' });
        loadStaff(); // Instant visual update
    }
}

// ==========================================
// Modal Control & Population Helpers
// ==========================================
function openViewModal(name, email, role, area, status, login) {
    document.getElementById('view-name').textContent = name;
    document.getElementById('view-role').textContent = role;
    document.getElementById('view-area').textContent = area;
    document.getElementById('view-status').textContent = status;
    document.getElementById('view-email').textContent = email;
    document.getElementById('view-login').textContent = login;
    document.getElementById('view-staff-modal').style.display = 'flex';
}

function openEditModal(id, name, email, role, area) {
    document.getElementById('edit-id').value = id; // Store ID invisibly
    document.getElementById('edit-name').value = name;
    document.getElementById('edit-email').value = email;
    document.getElementById('edit-role').value = role;
    document.getElementById('edit-area').value = area;
    document.getElementById('edit-staff-modal').style.display = 'flex';
}

function closeViewModal() { document.getElementById('view-staff-modal').style.display = 'none'; }
function openAddModal() { document.getElementById('add-staff-modal').style.display = 'flex'; }
function closeAddModal() { document.getElementById('add-staff-modal').style.display = 'none'; }
function closeEditModal() { document.getElementById('edit-staff-modal').style.display = 'none'; }