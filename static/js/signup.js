/*
╔══════════════════════════════════════════════════════════════════════════════╗
║   SIGNUP LOGIC - FIREBASE AUTHENTICATION                                     ║
║   Healthcare+ User Registration System                                       ║
╚══════════════════════════════════════════════════════════════════════════════╝
*/

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    console.log('📝 Signup page loaded');
    
    // Get form elements
    const signupForm = document.getElementById('signupForm');
    const googleSignupBtn = document.getElementById('googleSignupBtn');
    const signupBtn = document.getElementById('signupBtn');
    const signupBtnText = document.getElementById('signupBtnText');
    const signupBtnLoader = document.getElementById('signupBtnLoader');
    
    // Email/Password Signup
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get form values
        const fullName = document.getElementById('fullName').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const role = document.getElementById('userType').value;
        const termsAccepted = document.getElementById('termsCheckbox').checked;
        
        // Validation
        if (!fullName || !email || !phone || !password || !role) {
            showError('Please fill in all fields');
            return;
        }
        
        if (password.length < 8) {
            showError('Password must be at least 8 characters long');
            return;
        }
        
        if (password !== confirmPassword) {
            showError('Passwords do not match');
            return;
        }
        
        if (!termsAccepted) {
            showError('Please accept the Terms & Conditions');
            return;
        }
        
        // Show loading
        setLoading(true);
        
        try {
            // Create user with Firebase Auth
            const userCredential = await firebaseAuth.createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;
            
            console.log('✅ User created:', user.uid);
            
            // Update display name
            await user.updateProfile({
                displayName: fullName
            });
            
            // Send email verification
            await user.sendEmailVerification();
            console.log('✅ Verification email sent');
            
            // Save additional user data to Firestore
            await saveUserToFirestore(user, {
                fullName: fullName,
                phone: phone,
                role: role,
                termsAccepted: true,
                accountStatus: 'active'
            });
            
            // Show success message
            showSuccess('Account created successfully! Please check your email for verification.');
            
            // Wait 2 seconds then redirect based on role
            setTimeout(() => {
                redirectToDashboard(role, user);
            }, 2000);
            
        } catch (error) {
            console.error('❌ Signup error:', error);
            handleAuthError(error);
        } finally {
            setLoading(false);
        }
    });
    
    // Google Sign-In
    googleSignupBtn.addEventListener('click', async () => {
        try {
            setLoading(true);
            
            // Sign in with Google popup
            const result = await firebaseAuth.signInWithPopup(googleProvider);
            const user = result.user;
            
            console.log('✅ Google sign-in successful:', user.email);
            
            // Check if user already exists in Firestore
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
    
    // Helper Functions
    
    function setLoading(loading) {
        if (loading) {
            signupBtn.disabled = true;
            googleSignupBtn.disabled = true;
            signupBtnText.style.display = 'none';
            signupBtnLoader.style.display = 'inline';
        } else {
            signupBtn.disabled = false;
            googleSignupBtn.disabled = false;
            signupBtnText.style.display = 'inline';
            signupBtnLoader.style.display = 'none';
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
            case 'auth/email-already-in-use':
                message = 'This email is already registered. Please login instead.';
                break;
            case 'auth/invalid-email':
                message = 'Invalid email address format.';
                break;
            case 'auth/weak-password':
                message = 'Password is too weak. Please use a stronger password.';
                break;
            case 'auth/operation-not-allowed':
                message = 'Email/password accounts are not enabled. Please contact support.';
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
    
    // Password strength indicator
    const passwordInput = document.getElementById('password');
    passwordInput.addEventListener('input', function() {
        const password = this.value;
        const strength = calculatePasswordStrength(password);
        
        // You can add visual feedback here
        console.log('Password strength:', strength);
    });
    
    function calculatePasswordStrength(password) {
        let strength = 0;
        
        if (password.length >= 8) strength++;
        if (password.length >= 12) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^a-zA-Z0-9]/.test(password)) strength++;
        
        if (strength <= 2) return 'weak';
        if (strength <= 4) return 'medium';
        return 'strong';
    }
});

console.log('📝 Signup script loaded');
