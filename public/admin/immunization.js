// Function to open the split modal and populate the top half data
function openImmModal(name, age, dob, sex, area, address) {
    // Populate the labels
    document.getElementById('imm-name').textContent = name;
    document.getElementById('imm-age').textContent = age;
    document.getElementById('imm-dob').textContent = dob;
    document.getElementById('imm-sex').textContent = sex;
    document.getElementById('imm-area').textContent = area;
    document.getElementById('imm-address').textContent = address;
    
    // Add some random mock data for the Medicine Requests side based on the person
    document.getElementById('imm-med-name').textContent = name.includes("Ana") ? "Amoxicillin 250mg" : "Paracetamol 500mg";
    document.getElementById('imm-med-date').textContent = "2026-08-12";

    // Show the modal
    document.getElementById('imm-modal').style.display = 'flex';
}

function closeImmModal() {
    document.getElementById('imm-modal').style.display = 'none';
}