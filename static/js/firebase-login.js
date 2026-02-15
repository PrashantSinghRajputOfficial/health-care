/*
╔══════════════════════════════════════════════════════════════════════════════╗
║   LOGIN LOGIC - FIREBASE AUTHENTICATION                                      ║
║   Healthcare+ User Login System                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝
*/

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔐 Login page loaded');
    
    // Get form elements
    const loginForm = document.getElementById('loginForm');
    const googleLoginBtn = document.getElementById('googleLoginBtn');
    const forgotPasswordLink = document.getElementById('forgotPasswordLink');
    const loginBtn = document.getElementById('loginBtn');
    const loginBtnText = document.getElementById('loginBtnText');
    const loginBtnLoader = document.getElementById('loginBtnLoader');
    
    // Email/Password Login
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get form values
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const role = document.getElementById('userType').value;
        
        // Validation
        if (!email || !password || !role) {
            showError('Please fill in all fields');
            return;
        }
        
        // Show loading
        setLoading(true);
        
        try {
            // Sign in with Firebase Auth
            const userCredential = await firebaseAuth.signInWithEmailAndPassword(email, password);
            const user = userCredential.user;
            
            console.log('✅ User signed in:', user.uid);
            
            // Get user data from Firestore
            const userData = await getUserFromFirestore(user.uid);
            
            if (!userData) {
                // User not found in Firestore, create entry
                await saveUserToFirestore(user, { role: role });
            } else {
                // Verify role matches
                if (userData.role !== role) {
                    showError(`This account is registered as ${userData.role}, not ${role}`);
                    await firebaseAuth.signOut();
                    return;
                }
            }
            
            // Check email verification (optional - can be disabled for testing)
            if (!user.emailVerified) {
                const verify = confirm('Your email is not verified. Would you like to resend the verification email?');
                if (verify) {
                    await user.sendEmailVerification();
                    showSuccess('Verification email sent! Please check your inbox.');
                }
                // Allow login even without verification for now
            }
            
            // Update last login
            await updateLastLogin(user.uid);
            
            // Show success
            showSuccess('Login successful!');
            
            // Redirect to dashboard
            setTimeout(() => {
                redirectToDashboard(userData?.role || role, user);
            }, 1000);
            
        } catch (error) {
            console.error('❌ Login error:', error);
            handleAuthError(error);
        } finally {
            setLoading(false);
        }
    });
    
    // Google Sign-In
    googleLoginBtn.addEventListener('click', async () => {
        try {
            setLoading(true);
            
            // Sign in with Google popup
            const result = await firebaseAuth.signInWithPopup(googleProvider);
            const user = result.user;
            
            console.log('✅ Google sign-in successful:', user.email);
            
            // Get user data from Firestore
            let userData = await getUserFromFirestore(user.uid);
            
            if (!userData) {
                // New user - ask for role
                const role = await askForRole();
                
                if (!role) {
                    // User cancelled role selection
                    await firebaseAuth.signOut();
                    showError('Role selection is required');
                    return;
                }
                
                // Save user data
                userData = await saveUserToFirestore(user, {
                    role: role,
                    phone: user.phoneNumber || '',
                    termsAccepted: true,
                    accountStatus: 'active'
                });
            }
            
            // Update last login
            await updateLastLogin(user.uid);
            
            // Redirect to dashboard
            showSuccess('Signed in successfully!');
            setTimeout(() => {
                redirectToDashboard(userData.role, user);
            }, 1000);
            
        } catch (error) {
            console.error('❌ Google sign-in error:', error);
            handleAuthError(error);
        } finally {
            setLoading(false);
        }
    });
    
    // Forgot Password
    forgotPasswordLink.addEventListener('click', async (e) => {
        e.preventDefault();
        
        const email = prompt('Enter your email address to reset password:');
        
        if (!email) return;
        
        try {
            await firebaseAuth.sendPasswordResetEmail(email);
            showSuccess('Password reset email sent! Please check your inbox.');
        } catch (error) {
            console.error('❌ Password reset error:', error);
            handleAuthError(error);
        }
    });
    
    // Helper Functions
    
    function setLoading(loading) {
        if (loading) {
            loginBtn.disabled = true;
            googleLoginBtn.disabled = true;
            loginBtnText.style.display = 'none';
            loginBtnLoader.style.display = 'inline';
        } else {
            loginBtn.disabled = false;
            googleLoginBtn.disabled = false;
            loginBtnText.style.display = 'inline';
            loginBtnLoader.style.display = 'none';
        }
    }
    
    function showError(message) {
        alert('❌ Error: ' + message);
    }
    
    function showSuccess(message) {
        alert('✅ ' + message);
    }
    
    function handleAuthError(error) {
        let message = 'An error occurred. Please try again.';
        
        switch (error.code) {
            case 'auth/user-not-found':
                message = 'No account found with this email. Please sign up first.';
                break;
            case 'auth/wrong-password':
                message = 'Incorrect password. Please try again.';
                break;
            case 'auth/invalid-email':
                message = 'Invalid email address format.';
                break;
            case 'auth/user-disabled':
                message = 'This account has been disabled. Please contact support.';
                break;
            case 'auth/too-many-requests':
                message = 'Too many failed login attempts. Please try again later.';
                break;
            case 'auth/popup-closed-by-user':
                message = 'Sign-in popup was closed. Please try again.';
                break;
            case 'auth/cancelled-popup-request':
                message = 'Only one popup request is allowed at a time.';
                break;
            default:
                message = error.message;
        }
        
        showError(message);
    }
    
    async function askForRole() {
        return new Promise((resolve) => {
            const role = prompt('Please select your role:\n1. Patient\n2. Doctor\n3. Ambulance\n\nEnter 1, 2, or 3:');
            
            if (role === '1') resolve('patient');
            else if (role === '2') resolve('doctor');
            else if (role === '3') resolve('ambulance');
            else resolve(null);
        });
    }
    
    function redirectToDashboard(role, user) {
        // Store user info in localStorage
        localStorage.setItem('currentUser', JSON.stringify({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            role: role
        }));
        
        // Dynamic base URL - works on localhost, GitHub Pages, and production
        const baseUrl = window.location.origin;
        
        // Redirect based on role
        switch (role) {
            case 'patient':
                window.location.href = baseUrl + '/patient-dashboard';
                break;
            case 'doctor':
                window.location.href = baseUrl + '/doctor-dashboard';
                break;
            case 'ambulance':
                window.location.href = baseUrl + '/ambulance-panel';
                break;
            default:
                window.location.href = baseUrl + '/';
        }
    }
});

console.log('🔐 Login script loaded');
