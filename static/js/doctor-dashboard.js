/*
╔══════════════════════════════════════════════════════════════════════════════╗
║   DOCTOR DASHBOARD - FIREBASE INTEGRATION                                    ║
║   Healthcare+ Doctor Dashboard Logic                                         ║
╚══════════════════════════════════════════════════════════════════════════════╝
*/

// Check if user is logged in
document.addEventListener('DOMContentLoaded', function() {
    console.log('👨‍⚕️ Doctor Dashboard loaded');
    
    // Check authentication
    checkAuth();
    
    // Load doctor data
    loadDoctorData();
});

// Check if user is authenticated
function checkAuth() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    
    if (!currentUser) {
        console.log('❌ Not authenticated, redirecting to login');
        window.location.href = '/login';
        return;
    }
    
    // Check if user is doctor
    if (currentUser.role !== 'doctor') {
        console.log('❌ Wrong role, redirecting');
        alert('This dashboard is for doctors only');
        window.location.href = '/login';
        return;
    }
    
    // Update UI with user info
    const doctorNameEl = document.getElementById('doctorName');
    if (doctorNameEl) {
        doctorNameEl.textContent = currentUser.displayName || currentUser.email;
    }
    
    console.log('✅ Doctor authenticated:', currentUser.email);
}

// Load doctor data
async function loadDoctorData() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    
    if (!currentUser) return;
    
    try {
        const userData = await getUserFromFirestore(currentUser.uid);
        
        if (userData) {
            console.log('✅ Doctor data loaded:', userData);
            updateDashboard(userData);
        }
    } catch (error) {
        console.error('❌ Error loading doctor data:', error);
    }
}

// Update dashboard
function updateDashboard(userData) {
    const doctorNameEl = document.getElementById('doctorName');
    if (doctorNameEl && userData.displayName) {
        doctorNameEl.textContent = userData.displayName;
    }
    
    console.log('✅ Dashboard updated');
}

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        if (typeof firebaseAuth !== 'undefined') {
            firebaseAuth.signOut().then(() => {
                console.log('✅ Signed out from Firebase');
            }).catch((error) => {
                console.error('❌ Sign out error:', error);
            });
        }
        
        localStorage.removeItem('currentUser');
        window.location.href = '/login';
    }
}

window.logout = logout;

// ============================================================================
// PATIENT DETAILS MODAL
// ============================================================================

// Patient data database (demo data)
const patientDatabase = {
    'JD': {
        name: 'John Doe',
        id: 'Patient ID: P12345',
        age: '45 years',
        gender: 'Male',
        bloodGroup: 'O+',
        phone: '+91 98765 43210',
        risk: 'High Risk',
        vitals: {
            heartRate: '120 bpm',
            bloodPressure: '160/95',
            spo2: '92%',
            temperature: '99.2°F'
        },
        medicalHistory: [
            'Hypertension (Diagnosed: 2020)',
            'Type 2 Diabetes (Diagnosed: 2018)',
            'Allergic to Penicillin',
            'Previous heart surgery (2019)'
        ],
        medications: [
            { name: 'Metformin 500mg', dosage: 'Twice daily with meals' },
            { name: 'Lisinopril 10mg', dosage: 'Once daily in the morning' },
            { name: 'Aspirin 75mg', dosage: 'Once daily' }
        ],
        labResults: [
            { name: 'Blood Sugar (Fasting)', value: '145 mg/dL', status: 'warning' },
            { name: 'HbA1c', value: '7.2%', status: 'warning' },
            { name: 'Cholesterol', value: '220 mg/dL', status: 'warning' }
        ]
    },
    'MJ': {
        name: 'Mary Johnson',
        id: 'Patient ID: P23456',
        age: '38 years',
        gender: 'Female',
        bloodGroup: 'A+',
        phone: '+91 98765 43211',
        risk: 'Moderate Risk',
        vitals: {
            heartRate: '85 bpm',
            bloodPressure: '130/85',
            spo2: '96%',
            temperature: '98.6°F'
        },
        medicalHistory: [
            'Migraine (Diagnosed: 2019)',
            'Vitamin D deficiency',
            'No known allergies'
        ],
        medications: [
            { name: 'Sumatriptan 50mg', dosage: 'As needed for migraine' },
            { name: 'Vitamin D3 1000 IU', dosage: 'Once daily' }
        ],
        labResults: [
            { name: 'Blood Sugar (Fasting)', value: '95 mg/dL', status: 'normal' },
            { name: 'Vitamin D', value: '28 ng/mL', status: 'normal' },
            { name: 'Cholesterol', value: '185 mg/dL', status: 'normal' }
        ]
    },
    'RS': {
        name: 'Robert Smith',
        id: 'Patient ID: P34567',
        age: '52 years',
        gender: 'Male',
        bloodGroup: 'B+',
        phone: '+91 98765 43212',
        risk: 'Low Risk',
        vitals: {
            heartRate: '72 bpm',
            bloodPressure: '118/78',
            spo2: '98%',
            temperature: '98.4°F'
        },
        medicalHistory: [
            'Seasonal allergies',
            'No chronic conditions'
        ],
        medications: [
            { name: 'Cetirizine 10mg', dosage: 'Once daily during allergy season' }
        ],
        labResults: [
            { name: 'Blood Sugar (Fasting)', value: '88 mg/dL', status: 'normal' },
            { name: 'HbA1c', value: '5.4%', status: 'normal' },
            { name: 'Cholesterol', value: '175 mg/dL', status: 'normal' }
        ]
    },
    'LW': {
        name: 'Lisa Williams',
        id: 'Patient ID: P45678',
        age: '29 years',
        gender: 'Female',
        bloodGroup: 'AB+',
        phone: '+91 98765 43213',
        risk: 'Low Risk',
        vitals: {
            heartRate: '68 bpm',
            bloodPressure: '115/75',
            spo2: '99%',
            temperature: '98.2°F'
        },
        medicalHistory: [
            'No significant medical history',
            'Regular health checkups'
        ],
        medications: [
            { name: 'Multivitamin', dosage: 'Once daily' }
        ],
        labResults: [
            { name: 'Blood Sugar (Fasting)', value: '82 mg/dL', status: 'normal' },
            { name: 'HbA1c', value: '5.1%', status: 'normal' },
            { name: 'Cholesterol', value: '165 mg/dL', status: 'normal' }
        ]
    }
};

// Show patient details modal
function showPatientDetails(avatar, name, id, risk, appointment) {
    console.log('📋 Opening patient details for:', name);
    
    const patient = patientDatabase[avatar];
    if (!patient) {
        console.error('❌ Patient not found:', avatar);
        return;
    }
    
    // Update modal header
    document.getElementById('modalPatientName').textContent = 'Patient Details';
    document.getElementById('modalAvatar').textContent = avatar;
    document.getElementById('modalFullName').textContent = patient.name;
    document.getElementById('modalPatientId').textContent = patient.id;
    document.getElementById('modalAppointment').textContent = appointment;
    
    // Update risk badge
    const riskBadge = document.getElementById('modalRiskBadge');
    riskBadge.textContent = patient.risk;
    riskBadge.className = 'patient-risk-badge ' + patient.risk.toLowerCase().replace(' ', '-');
    
    // Update personal info
    document.getElementById('modalAge').textContent = patient.age;
    document.getElementById('modalGender').textContent = patient.gender;
    document.getElementById('modalBloodGroup').textContent = patient.bloodGroup;
    document.getElementById('modalPhone').textContent = patient.phone;
    
    // Update vitals
    const vitalsGrid = document.querySelector('.vitals-grid-modal');
    vitalsGrid.innerHTML = `
        <div class="vital-card">
            <div class="vital-icon">❤️</div>
            <div class="vital-label">Heart Rate</div>
            <div class="vital-value">${patient.vitals.heartRate}</div>
        </div>
        <div class="vital-card">
            <div class="vital-icon">💉</div>
            <div class="vital-label">Blood Pressure</div>
            <div class="vital-value">${patient.vitals.bloodPressure}</div>
        </div>
        <div class="vital-card">
            <div class="vital-icon">🫁</div>
            <div class="vital-label">SpO2</div>
            <div class="vital-value">${patient.vitals.spo2}</div>
        </div>
        <div class="vital-card">
            <div class="vital-icon">🌡️</div>
            <div class="vital-label">Temperature</div>
            <div class="vital-value">${patient.vitals.temperature}</div>
        </div>
    `;
    
    // Update medical history
    const historyList = document.querySelector('.medical-history-list');
    historyList.innerHTML = patient.medicalHistory.map(item => `<li>${item}</li>`).join('');
    
    // Update medications
    const medicationsList = document.querySelector('.medications-list');
    medicationsList.innerHTML = patient.medications.map(med => 
        `<li><strong>${med.name}</strong> - ${med.dosage}</li>`
    ).join('');
    
    // Update lab results
    const labResults = document.querySelector('.lab-results');
    labResults.innerHTML = patient.labResults.map(lab => `
        <div class="lab-item">
            <span class="lab-name">${lab.name}</span>
            <span class="lab-value">${lab.value}</span>
            <span class="lab-status ${lab.status}">${lab.status === 'normal' ? 'Normal' : 'Borderline'}</span>
        </div>
    `).join('');
    
    // Show modal
    const modal = document.getElementById('patientModal');
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

// Close patient modal
function closePatientModal() {
    const modal = document.getElementById('patientModal');
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
}

// Make functions global
window.showPatientDetails = showPatientDetails;
window.closePatientModal = closePatientModal;

console.log('👨‍⚕️ Doctor Dashboard script loaded');
