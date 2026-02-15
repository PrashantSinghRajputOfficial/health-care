// Global state
let currentUser = null;
const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000/api'
    : '/api';  // Use relative path in production

// Utility function for API calls
async function apiCall(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || `HTTP error! status: ${response.status}`);
        }
        
        return data;
    } catch (error) {
        console.error('API call error:', error);
        throw error;
    }
}

// Page navigation
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
}

// Login
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const role = document.getElementById('userType').value;
    
    if (!email || !password || !role) {
        alert('Please enter email, password, and select a role');
        return;
    }
    
    try {
        const data = await apiCall('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email: email, password: password, role: role })
        });
        
        if (data.success) {
            currentUser = data.user;
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('currentUser', JSON.stringify(data.user));
            
            // Redirect based on role
            if (data.user.role === 'patient') {
                window.location.href = '/templates/patient-dashboard.html';
            } else if (data.user.role === 'doctor') {
                window.location.href = '/templates/doctor-dashboard.html';
            } else if (data.user.role === 'ambulance') {
                window.location.href = '/templates/ambulance-panel.html';
            }
        }
    } catch (error) {
        alert('Login failed: ' + error.message);
    }
});

// Load patient dashboard
async function loadPatientDashboard(userId) {
    try {
        const data = await apiCall(`/patient/dashboard/${userId}`);
        
        // Display health history
        const historyDiv = document.getElementById('healthHistory');
        if (data.records && data.records.length > 0) {
            historyDiv.innerHTML = data.records.map(record => `
                <div class="history-item">
                    <p><strong>Date:</strong> ${new Date(record.timestamp).toLocaleString()}</p>
                    <p>BP: ${record.bp_systolic}/${record.bp_diastolic} | Sugar: ${record.blood_sugar} | HR: ${record.heart_rate} | SpO2: ${record.spo2}%</p>
                </div>
            `).join('');
        } else {
            historyDiv.innerHTML = '<p>No health records yet. Enter your vitals above!</p>';
        }
    } catch (error) {
        console.error('Dashboard load error:', error);
        alert('Failed to load dashboard: ' + error.message);
    }
}

// Health prediction
document.getElementById('vitalsForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const vitals = {
        user_id: currentUser.id,
        age: parseInt(document.getElementById('age').value),
        bp_systolic: parseInt(document.getElementById('bpSystolic').value),
        bp_diastolic: parseInt(document.getElementById('bpDiastolic').value),
        blood_sugar: parseFloat(document.getElementById('bloodSugar').value),
        heart_rate: parseInt(document.getElementById('heartRate').value),
        spo2: parseInt(document.getElementById('spo2').value)
    };
    
    // Validate inputs
    if (isNaN(vitals.age) || isNaN(vitals.bp_systolic) || isNaN(vitals.bp_diastolic) ||
        isNaN(vitals.blood_sugar) || isNaN(vitals.heart_rate) || isNaN(vitals.spo2)) {
        alert('Please enter valid numbers for all fields');
        return;
    }
    
    try {
        const data = await apiCall('/health/predict', {
            method: 'POST',
            body: JSON.stringify(vitals)
        });
        
        if (data.success) {
            // Display prediction
            const resultDiv = document.getElementById('predictionResult');
            const riskDisplay = document.getElementById('riskDisplay');
            const recommendationsDiv = document.getElementById('recommendations');
            
            let riskClass = 'risk-low';
            if (data.risk_level === 'Medium') riskClass = 'risk-medium';
            if (data.risk_level === 'High') riskClass = 'risk-high';
            
            riskDisplay.innerHTML = `
                <div class="risk-badge ${riskClass}">
                    Risk Level: ${data.risk_level} (${(data.risk_score * 100).toFixed(0)}%)
                </div>
            `;
            
            recommendationsDiv.innerHTML = `
                <div class="recommendations">
                    <strong>📋 Recommendations:</strong><br>
                    ${data.recommendations}
                </div>
            `;
            
            resultDiv.style.display = 'block';
            
            // Show emergency alert if needed
            if (data.is_emergency) {
                alert('⚠️ EMERGENCY DETECTED!\n\n' + data.emergency_type + '\n\nPlease seek immediate medical attention!');
            }
            
            // Reload dashboard
            loadPatientDashboard(currentUser.id);
        }
    } catch (error) {
        alert('Prediction failed: ' + error.message);
    }
});

// SOS Button
document.getElementById('sosButton').addEventListener('click', async () => {
    if (!confirm('🚨 Are you sure you want to trigger EMERGENCY SOS?')) {
        return;
    }
    
    try {
        const data = await apiCall('/emergency/sos', {
            method: 'POST',
            body: JSON.stringify({
                user_id: currentUser.id,
                location: 'Current Location' // In real app, use geolocation
            })
        });
        
        if (data.success) {
            alert('✅ ' + data.message + '\n\nHelp is on the way!');
        }
    } catch (error) {
        alert('SOS failed: ' + error.message);
    }
});

// Load emergencies (for doctor)
async function loadEmergencies() {
    try {
        const data = await apiCall('/doctor/emergencies');
        
        const listDiv = document.getElementById('emergenciesList');
        
        if (data.emergencies && data.emergencies.length > 0) {
            listDiv.innerHTML = data.emergencies.map(emergency => `
                <div class="emergency-item">
                    <h4>🚨 Emergency #${emergency.id}</h4>
                    <p><strong>Patient:</strong> ${emergency.name} (${emergency.abha_id})</p>
                    <p><strong>Phone:</strong> ${emergency.phone}</p>
                    <p><strong>Type:</strong> ${emergency.emergency_type}</p>
                    <p><strong>Status:</strong> ${emergency.status}</p>
                    <p><strong>Time:</strong> ${new Date(emergency.created_at).toLocaleString()}</p>
                    <p><strong>Vitals:</strong> ${emergency.vitals_summary}</p>
                    <button onclick="dispatchAmbulance(${emergency.id})" class="btn btn-secondary">
                        🚑 Dispatch Ambulance
                    </button>
                </div>
            `).join('');
        } else {
            listDiv.innerHTML = '<p>No active emergencies</p>';
        }
    } catch (error) {
        console.error('Load emergencies error:', error);
        alert('Failed to load emergencies: ' + error.message);
    }
}

// Dispatch ambulance
async function dispatchAmbulance(emergencyId) {
    try {
        const data = await apiCall('/ambulance/dispatch', {
            method: 'POST',
            body: JSON.stringify({ emergency_id: emergencyId })
        });
        
        if (data.success) {
            alert('✅ ' + data.message + '\nETA: ' + data.eta);
            loadEmergencies();
        }
    } catch (error) {
        alert('Dispatch failed: ' + error.message);
    }
}

// Logout
function logout() {
    currentUser = null;
    showPage('loginPage');
    document.getElementById('loginForm').reset();
}
