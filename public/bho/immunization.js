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