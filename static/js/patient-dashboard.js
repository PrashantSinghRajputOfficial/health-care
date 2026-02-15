/*
╔══════════════════════════════════════════════════════════════════════════════╗
║   PATIENT DASHBOARD - FIREBASE INTEGRATION                                   ║
║   Healthcare+ Patient Dashboard Logic                                        ║
╚══════════════════════════════════════════════════════════════════════════════╝
*/

// Check if user is logged in
document.addEventListener('DOMContentLoaded', function() {
    console.log('📊 Patient Dashboard loaded');
    
    // Check authentication
    checkAuth();
    
    // Load patient data
    loadPatientData();
});

// Check if user is authenticated
function checkAuth() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    
    if (!currentUser) {
        // Not logged in, redirect to login
        console.log('❌ Not authenticated, redirecting to login');
        window.location.href = '/login';
        return;
    }
    
    // Check if user is patient
    if (currentUser.role !== 'patient') {
        console.log('❌ Wrong role, redirecting');
        alert('This dashboard is for patients only');
        window.location.href = '/login';
        return;
    }
    
    // Update UI with user info
    const patientNameEl = document.getElementById('patientName');
    if (patientNameEl) {
        patientNameEl.textContent = currentUser.displayName || currentUser.email;
    }
    
    console.log('✅ User authenticated:', currentUser.email);
}

// Load patient data
async function loadPatientData() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    
    if (!currentUser) return;
    
    try {
        // Get user data from Firestore
        const userData = await getUserFromFirestore(currentUser.uid);
        
        if (userData) {
            console.log('✅ Patient data loaded:', userData);
            
            // Update dashboard with real data
            updateDashboard(userData);
        }
    } catch (error) {
        console.error('❌ Error loading patient data:', error);
    }
}

// Update dashboard with data
function updateDashboard(userData) {
    // Update patient name
    const patientNameEl = document.getElementById('patientName');
    if (patientNameEl && userData.displayName) {
        patientNameEl.textContent = userData.displayName;
    }
    
    // You can add more dashboard updates here
    console.log('✅ Dashboard updated');
}

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        // Sign out from Firebase
        if (typeof firebaseAuth !== 'undefined') {
            firebaseAuth.signOut().then(() => {
                console.log('✅ Signed out from Firebase');
            }).catch((error) => {
                console.error('❌ Sign out error:', error);
            });
        }
        
        // Clear local storage
        localStorage.removeItem('currentUser');
        
        // Redirect to login
        window.location.href = '/login';
    }
}

// Make logout function global
window.logout = logout;

console.log('📊 Patient Dashboard script loaded');
