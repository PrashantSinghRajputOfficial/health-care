/*
╔══════════════════════════════════════════════════════════════════════════════╗
║   AMBULANCE PANEL - FIREBASE INTEGRATION                                     ║
║   Healthcare+ Ambulance Panel Logic                                          ║
╚══════════════════════════════════════════════════════════════════════════════╝
*/

// Check if user is logged in
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚑 Ambulance Panel loaded');
    
    // Check authentication
    checkAuth();
    
    // Load ambulance data
    loadAmbulanceData();
});

// Check if user is authenticated
function checkAuth() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    
    if (!currentUser) {
        console.log('❌ Not authenticated, redirecting to login');
        window.location.href = '/login';
        return;
    }
    
    // Check if user is ambulance
    if (currentUser.role !== 'ambulance') {
        console.log('❌ Wrong role, redirecting');
        alert('This panel is for ambulance services only');
        window.location.href = '/login';
        return;
    }
    
    console.log('✅ Ambulance authenticated:', currentUser.email);
}

// Load ambulance data
async function loadAmbulanceData() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    
    if (!currentUser) return;
    
    try {
        const userData = await getUserFromFirestore(currentUser.uid);
        
        if (userData) {
            console.log('✅ Ambulance data loaded:', userData);
        }
    } catch (error) {
        console.error('❌ Error loading ambulance data:', error);
    }
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

console.log('🚑 Ambulance Panel script loaded');
