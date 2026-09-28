// Function to open the split modal and populate the top half data
function openImmModal(name, age, dob, sex, area, address) {
    document.getElementById('imm-name').textContent = name;
    document.getElementById('imm-age').textContent = age;
    document.getElementById('imm-dob').textContent = dob;
    document.getElementById('imm-sex').textContent = sex;
    document.getElementById('imm-area').textContent = area;
    document.getElementById('imm-address').textContent = address;
    
    document.getElementById('imm-med-name').textContent = name.includes("Ana") ? "Amoxicillin 250mg" : "Paracetamol 500mg";
    document.getElementById('imm-med-date').textContent = "2026-08-12";

    document.getElementById('imm-modal').style.display = 'flex';
}

function closeImmModal() {
    document.getElementById('imm-modal').style.display = 'none';
}

// --- NEW: Static Edit Modal Logic ---
function openEditImmModal(name, vaccine, lastDate, nextDate, status) {
    document.getElementById('edit-imm-name').value = name;
    document.getElementById('edit-imm-vaccine').value = vaccine;
    document.getElementById('edit-imm-last').value = lastDate;
    document.getElementById('edit-imm-next').value = nextDate;
    document.getElementById('edit-imm-status').value = status;
    
    document.getElementById('edit-imm-modal').style.display = 'flex';
}

function closeEditImmModal() {
    document.getElementById('edit-imm-modal').style.display = 'none';
}

// --- NEW: Live Filtering Logic ---
function filterTable() {
    const areaFilter = document.getElementById('filter-area').value;
    const vaccineFilter = document.getElementById('filter-vaccine').value;
    const statusFilter = document.getElementById('filter-status').value;

    const tbody = document.getElementById('imm-tbody');
    const rows = tbody.getElementsByTagName('tr');

    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        
        // Grab the static text from the specific table cells
        const vaccine = row.cells[2].textContent.trim();
        const status = row.cells[5].textContent.trim();
        
        // Extract the area directly from the hardcoded onclick parameter
        const actionHtml = row.cells[6].innerHTML;
        let area = "Proper"; 
        if (actionHtml.includes("'Heritage'")) area = "Heritage";
        if (actionHtml.includes("'Deca'")) area = "Deca";
        
        // Match condition against dropdown value
        const matchArea = (areaFilter === "All Areas") || (area === areaFilter);
        const matchVaccine = (vaccineFilter === "All Vaccines") || (vaccine === vaccineFilter);
        const matchStatus = (statusFilter === "All Statuses") || (status === statusFilter);

        if (matchArea && matchVaccine && matchStatus) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    }
}