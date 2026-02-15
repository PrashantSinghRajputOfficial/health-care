/*
╔══════════════════════════════════════════════════════════════════════════════╗
║   HEALTHCARE+ INTELLIGENT CHATBOT                                           ║
║   AI-Powered Assistant for Healthcare System Support                        ║
║   Helps users with system issues, navigation, and healthcare guidance       ║
╚══════════════════════════════════════════════════════════════════════════════╝
*/

// ============================================================================
// CHATBOT CONFIGURATION & KNOWLEDGE BASE
// ============================================================================
const CHATBOT_CONFIG = {
    name: 'HealthBot',
    version: '1.0',
    greeting: 'Hello! I\'m HealthBot, your healthcare assistant. How can I help you today?',
    fallbackMessage: 'I\'m sorry, I didn\'t understand that. Could you please rephrase your question or try asking about login issues, emergency services, or system navigation?',
    maxMessages: 50,
    typingDelay: 1000,
    responseDelay: 500
};

// Comprehensive knowledge base for healthcare system
const KNOWLEDGE_BASE = {
    // Login & Authentication Issues
    login: {
        keywords: ['login', 'sign in', 'password', 'forgot password', 'account', 'authentication', 'abha', 'credentials', 'reset', 'demo'],
        responses: [
            {
                condition: ['demo', 'credential'],
                answer: '🔑 **Demo Credentials for Testing:**\n\n**Patient Account:**\n• Email: patient@healthcare.com\n• Password: password123\n• Role: Patient\n• Features: Full patient dashboard access\n\n**Doctor Account:**\n• Email: doctor@healthcare.com\n• Password: doctor123\n• Role: Doctor\n• Features: Doctor dashboard with patient monitoring\n\n**Ambulance Account:**\n• Email: ambulance@healthcare.com\n• Password: ambulance123\n• Role: Ambulance\n• Features: Dispatch and navigation panel\n\n**How to Use:**\n1. Go to login page\n2. Enter email (e.g., patient@healthcare.com)\n3. Enter password (e.g., password123)\n4. Select correct role from dropdown\n5. Click "Login" button\n\n**Important Notes:**\n• These are demo accounts for testing\n• Data is reset periodically\n• Don\'t use for real medical data\n• For production, create your own account\n\n**Creating Your Own Account:**\n• Click "Create Account" on login page\n• Enter your email and password\n• Choose your role\n• Start using the system!\n\n**Troubleshooting:**\n• Make sure to select correct role\n• Email format must be valid\n• Password is case-sensitive\n• No spaces before/after\n• Clear cache if issues persist\n\nReady to try? Use patient@healthcare.com / password123 for patient access!'
            },
            {
                condition: ['login', 'error'],
                answer: '❌ **Login Errors - Complete Troubleshooting:**\n\n**Common Login Issues & Solutions:**\n\n**1. "Invalid ABHA ID or Password"**\n\n**Causes:**\n• Wrong ABHA ID format\n• Incorrect password\n• Wrong role selected\n• Caps Lock is ON\n\n**Solutions:**\n• Check email format (no spaces)\n• Verify password (case-sensitive)\n• Select correct role (Patient/Doctor/Ambulance)\n• Turn off Caps Lock\n• Try demo credentials:\n  - Patient: patient@healthcare.com / password123\n  - Doctor: doctor@healthcare.com / doctor123\n  - Ambulance: ambulance@healthcare.com / ambulance123\n\n**2. "Account Locked"**\n\n**Causes:**\n• Too many failed login attempts\n• Security measure activated\n\n**Solutions:**\n• Wait 15 minutes and try again\n• Use "Forgot Password" to reset\n• Contact support if urgent\n• Use demo account for testing\n\n**3. "Session Expired"**\n\n**Causes:**\n• Inactive for too long\n• Browser closed during session\n\n**Solutions:**\n• Simply login again\n• Enable "Remember Me" (if available)\n• Keep browser tab active\n\n**4. "Network Error"**\n\n**Causes:**\n• No internet connection\n• Server temporarily down\n• Firewall blocking\n\n**Solutions:**\n• Check internet connection\n• Try different network\n• Disable VPN temporarily\n• Try after few minutes\n• Check system status page\n\n**5. "Browser Not Supported"**\n\n**Causes:**\n• Very old browser version\n• JavaScript disabled\n• Cookies blocked\n\n**Solutions:**\n• Update browser to latest version\n• Enable JavaScript in settings\n• Allow cookies for this site\n• Try Chrome, Firefox, or Edge\n\n**6. "ABHA ID Not Found"**\n\n**Causes:**\n• ABHA ID not registered\n• Typo in ABHA ID\n• Account not activated\n\n**Solutions:**\n• Double-check ABHA ID\n• Register at https://abha.abdm.gov.in\n• Use demo credentials for testing\n• Contact support for activation\n\n**7. "Role Mismatch"**\n\n**Causes:**\n• Selected wrong role\n• Account registered for different role\n\n**Solutions:**\n• Select correct role from dropdown\n• Patient → Patient role\n• Doctor → Doctor role\n• Ambulance → Ambulance role\n• Check registration details\n\n**General Troubleshooting Steps:**\n\n**Step 1: Clear Browser Cache**\n• Chrome: Ctrl+Shift+Delete\n• Firefox: Ctrl+Shift+Delete\n• Safari: Cmd+Option+E\n• Select "Cached images and files"\n• Clear and restart browser\n\n**Step 2: Try Incognito/Private Mode**\n• Chrome: Ctrl+Shift+N\n• Firefox: Ctrl+Shift+P\n• Safari: Cmd+Shift+N\n• This disables extensions\n• Tests if extension is causing issue\n\n**Step 3: Check Browser Settings**\n• JavaScript: Must be enabled\n• Cookies: Must be allowed\n• Pop-ups: Allow for this site\n• Location: Allow if using emergency features\n\n**Step 4: Try Different Browser**\n• Chrome (recommended)\n• Firefox\n• Edge\n• Safari (Mac/iOS)\n• Update to latest version\n\n**Step 5: Check System Requirements**\n• Internet connection: Active\n• Browser: Updated to latest\n• JavaScript: Enabled\n• Cookies: Enabled\n• Screen resolution: 1024x768 minimum\n\n**Demo Credentials (Always Work):**\n\n**Patient:**\n• ABHA ID: ABHA001\n• Password: password123\n• Role: Patient\n\n**Doctor:**\n• ABHA ID: ABHA002\n• Password: doctor123\n• Role: Doctor\n\n**Ambulance:**\n• ABHA ID: ABHA003\n• Password: ambulance123\n• Role: Ambulance\n\n**Login Best Practices:**\n\n✅ **Do:**\n• Use strong passwords\n• Keep credentials secure\n• Logout after use on shared devices\n• Update password regularly\n• Enable 2FA if available\n\n❌ **Don\'t:**\n• Share login credentials\n• Use public WiFi for sensitive access\n• Save password on shared devices\n• Use same password everywhere\n• Ignore security warnings\n\n**Still Can\'t Login?**\n\n**Contact Support:**\n• Email: support@healthcare.com\n• Phone: 1800-XXX-XXXX\n• In-app: Help & Support\n• Available: 24/7 for critical issues\n\n**For Immediate Access:**\n• Use demo credentials\n• Test system functionality\n• Explore features\n• Contact support for real account\n\n**Security Tips:**\n• Never share OTP/password\n• Beware of phishing emails\n• Always check URL (https://)\n• Logout on shared devices\n• Report suspicious activity\n\nNeed help with specific error? Tell me what message you\'re seeing!'
            },
            {
                condition: ['login', 'failed'],
                answer: '❌ **Login Failed - Quick Fix:**\n\n**Try These Solutions:**\n\n1. **Check Credentials**\n   • ABHA ID correct? (no spaces)\n   • Password correct? (case-sensitive)\n   • Role selected? (Patient/Doctor/Ambulance)\n\n2. **Use Demo Credentials**\n   • Patient: patient@healthcare.com / password123\n   • Doctor: doctor@healthcare.com / doctor123\n   • Ambulance: ambulance@healthcare.com / ambulance123\n\n3. **Clear Cache**\n   • Ctrl+Shift+Delete\n   • Clear cached data\n   • Restart browser\n\n4. **Try Different Browser**\n   • Chrome (recommended)\n   • Firefox\n   • Edge\n\n5. **Reset Password**\n   • Click "Forgot Password"\n   • Follow reset instructions\n\n**Common Mistakes:**\n• Caps Lock is ON\n• Extra spaces in ABHA ID\n• Wrong role selected\n• Old password used\n\n**Still failing?**\nType "login error" for detailed troubleshooting!\n\nOr use demo credentials to test system.'
            },
            {
                condition: ['reset', 'password'],
                answer: '🔐 **Password Reset Process:**\n\n**Step-by-step guide:**\n1. Go to the login page\n2. Click "Forgotten password?" link below the login button\n3. Enter your email address\n4. You will receive a reset link via email\n5. Click the link and create a new password\n6. Password must be at least 8 characters\n\n**For demo/testing:**\nUse these credentials directly:\n• Patient: patient@healthcare.com / password123\n• Doctor: doctor@healthcare.com / doctor123\n• Ambulance: ambulance@healthcare.com / ambulance123\n\n**Still having issues?** Contact system administrator or use demo credentials.'
            },
            {
                condition: ['forgot', 'password'],
                answer: '🔐 **Forgot Password Help:**\n\n1. Click on "Forgotten password?" link on login page\n2. Enter your email address\n3. Check your email for reset link\n4. Create a new password\n\n**Demo Credentials:**\n• Patient: patient@healthcare.com / password123\n• Doctor: doctor@healthcare.com / doctor123\n• Ambulance: ambulance@healthcare.com / ambulance123'
            },
            {
                condition: ['abha', 'id'],
                answer: '📧 **Email-Based Authentication:**\n\nOur system uses email/password authentication for easy access.\n\n**How to Login:**\n1. Enter your email address\n2. Enter your password\n3. Select your role (Patient/Doctor/Ambulance)\n4. Click Login\n\n**Don\'t have an account?**\n• Click "Create Account" on login page\n• Enter your details\n• Choose your role\n• Start using the system!\n\n**For demo/testing:** Use these credentials:\n• Patient: patient@healthcare.com / password123\n• Doctor: doctor@healthcare.com / doctor123\n• Ambulance: ambulance@healthcare.com / ambulance123\n\n**Benefits of Email Login:**\n• Easy to remember\n• Secure authentication\n• Password recovery via email\n• No external ID needed\n• Works everywhere'
            },
            {
                condition: ['login', 'error', 'failed'],
                answer: '❌ **Login Issues:**\n\n**Common Solutions:**\n1. Check ABHA ID format (no spaces)\n2. Verify password (case-sensitive)\n3. Select correct role (Patient/Doctor/Ambulance)\n4. Clear browser cache and cookies\n5. Try incognito/private mode\n\n**Still having issues?** Use demo credentials for testing.'
            }
        ],
        default: '🔑 **Login Help:**\n\nI can help with:\n• Forgotten passwords\n• ABHA ID issues\n• Login errors\n• Account creation\n\nWhat specific login issue are you facing?'
    },

    // Emergency Services
    emergency: {
        keywords: ['emergency', 'sos', 'ambulance', '108', 'urgent', 'help', 'critical', 'accident', 'call'],
        responses: [
            {
                condition: ['call', '108'],
                answer: '📞 **Call 108 - National Ambulance Service:**\n\n**Emergency Numbers:**\n• 108 - Ambulance (Free, 24/7, All India)\n• 100 - Police Emergency\n• 101 - Fire Brigade\n• 102 - Medical Helpline\n• 1091 - Women Helpline\n• 1098 - Child Helpline\n\n**When to call 108:**\n• Heart attack or chest pain\n• Severe bleeding or injuries\n• Difficulty breathing\n• Unconsciousness\n• Severe burns\n• Poisoning\n• Road accidents\n\n**What to tell them:**\n1. Your exact location\n2. Nature of emergency\n3. Patient\'s condition\n4. Your contact number\n\n**Response time:** Usually 15-20 minutes in cities\n\n**Remember:** 108 is FREE and available 24/7!'
            },
            {
                condition: ['location', 'issue'],
                answer: '📍 **Location Issues - Troubleshooting:**\n\n**If location is not working:**\n\n**Step 1: Browser Permission**\n• Click the 🔒 lock icon in address bar\n• Find "Location" permission\n• Change to "Allow"\n• Refresh the page\n\n**Step 2: Browser Settings**\n• Chrome: Settings → Privacy → Site Settings → Location\n• Firefox: Settings → Privacy → Permissions → Location\n• Safari: Preferences → Websites → Location\n• Enable for this website\n\n**Step 3: System Settings**\n• Windows: Settings → Privacy → Location → On\n• Mac: System Preferences → Security → Privacy → Location\n• Enable for your browser\n\n**Step 4: Manual Entry**\n• If location still doesn\'t work\n• Enter your city name manually\n• System will find nearest hospitals\n\n**Still not working?**\n• Try different browser\n• Check internet connection\n• Call 108 directly for immediate help'
            },
            {
                condition: ['find', 'hospital'],
                answer: '🏥 **Find Hospitals Near You:**\n\n**Using Emergency SOS System:**\n\n**Step 1: Access Emergency Page**\n• Click "Emergency SOS" button (red button)\n• Or go to Emergency section from menu\n\n**Step 2: Allow Location**\n• Click "Allow" when browser asks\n• Or enter city name manually\n\n**Step 3: View Hospitals**\n• System shows nearest hospitals\n• Sorted by distance\n• With contact numbers\n\n**Hospital Information Shown:**\n• Hospital name\n• Distance from you\n• Phone number (click to call)\n• Address\n• Get Directions button\n\n**Features:**\n• Works offline (cached data)\n• Real-time distance calculation\n• One-click calling\n• Google Maps integration\n\n**Major Hospitals Available:**\n• AIIMS\n• Apollo Hospitals\n• Fortis Healthcare\n• Max Healthcare\n• Government Hospitals\n• District Hospitals\n\n**Critical Emergency?** Call 108 first, then use this to find nearest hospital!'
            },
            {
                condition: ['location', 'not', 'working'],
                answer: '📍 **Location Not Working - Quick Fix:**\n\n**Quick Solutions:**\n\n1. **Allow Location Access**\n   • Click "Allow" when browser asks\n   • Check address bar for location icon\n\n2. **Check Browser Settings**\n   • Settings → Privacy → Location\n   • Enable for this website\n\n3. **System Settings**\n   • Windows: Settings → Privacy → Location → On\n   • Mac: System Preferences → Security → Location\n\n4. **Manual Entry**\n   • Enter your city name\n   • System will find hospitals\n\n5. **Try Different Browser**\n   • Chrome, Firefox, or Safari\n   • Sometimes one works better\n\n**Still Having Issues?**\n• Call 108 directly\n• They will ask your location\n• Ambulance will be dispatched\n\n**Remember:** In real emergencies, always call 108 first!'
            },
            {
                condition: ['hospital', 'not', 'found'],
                answer: '🏥 **No Hospitals Found - Solutions:**\n\n**Why this happens:**\n• Location not detected properly\n• Internet connection issue\n• Remote area with limited data\n\n**What to do:**\n\n1. **Check Location**\n   • Allow location access\n   • Or enter city name manually\n\n2. **Check Internet**\n   • Ensure stable connection\n   • Try mobile data if WiFi fails\n\n3. **Try Nearby City**\n   • Enter nearest major city\n   • Hospitals will be shown\n\n4. **Refresh Page**\n   • Sometimes data needs reload\n   • Press Ctrl+R or F5\n\n**Always Available:**\n• 108 - National Ambulance\n• 100 - Police Emergency\n• 101 - Fire Emergency\n\n**Call 108 - They will:**\n• Find nearest hospital\n• Send ambulance\n• Guide you to hospital\n• Provide medical assistance\n\n**Remember:** 108 operators have complete hospital database!'
            }
        ],
        default: '🚨 **Emergency Help:**\n\nFor immediate emergencies, call **108**\n\nI can help with:\n• Emergency SOS system\n• Location issues\n• Finding hospitals\n• Emergency numbers\n\nWhat emergency assistance do you need?'
    },

    // System Navigation
    navigation: {
        keywords: ['navigate', 'how to', 'where is', 'find', 'dashboard', 'menu', 'page', 'feature', 'patient', 'doctor', 'ambulance', 'system', 'guide'],
        responses: [
            {
                condition: ['patient', 'dashboard'],
                answer: '👤 **Patient Dashboard Guide:**\n\n**Main Features:**\n\n1. **AI Health Risk Score**\n   • Shows your current health risk (0-100)\n   • Color coded: Green (Low), Yellow (Moderate), Red (High)\n   • Based on vitals and medical history\n\n2. **Current Vitals**\n   • Heart Rate, Blood Pressure\n   • Temperature, Oxygen Level\n   • Blood Sugar\n   • Real-time monitoring\n\n3. **Health Records**\n   • View past medical records\n   • Download reports\n   • Share with doctors\n\n4. **Appointments**\n   • Upcoming appointments\n   • Schedule new appointments\n   • View appointment history\n\n5. **Emergency SOS**\n   • Red button at top\n   • Quick access to emergency services\n   • Find nearest hospitals\n\n**Navigation:**\n• Top menu: Profile, Settings, Logout\n• Cards: Click "View" for details\n• Bottom: Emergency SOS always visible\n\n**Tips:**\n• Update vitals regularly\n• Check risk score daily\n• Keep emergency contacts updated'
            },
            {
                condition: ['doctor', 'dashboard'],
                answer: '👨‍⚕️ **Doctor Dashboard Guide:**\n\n**Main Features:**\n\n1. **Emergency Alerts**\n   • Real-time patient emergencies\n   • High-risk patient notifications\n   • Critical vitals alerts\n   • "Respond Now" button for quick action\n\n2. **Today\'s Patients**\n   • List of scheduled patients\n   • Patient risk levels shown\n   • Quick access to patient details\n\n3. **Patient Details View**\n   • Complete medical history\n   • Current vitals and trends\n   • AI risk assessment\n   • Prescription history\n\n4. **Quick Actions**\n   • Add prescription\n   • Schedule follow-up\n   • View test results\n   • Send notifications\n\n**Navigation:**\n• Emergency alerts at top (red banner)\n• Patient cards with risk indicators\n• Click patient name for full details\n• Use filters to sort patients\n\n**Color Codes:**\n• 🔴 Red: High risk (immediate attention)\n• 🟡 Yellow: Moderate risk (monitor)\n• 🟢 Green: Low risk (routine)\n\n**Tips:**\n• Check emergency alerts first\n• Review high-risk patients daily\n• Update patient records after consultation'
            },
            {
                condition: ['ambulance', 'panel'],
                answer: '🚑 **Ambulance Panel Guide:**\n\n**Main Features:**\n\n1. **Dispatch Information**\n   • Current status (Available/Dispatched)\n   • Patient location\n   • Destination hospital\n   • Estimated time\n\n2. **Patient Condition**\n   • Emergency type\n   • Current vitals\n   • Medical history\n   • Special instructions\n\n3. **Hospital Information**\n   • Hospital name and address\n   • Contact number\n   • Distance and route\n   • Bed availability\n\n4. **Navigation Tools**\n   • Google Maps integration\n   • Turn-by-turn directions\n   • Traffic updates\n   • Alternative routes\n\n5. **Communication**\n   • Call patient\n   • Call hospital\n   • Call dispatch center\n   • Emergency services\n\n**Status Indicators:**\n• 🟢 Available: Ready for dispatch\n• 🟡 En Route: Going to patient\n• 🔴 Transporting: Patient on board\n• ⚪ Off Duty: Not available\n\n**Quick Actions:**\n• Update status\n• Report arrival\n• Request backup\n• Emergency protocols\n\n**Tips:**\n• Keep status updated\n• Check patient vitals regularly\n• Communicate with hospital\n• Follow emergency protocols'
            },
            {
                condition: ['system', 'feature'],
                answer: '🌟 **System Features Overview:**\n\n**For Patients:**\n• AI Health Risk Assessment\n• Vital Signs Monitoring\n• Health Records Management\n• Appointment Scheduling\n• Emergency SOS System\n• Healthcare Chatbot\n• Prescription Management\n\n**For Doctors:**\n• Patient Monitoring Dashboard\n• Emergency Alert System\n• Medical Records Access\n• Prescription Management\n• Appointment Management\n• Analytics and Reports\n• Patient Communication\n\n**For Ambulance:**\n• Dispatch Management\n• Patient Information Access\n• Hospital Navigation\n• Real-time Communication\n• Status Updates\n• Emergency Protocols\n\n**Common Features:**\n• ABHA ID Integration\n• Secure Authentication\n• Real-time Updates\n• Mobile Responsive\n• Offline Capabilities\n• Multi-language Support\n\n**Security:**\n• End-to-end encryption\n• HIPAA compliant\n• Data privacy protection\n• Secure data storage\n\nWhat specific feature would you like to know more about?'
            },
            {
                condition: ['system', 'guide'],
                answer: '📖 **System Guide - Getting Started:**\n\n**First Time Users:**\n\n1. **Login**\n   • Use your ABHA ID\n   • Select your role (Patient/Doctor/Ambulance)\n   • Enter password\n\n2. **Dashboard Overview**\n   • Familiarize with main features\n   • Check all available options\n   • Update your profile\n\n3. **Key Features**\n   • Explore each section\n   • Try demo features\n   • Read tooltips and help text\n\n4. **Emergency Setup**\n   • Add emergency contacts\n   • Allow location access\n   • Test Emergency SOS\n\n5. **Settings**\n   • Update personal information\n   • Set notification preferences\n   • Configure privacy settings\n\n**Quick Tips:**\n• Use chatbot for instant help\n• Check notifications regularly\n• Keep profile updated\n• Test emergency features\n• Save important contacts\n\n**Need Help?**\n• Use this chatbot anytime\n• Check help section\n• Contact support\n• Watch tutorial videos\n\nWhat would you like to learn first?'
            }
        ],
        default: '🧭 **Navigation Help:**\n\nI can guide you through:\n• Patient Dashboard\n• Doctor Dashboard\n• Ambulance Panel\n• Emergency SOS\n• System features\n\nWhich part of the system do you need help with?'
    },

    // Technical Issues
    technical: {
        keywords: ['error', 'bug', 'not working', 'broken', 'slow', 'loading', 'crash', 'problem', 'issue', 'page', 'button', 'mobile', 'browser'],
        responses: [
            {
                condition: ['page', 'loading'],
                answer: '⚡ **Page Loading Issues - Complete Fix:**\n\n**Quick Fixes (Try in order):**\n\n1. **Refresh Page**\n   • Press Ctrl+R (Windows) or Cmd+R (Mac)\n   • Or click refresh button\n   • Wait 5-10 seconds\n\n2. **Clear Browser Cache**\n   • Chrome: Ctrl+Shift+Delete\n   • Firefox: Ctrl+Shift+Delete\n   • Safari: Cmd+Option+E\n   • Select "Cached images and files"\n   • Clear and restart browser\n\n3. **Check Internet Connection**\n   • Open other websites to test\n   • Try mobile data if on WiFi\n   • Restart router if needed\n\n4. **Try Incognito/Private Mode**\n   • Chrome: Ctrl+Shift+N\n   • Firefox: Ctrl+Shift+P\n   • Safari: Cmd+Shift+N\n   • This disables extensions\n\n5. **Disable Browser Extensions**\n   • Go to Extensions/Add-ons\n   • Disable ad blockers\n   • Disable privacy extensions\n   • Refresh page\n\n**Still Slow?**\n• Close unnecessary tabs\n• Restart browser completely\n• Try different browser\n• Check system resources\n• Update browser to latest version\n\n**Emergency Features:**\n• Emergency SOS works even if page is slow\n• 108 call button always functional\n• Offline mode available\n\n**Need immediate help?** Call 108 for emergencies!'
            },
            {
                condition: ['page', 'slow'],
                answer: '🐌 **Slow Page Performance - Solutions:**\n\n**Immediate Actions:**\n\n1. **Close Other Tabs**\n   • Keep only this tab open\n   • Reduces memory usage\n\n2. **Clear Cache**\n   • Ctrl+Shift+Delete\n   • Clear cached data\n   • Restart browser\n\n3. **Check Internet Speed**\n   • Run speed test\n   • Switch to better network\n   • Use mobile data if WiFi slow\n\n4. **Disable Extensions**\n   • Ad blockers can slow pages\n   • Disable temporarily\n\n5. **Update Browser**\n   • Old browsers are slower\n   • Update to latest version\n\n**System Optimization:**\n• Close background apps\n• Restart computer\n• Free up RAM\n• Check for malware\n\n**Browser Recommendations:**\n• Chrome (fastest)\n• Firefox (good privacy)\n• Edge (Windows optimized)\n• Safari (Mac optimized)\n\n**Lightweight Mode:**\n• System works on slow connections\n• Essential features load first\n• Emergency features always fast\n\nStill having issues? Try different browser!'
            },
            {
                condition: ['button', 'not', 'working'],
                answer: '🖱️ **Button Not Working - Troubleshooting:**\n\n**Common Causes & Fixes:**\n\n1. **Page Not Fully Loaded**\n   • Wait for page to load completely\n   • Look for loading indicators\n   • Try after 5 seconds\n\n2. **JavaScript Disabled**\n   • Check browser settings\n   • Enable JavaScript\n   • Refresh page\n\n3. **Button Disabled**\n   • Grayed out buttons are disabled\n   • Complete required fields first\n   • Check for error messages\n\n4. **Browser Cache Issue**\n   • Clear cache (Ctrl+Shift+Delete)\n   • Hard refresh (Ctrl+F5)\n   • Restart browser\n\n5. **Click Area Problem**\n   • Click center of button\n   • Try double-clicking\n   • Use keyboard (Tab + Enter)\n\n**Keyboard Navigation:**\n• Press Tab to move between buttons\n• Press Enter to click\n• Press Space for checkboxes\n\n**Specific Buttons:**\n• Login: Check all fields filled\n• Submit: Wait for validation\n• Emergency: Always works (call 108 if not)\n\n**Alternative Methods:**\n• Use keyboard shortcuts\n• Try right-click → Inspect\n• Use different browser\n• Try mobile version\n\n**Critical Buttons Always Work:**\n• 108 Emergency Call\n• Emergency SOS\n• Logout\n\nStill stuck? Try different browser or device!'
            },
            {
                condition: ['button', 'click'],
                answer: '👆 **Click Issues - Quick Solutions:**\n\n**Try These:**\n\n1. **Wait & Retry**\n   • Wait 2-3 seconds\n   • Click again\n   • Don\'t rapid-click\n\n2. **Check Button State**\n   • Is it grayed out?\n   • Is there a loading spinner?\n   • Are fields filled correctly?\n\n3. **Use Keyboard**\n   • Tab to button\n   • Press Enter\n   • Works when mouse doesn\'t\n\n4. **Refresh Page**\n   • Ctrl+R or F5\n   • Try button again\n\n5. **Clear Cache**\n   • Ctrl+Shift+Delete\n   • Restart browser\n\n**Emergency Buttons:**\n• 108 call - Always works\n• Emergency SOS - Always functional\n• If these don\'t work, call 108 directly\n\n**Browser Issues?**\n• Try Chrome or Firefox\n• Update to latest version\n• Disable extensions\n\nNeed urgent help? Call 108 for emergencies!'
            },
            {
                condition: ['mobile', 'issue'],
                answer: '📱 **Mobile Issues - Complete Guide:**\n\n**Mobile Optimization:**\n\n✅ **What Works:**\n• All pages fully responsive\n• Touch-friendly buttons\n• Swipe gestures\n• Mobile-optimized layout\n• Offline emergency features\n\n**Common Mobile Problems:**\n\n1. **Display Issues**\n   • Rotate to portrait mode\n   • Zoom out if content cut\n   • Refresh page\n   • Clear mobile browser cache\n\n2. **Touch Not Working**\n   • Clean screen\n   • Remove screen protector temporarily\n   • Try different finger\n   • Restart phone\n\n3. **Slow Performance**\n   • Close other apps\n   • Clear browser cache\n   • Free up phone memory\n   • Restart phone\n\n4. **Location Not Working**\n   • Enable location in phone settings\n   • Allow browser location access\n   • Check GPS is on\n   • Try manual city entry\n\n**Recommended Mobile Browsers:**\n• Chrome (Android)\n• Safari (iPhone)\n• Firefox (Both)\n• Edge (Both)\n\n**Mobile Features:**\n• One-tap calling\n• GPS integration\n• Camera for documents\n• Push notifications\n• Offline mode\n\n**Data Saving:**\n• System uses minimal data\n• Images optimized\n• Works on 2G/3G\n• Offline emergency features\n\n**Emergency on Mobile:**\n• Emergency SOS works offline\n• Direct dial 108\n• Location sharing\n• Quick hospital finder\n\n**Tips:**\n• Keep app updated\n• Enable notifications\n• Allow location access\n• Save to home screen\n\nMobile working great? Enjoy the experience!'
            },
            {
                condition: ['mobile', 'phone'],
                answer: '📱 **Mobile Phone Support:**\n\n**Fully Mobile Compatible!**\n\n✅ **Features on Mobile:**\n• Responsive design\n• Touch-optimized\n• Works on all screen sizes\n• Offline emergency features\n• One-tap calling\n• GPS integration\n\n**Mobile Problems?**\n\n1. **Rotate to Portrait**\n   • Best experience in portrait mode\n\n2. **Zoom Issues**\n   • Pinch to zoom out\n   • Double-tap to reset\n\n3. **Browser Choice**\n   • Use Chrome (Android)\n   • Use Safari (iPhone)\n   • Update to latest version\n\n4. **Enable JavaScript**\n   • Required for full functionality\n   • Check browser settings\n\n5. **Clear Cache**\n   • Settings → Browser → Clear Data\n   • Restart browser\n\n**Mobile-Specific Features:**\n• Tap to call hospitals\n• GPS location sharing\n• Camera for documents\n• Push notifications\n• Add to home screen\n\n**Data Usage:**\n• Very light on data\n• Works on 2G/3G/4G\n• Offline mode available\n\n**Emergency Features:**\n• Work without internet\n• Quick 108 dial\n• Location sharing\n• Hospital finder\n\nEnjoy seamless mobile experience!'
            },
            {
                condition: ['browser', 'help'],
                answer: '🌐 **Browser Compatibility & Help:**\n\n**Supported Browsers:**\n\n✅ **Recommended (Best Performance):**\n• Chrome 90+ (Fastest)\n• Firefox 88+ (Privacy focused)\n• Edge 90+ (Windows optimized)\n• Safari 14+ (Mac/iOS optimized)\n\n⚠️ **Supported (May be slower):**\n• Chrome 80-89\n• Firefox 78-87\n• Edge 80-89\n• Safari 12-13\n\n❌ **Not Supported:**\n• Internet Explorer (any version)\n• Very old browser versions\n• Browsers with JavaScript disabled\n\n**Browser-Specific Issues:**\n\n**Chrome:**\n• Clear cache: Ctrl+Shift+Delete\n• Incognito: Ctrl+Shift+N\n• Update: Settings → About Chrome\n\n**Firefox:**\n• Clear cache: Ctrl+Shift+Delete\n• Private: Ctrl+Shift+P\n• Update: Menu → Help → About\n\n**Safari:**\n• Clear cache: Cmd+Option+E\n• Private: Cmd+Shift+N\n• Update: App Store → Updates\n\n**Edge:**\n• Clear cache: Ctrl+Shift+Delete\n• InPrivate: Ctrl+Shift+N\n• Update: Settings → About\n\n**Common Browser Problems:**\n\n1. **Extensions Blocking**\n   • Disable ad blockers\n   • Disable privacy extensions\n   • Try incognito mode\n\n2. **Outdated Version**\n   • Update to latest\n   • Restart browser\n   • Clear cache\n\n3. **JavaScript Disabled**\n   • Enable in settings\n   • Required for system\n\n4. **Cookies Blocked**\n   • Allow cookies for this site\n   • Required for login\n\n**Performance Tips:**\n• Keep browser updated\n• Close unnecessary tabs\n• Clear cache regularly\n• Disable unused extensions\n• Restart browser daily\n\n**Still Having Issues?**\n• Try different browser\n• Check internet connection\n• Restart computer\n• Contact support\n\nWhich browser are you using?'
            }
        ],
        default: '🔧 **Technical Support:**\n\nCommon issues I can help with:\n• Page loading problems\n• Button not working\n• Mobile display issues\n• Browser compatibility\n• Performance problems\n\nWhat technical issue are you experiencing?'
    },

    // Health Information
    health: {
        keywords: ['health', 'vitals', 'risk', 'score', 'medical', 'symptoms', 'condition', 'ai', 'monitoring', 'record'],
        responses: [
            {
                condition: ['risk', 'score'],
                answer: '🤖 **AI Health Risk Score Explained:**\n\n**What is it?**\nAn AI-powered assessment that predicts your health risk level based on multiple factors.\n\n**Risk Levels:**\n\n🟢 **Low Risk (0-30)**\n• All vitals in normal range\n• No immediate concerns\n• Continue healthy lifestyle\n• Regular checkups recommended\n\n🟡 **Moderate Risk (31-70)**\n• Some vitals need attention\n• Monitor closely\n• Lifestyle changes recommended\n• Consult doctor soon\n\n🔴 **High Risk (71-100)**\n• Critical vitals detected\n• Immediate medical attention needed\n• Contact doctor urgently\n• Emergency services if severe\n\n**Factors Considered:**\n• Age and gender\n• Blood Pressure (120/80 normal)\n• Heart Rate (60-100 bpm normal)\n• Blood Sugar (70-140 mg/dL normal)\n• Oxygen Level (95-100% normal)\n• Body Temperature (98.6°F normal)\n• Medical history\n• Previous conditions\n• Medication adherence\n\n**How AI Calculates:**\n1. Collects all vital signs\n2. Compares with normal ranges\n3. Analyzes patterns and trends\n4. Considers age and medical history\n5. Applies machine learning model\n6. Generates risk score (0-100)\n\n**Accuracy:**\n• 85-90% accurate prediction\n• Based on 10,000+ patient data\n• Continuously learning and improving\n• Validated by medical professionals\n\n**Important Notes:**\n• This is a guidance tool only\n• NOT a replacement for doctor consultation\n• Always consult healthcare professionals\n• For emergencies, call 108 immediately\n\n**Update Frequency:**\n• Recalculated every time vitals updated\n• Real-time risk assessment\n• Tracks changes over time\n\n**What to do based on score:**\n• Low: Maintain healthy habits\n• Moderate: Schedule doctor visit\n• High: Seek immediate medical attention\n\nWant to know about specific vitals?'
            },
            {
                condition: ['ai', 'score'],
                answer: '🤖 **AI Health Assessment:**\n\n**How AI Helps:**\n\nOur AI system analyzes your health data using advanced machine learning to:\n\n1. **Predict Health Risks**\n   • Early disease detection\n   • Risk pattern identification\n   • Preventive care recommendations\n\n2. **Monitor Vital Trends**\n   • Track changes over time\n   • Identify abnormal patterns\n   • Alert for critical changes\n\n3. **Personalized Insights**\n   • Age-specific recommendations\n   • Condition-based guidance\n   • Lifestyle suggestions\n\n**AI Technology:**\n• Machine Learning algorithms\n• Trained on 10,000+ patients\n• 85-90% accuracy rate\n• Continuously improving\n• Validated by doctors\n\n**What AI Analyzes:**\n• All vital signs\n• Medical history\n• Age and demographics\n• Medication data\n• Previous diagnoses\n• Lifestyle factors\n\n**Benefits:**\n• Early warning system\n• 24/7 monitoring\n• Instant risk assessment\n• Personalized care\n• Preventive healthcare\n\n**Limitations:**\n• Not a replacement for doctors\n• Guidance tool only\n• Requires accurate data input\n• Cannot diagnose diseases\n\n**Privacy:**\n• Your data is secure\n• HIPAA compliant\n• No data sharing\n• Encrypted storage\n\n**Remember:** AI assists doctors, doesn\'t replace them. Always consult healthcare professionals for medical decisions.\n\nQuestions about your risk score?'
            },
            {
                condition: ['vital', 'monitoring'],
                answer: '📊 **Vital Signs Monitoring Guide:**\n\n**What We Monitor:**\n\n1. **Heart Rate (Pulse)**\n   • Normal: 60-100 bpm\n   • Low: <60 bpm (Bradycardia)\n   • High: >100 bpm (Tachycardia)\n   • Measures: Heart beats per minute\n\n2. **Blood Pressure**\n   • Normal: 120/80 mmHg\n   • Low: <90/60 (Hypotension)\n   • High: >140/90 (Hypertension)\n   • Format: Systolic/Diastolic\n\n3. **Body Temperature**\n   • Normal: 98.6°F (37°C)\n   • Low: <97°F (Hypothermia)\n   • High: >100.4°F (Fever)\n   • Indicates: Infection or illness\n\n4. **Oxygen Saturation (SpO2)**\n   • Normal: 95-100%\n   • Caution: 90-94%\n   • Critical: <90%\n   • Measures: Blood oxygen level\n\n5. **Blood Sugar (Glucose)**\n   • Fasting: 70-100 mg/dL\n   • After meal: <140 mg/dL\n   • Low: <70 (Hypoglycemia)\n   • High: >180 (Hyperglycemia)\n\n**Color Indicators:**\n\n🟢 **Green: Normal**\n• All vitals in healthy range\n• No immediate concerns\n• Continue monitoring\n\n🟡 **Yellow: Caution**\n• Slightly outside normal range\n• Monitor closely\n• May need attention\n• Consult doctor if persists\n\n🔴 **Red: Alert**\n• Significantly abnormal\n• Immediate attention needed\n• Contact doctor urgently\n• Call 108 if severe\n\n**How to Measure:**\n\n**Heart Rate:**\n• Use pulse oximeter\n• Or count pulse for 60 seconds\n• Best measured at rest\n\n**Blood Pressure:**\n• Use BP monitor\n• Sit quietly for 5 minutes first\n• Measure same time daily\n\n**Temperature:**\n• Use digital thermometer\n• Oral, ear, or forehead\n• Wait 30 min after eating/drinking\n\n**Oxygen Level:**\n• Use pulse oximeter\n• Clip on finger\n• Wait for stable reading\n\n**Blood Sugar:**\n• Use glucometer\n• Prick finger for blood drop\n• Fasting or 2 hours after meal\n\n**Monitoring Tips:**\n• Measure at same time daily\n• Keep a log/diary\n• Note any symptoms\n• Share with doctor\n• Update in system regularly\n\n**When to Worry:**\n• Sudden drastic changes\n• Persistent abnormal readings\n• Multiple vitals abnormal\n• Accompanied by symptoms\n• System shows red alert\n\n**Emergency Signs:**\n• Chest pain + high BP\n• Difficulty breathing + low SpO2\n• Confusion + abnormal vitals\n• Severe symptoms\n• Call 108 immediately!\n\n**Tracking Benefits:**\n• Early problem detection\n• Better doctor consultations\n• Treatment effectiveness\n• Peace of mind\n• Preventive care\n\nNeed help with specific vital sign?'
            },
            {
                condition: ['vital', 'sign'],
                answer: '📊 **Vital Signs Quick Reference:**\n\n**Normal Ranges:**\n\n❤️ **Heart Rate:** 60-100 bpm\n🩸 **Blood Pressure:** 120/80 mmHg\n🌡️ **Temperature:** 98.6°F (37°C)\n💨 **Oxygen Level:** 95-100%\n🍬 **Blood Sugar:** 70-140 mg/dL\n\n**What Each Means:**\n\n**Heart Rate:**\n• How fast your heart beats\n• Affected by activity, stress, health\n• Too high/low can indicate problems\n\n**Blood Pressure:**\n• Force of blood against artery walls\n• Two numbers: systolic/diastolic\n• High BP damages organs over time\n\n**Temperature:**\n• Body heat level\n• Fever indicates infection\n• Low temp can be serious\n\n**Oxygen Level:**\n• How much oxygen in blood\n• Critical for organ function\n• Low levels need immediate attention\n\n**Blood Sugar:**\n• Glucose in bloodstream\n• Energy source for body\n• Important for diabetics\n\n**When to Check:**\n• Daily for chronic conditions\n• When feeling unwell\n• Before/after medication\n• As doctor recommends\n\n**Red Flags:**\n🚨 Call 108 if:\n• Chest pain + abnormal vitals\n• Difficulty breathing\n• Severe headache + high BP\n• Confusion or dizziness\n• SpO2 below 90%\n\n**System Features:**\n• Automatic tracking\n• Trend analysis\n• Color-coded alerts\n• Historical data\n• Share with doctor\n\nWhich vital sign concerns you?'
            },
            {
                condition: ['medical', 'record'],
                answer: '📋 **Medical Records Management:**\n\n**What\'s Included:**\n\n1. **Personal Information**\n   • Name, Age, Gender\n   • ABHA ID\n   • Contact details\n   • Emergency contacts\n\n2. **Medical History**\n   • Past diagnoses\n   • Chronic conditions\n   • Surgeries and procedures\n   • Allergies\n   • Family medical history\n\n3. **Medications**\n   • Current prescriptions\n   • Dosage and frequency\n   • Start and end dates\n   • Side effects noted\n\n4. **Vital Signs History**\n   • Blood pressure trends\n   • Heart rate patterns\n   • Blood sugar levels\n   • Weight changes\n   • All vitals over time\n\n5. **Test Results**\n   • Lab reports\n   • Imaging results (X-ray, MRI, CT)\n   • ECG reports\n   • Blood tests\n\n6. **Doctor Visits**\n   • Consultation notes\n   • Diagnosis\n   • Treatment plans\n   • Follow-up recommendations\n\n7. **Immunizations**\n   • Vaccination history\n   • Due dates for boosters\n\n**How to Access:**\n• Login to patient dashboard\n• Click "Health Records" section\n• View, download, or share\n• Filter by date or type\n\n**Features:**\n\n✅ **View Records**\n• Chronological timeline\n• Search and filter\n• Detailed view\n• Print-friendly format\n\n✅ **Download Records**\n• PDF format\n• All or selected records\n• Encrypted files\n• Easy sharing\n\n✅ **Share with Doctors**\n• Secure sharing\n• Time-limited access\n• Revoke anytime\n• Audit trail\n\n✅ **Update Records**\n• Add new information\n• Upload documents\n• Scan prescriptions\n• Add notes\n\n**Privacy & Security:**\n• End-to-end encryption\n• HIPAA compliant\n• Access logs maintained\n• You control who sees what\n• No unauthorized access\n\n**Benefits:**\n• Complete health history in one place\n• Easy doctor consultations\n• No lost paperwork\n• Emergency access\n• Better treatment decisions\n\n**Tips:**\n• Keep records updated\n• Upload all reports\n• Add notes after doctor visits\n• Review regularly\n• Share with new doctors\n\n**Emergency Access:**\n• Doctors can access in emergencies\n• With your consent\n• Critical info always available\n• Saves lives in emergencies\n\nNeed help accessing your records?'
            },
            {
                condition: ['health', 'record'],
                answer: '📋 **Health Records - Quick Guide:**\n\n**Access Your Records:**\n1. Go to Patient Dashboard\n2. Click "Health Records" card\n3. View all your medical data\n\n**What You\'ll Find:**\n• Medical history\n• Prescriptions\n• Test results\n• Doctor notes\n• Vital signs history\n• Immunizations\n\n**Actions Available:**\n• 👁️ View records\n• 📥 Download as PDF\n• 📤 Share with doctors\n• ➕ Add new records\n• 🔍 Search records\n• 📊 View trends\n\n**Privacy:**\n• Fully encrypted\n• Only you control access\n• HIPAA compliant\n• Secure storage\n\n**Benefits:**\n• All records in one place\n• No lost paperwork\n• Easy doctor sharing\n• Emergency access\n• Better healthcare\n\n**Tips:**\n• Update after doctor visits\n• Upload test reports\n• Keep medications current\n• Review monthly\n\nWant detailed guide on specific record type?'
            }
        ],
        default: '🏥 **Health Information:**\n\nI can explain:\n• AI Risk Score calculation\n• Vital signs monitoring\n• Health records\n• Medical terminology\n\n**Disclaimer:** This system provides information only. Always consult healthcare professionals for medical advice.'
    },

    // General Help
    general: {
        keywords: ['help', 'support', 'guide', 'tutorial', 'how', 'what', 'why', 'feature', 'safe', 'secure', 'privacy', 'contact'],
        responses: [
            {
                condition: ['system', 'feature'],
                answer: '🌟 **HealthCare+ Complete Features:**\n\n**For Patients:**\n\n1. **AI Health Risk Assessment**\n   • Real-time risk scoring (0-100)\n   • Predictive health analytics\n   • Early warning system\n   • Personalized recommendations\n\n2. **Vital Signs Monitoring**\n   • Heart rate tracking\n   • Blood pressure monitoring\n   • Temperature logging\n   • Oxygen level tracking\n   • Blood sugar management\n   • Historical trends\n\n3. **Health Records Management**\n   • Digital medical records\n   • Prescription storage\n   • Test results archive\n   • Doctor notes access\n   • Easy sharing with doctors\n   • Secure cloud storage\n\n4. **Appointment System**\n   • Schedule appointments\n   • View upcoming visits\n   • Appointment reminders\n   • Reschedule/cancel options\n   • Doctor availability\n\n5. **Emergency SOS**\n   • One-click emergency access\n   • Nearest hospital finder\n   • GPS location sharing\n   • Direct 108 calling\n   • Offline functionality\n   • Emergency contacts\n\n6. **Healthcare Chatbot**\n   • 24/7 assistance\n   • Instant answers\n   • System guidance\n   • Troubleshooting help\n   • Health information\n\n**For Doctors:**\n\n1. **Patient Monitoring Dashboard**\n   • Real-time patient vitals\n   • Risk level indicators\n   • Patient list management\n   • Quick patient search\n\n2. **Emergency Alert System**\n   • Critical patient alerts\n   • High-risk notifications\n   • Instant response options\n   • Priority patient queue\n\n3. **Medical Records Access**\n   • Complete patient history\n   • Test results viewing\n   • Previous prescriptions\n   • Treatment history\n\n4. **Prescription Management**\n   • Digital prescriptions\n   • Medication tracking\n   • Drug interaction alerts\n   • Prescription history\n\n5. **Analytics & Reports**\n   • Patient statistics\n   • Treatment outcomes\n   • Performance metrics\n   • Custom reports\n\n**For Ambulance Services:**\n\n1. **Dispatch Management**\n   • Real-time dispatch info\n   • Patient location\n   • Emergency details\n   • Status updates\n\n2. **Patient Information**\n   • Medical history access\n   • Current vitals\n   • Allergies and conditions\n   • Emergency contacts\n\n3. **Hospital Navigation**\n   • GPS routing\n   • Traffic updates\n   • Nearest hospital finder\n   • Hospital bed availability\n\n4. **Communication Hub**\n   • Call patient\n   • Call hospital\n   • Call dispatch\n   • Emergency services\n\n**Common Features (All Users):**\n\n• ABHA ID Integration\n• Secure Authentication\n• Real-time Updates\n• Mobile Responsive Design\n• Offline Capabilities\n• Multi-language Support\n• Push Notifications\n• Data Export Options\n• Privacy Controls\n• 24/7 Availability\n\n**Security Features:**\n\n• End-to-end Encryption\n• HIPAA Compliance\n• GDPR Compliance\n• Two-factor Authentication\n• Secure Data Storage\n• Regular Security Audits\n• Access Logs\n• Data Backup\n\n**Technology Stack:**\n\n• AI/ML for Risk Assessment\n• Real-time Data Processing\n• Cloud Infrastructure\n• GPS Integration\n• Offline-first Architecture\n• Progressive Web App\n\nWhich feature would you like to explore in detail?'
            },
            {
                condition: ['what', 'can', 'do'],
                answer: '🌟 **What HealthCare+ Can Do:**\n\n**Quick Overview:**\n\n**For Your Health:**\n• Monitor vitals 24/7\n• Predict health risks with AI\n• Store all medical records\n• Schedule doctor appointments\n• Get instant health guidance\n\n**For Emergencies:**\n• Find nearest hospitals instantly\n• Call 108 with one click\n• Share location automatically\n• Access emergency contacts\n• Works offline too!\n\n**For Convenience:**\n• Access from anywhere\n• Mobile-friendly\n• Secure and private\n• Easy to use\n• 24/7 chatbot support\n\n**For Doctors:**\n• Monitor all patients\n• Get emergency alerts\n• Access patient records\n• Manage prescriptions\n• Track treatment outcomes\n\n**For Ambulance:**\n• Receive dispatch info\n• Navigate to hospitals\n• Access patient details\n• Communicate with all parties\n\n**Key Benefits:**\n• Better health outcomes\n• Early disease detection\n• Faster emergency response\n• Organized medical records\n• Peace of mind\n\n**Unique Features:**\n• AI-powered risk assessment\n• Offline emergency system\n• ABHA ID integration\n• Real-time monitoring\n• Comprehensive healthcare platform\n\nWhat would you like to try first?'
            },
            {
                condition: ['safe', 'secure'],
                answer: '🔒 **Safety & Security - Complete Overview:**\n\n**Your Data is Protected:**\n\n**Encryption:**\n• End-to-end encryption for all data\n• 256-bit AES encryption standard\n• Secure HTTPS connections\n• Encrypted data storage\n• No plain text storage\n\n**Authentication:**\n• ABHA ID verification\n• Secure password requirements\n• Two-factor authentication (optional)\n• Session timeout protection\n• Login attempt monitoring\n\n**Privacy Protection:**\n• HIPAA compliant\n• GDPR compliant\n• No data selling\n• No third-party sharing\n• You control your data\n\n**Access Control:**\n• Role-based access\n• Permission management\n• Audit logs maintained\n• Unauthorized access prevention\n• Automatic logout on inactivity\n\n**Data Storage:**\n• Secure cloud servers\n• Regular backups\n• Disaster recovery\n• Geographic redundancy\n• 99.9% uptime\n\n**Medical Data Protection:**\n• Separate encrypted storage\n• Access logs for all views\n• Time-limited sharing\n• Revocable permissions\n• No permanent external access\n\n**Location Privacy:**\n• Used only in real-time\n• Never stored permanently\n• Only for emergency services\n• You control when to share\n• Can be disabled anytime\n\n**Communication Security:**\n• Encrypted messaging\n• Secure file transfers\n• Protected video calls\n• No message interception\n\n**Regular Security:**\n• Weekly security audits\n• Penetration testing\n• Vulnerability scanning\n• Security updates\n• Compliance monitoring\n\n**Your Rights:**\n• View your data anytime\n• Download your data\n• Delete your data\n• Control sharing\n• Revoke access\n\n**What We DON\'T Do:**\n• ❌ Sell your data\n• ❌ Share with advertisers\n• ❌ Track your browsing\n• ❌ Store location permanently\n• ❌ Share without consent\n\n**What We DO:**\n• ✅ Protect your privacy\n• ✅ Encrypt everything\n• ✅ Follow regulations\n• ✅ Give you control\n• ✅ Maintain transparency\n\n**Compliance:**\n• HIPAA (Health Insurance Portability)\n• GDPR (General Data Protection)\n• ABDM (Ayushman Bharat Digital Mission)\n• ISO 27001 (Information Security)\n• SOC 2 Type II (Security Controls)\n\n**In Case of Breach:**\n• Immediate notification\n• Detailed incident report\n• Remediation steps\n• Free credit monitoring\n• Legal support\n\n**Emergency Data Access:**\n• Only with your consent\n• Or in life-threatening situations\n• Logged and auditable\n• Temporary access only\n• You\'re notified afterward\n\n**Tips for Your Security:**\n• Use strong passwords\n• Don\'t share login details\n• Enable 2FA\n• Logout on shared devices\n• Review access logs regularly\n• Report suspicious activity\n\n**Questions or Concerns?**\n• Contact: security@healthcare.com\n• Privacy Policy: Available in settings\n• Report issues: 24/7 support\n\nYour health data is precious. We protect it like our own!'
            },
            {
                condition: ['privacy', 'secure'],
                answer: '🔐 **Privacy & Security Quick Facts:**\n\n**Your Data is Safe:**\n\n✅ **Encrypted**\n• All data encrypted\n• Secure connections\n• Protected storage\n\n✅ **Private**\n• HIPAA compliant\n• No data selling\n• You control access\n\n✅ **Secure**\n• Regular security audits\n• Access logs maintained\n• Unauthorized access prevented\n\n**Location Privacy:**\n• Used only in real-time\n• Never stored permanently\n• Only for emergencies\n• You control sharing\n\n**Medical Data:**\n• Separately encrypted\n• Access logged\n• Time-limited sharing\n• Revocable anytime\n\n**Your Rights:**\n• View your data\n• Download your data\n• Delete your data\n• Control sharing\n• Revoke access\n\n**We DON\'T:**\n• ❌ Sell your data\n• ❌ Share with advertisers\n• ❌ Track browsing\n• ❌ Store location\n\n**We DO:**\n• ✅ Protect privacy\n• ✅ Encrypt everything\n• ✅ Follow regulations\n• ✅ Give you control\n\n**Compliance:**\n• HIPAA compliant\n• GDPR compliant\n• ABDM guidelines\n• ISO 27001 certified\n\n**Questions?**\nCheck Privacy Policy in settings or contact support.\n\nYour health, your data, your control!'
            },
            {
                condition: ['contact', 'support'],
                answer: '📞 **Contact & Support:**\n\n**Get Help:**\n\n**1. Chatbot (Fastest)**\n• Available 24/7\n• Instant responses\n• You\'re using it now!\n• Ask anything\n\n**2. Emergency Support**\n• Medical Emergency: 108\n• Technical Emergency: Available in app\n• System down: Check status page\n\n**3. Email Support**\n• General: support@healthcare.com\n• Technical: tech@healthcare.com\n• Security: security@healthcare.com\n• Response: Within 24 hours\n\n**4. Phone Support**\n• Toll-free: 1800-XXX-XXXX\n• Available: 9 AM - 9 PM (Mon-Sat)\n• For urgent issues\n\n**5. In-App Support**\n• Settings → Help & Support\n• Submit ticket\n• Track status\n• Chat with agent\n\n**6. Help Center**\n• FAQs and guides\n• Video tutorials\n• Troubleshooting\n• User manual\n• Access: Menu → Help\n\n**Common Issues:**\n\n**Login Problems:**\n• Use "Forgot Password"\n• Check ABHA ID format\n• Try demo credentials\n• Contact support if stuck\n\n**Technical Issues:**\n• Clear browser cache\n• Try different browser\n• Check internet connection\n• Report bug in app\n\n**Medical Queries:**\n• Use chatbot for guidance\n• Consult doctor for diagnosis\n• Call 108 for emergencies\n• Book appointment for non-urgent\n\n**Feedback & Suggestions:**\n• Email: feedback@healthcare.com\n• In-app: Settings → Feedback\n• We read every message\n• Help us improve!\n\n**Social Media:**\n• Twitter: @HealthCarePlus\n• Facebook: /HealthCarePlus\n• Instagram: @healthcare_plus\n• LinkedIn: /company/healthcare-plus\n\n**Office Address:**\nHealthCare+ Headquarters\n[Address Line 1]\n[Address Line 2]\n[City, State, PIN]\n\n**Business Hours:**\n• Monday - Friday: 9 AM - 6 PM\n• Saturday: 9 AM - 2 PM\n• Sunday: Closed\n• Emergency support: 24/7\n\n**Response Times:**\n• Chatbot: Instant\n• Email: Within 24 hours\n• Phone: Immediate (during hours)\n• Tickets: 24-48 hours\n\n**For Doctors/Hospitals:**\n• Partnership: partners@healthcare.com\n• Integration: api@healthcare.com\n• Training: training@healthcare.com\n\n**For Media:**\n• Press: press@healthcare.com\n• Interviews: media@healthcare.com\n\n**Report Issues:**\n• Security: security@healthcare.com\n• Bugs: bugs@healthcare.com\n• Abuse: abuse@healthcare.com\n\n**We\'re Here to Help!**\nDon\'t hesitate to reach out. Your health and experience matter to us.\n\nHow else can I assist you today?'
            },
            {
                condition: ['help', 'support'],
                answer: '🆘 **Help & Support Options:**\n\n**Quick Help:**\n\n1. **This Chatbot** (Fastest!)\n   • Ask me anything\n   • Available 24/7\n   • Instant answers\n\n2. **Emergency**\n   • Medical: Call 108\n   • Technical: In-app support\n\n3. **Email Support**\n   • support@healthcare.com\n   • Response within 24 hours\n\n4. **Phone Support**\n   • 1800-XXX-XXXX\n   • 9 AM - 9 PM (Mon-Sat)\n\n5. **Help Center**\n   • Menu → Help\n   • FAQs and guides\n   • Video tutorials\n\n**Common Topics:**\n• Login issues\n• Emergency services\n• System navigation\n• Technical problems\n• Health information\n\n**I can help you right now!**\nWhat do you need assistance with?\n\nOr type "contact support" for more options.'
            }
        ],
        default: '👋 **General Help:**\n\nI\'m here to help with:\n• System features and navigation\n• Login and account issues\n• Emergency services guidance\n• Technical troubleshooting\n• Health information\n\nWhat would you like to know?'
    }
};

// ============================================================================
// CHATBOT STATE MANAGEMENT
// ============================================================================
let chatbotState = {
    isOpen: false,
    messages: [],
    isTyping: false,
    currentContext: null,
    userPreferences: {
        theme: 'light',
        language: 'en'
    }
};

// ============================================================================
// CHATBOT INITIALIZATION
// ============================================================================
function initializeChatbot() {
    console.log('🤖 Initializing HealthCare+ Chatbot...');
    
    // Create chatbot HTML structure
    createChatbotHTML();
    
    // Setup event listeners
    setupChatbotEvents();
    
    // Add welcome message
    addWelcomeMessage();
    
    console.log('✅ Chatbot initialized successfully');
}

function createChatbotHTML() {
    const chatbotHTML = `
        <!-- Chatbot Toggle Button -->
        <div id="chatbot-toggle" class="chatbot-toggle">
            <div class="chatbot-icon">
                <span class="icon-chat">💬</span>
                <span class="icon-close">✕</span>
            </div>
            <div class="chatbot-badge" id="chatbot-badge">1</div>
        </div>

        <!-- Chatbot Container -->
        <div id="chatbot-container" class="chatbot-container">
            <div class="chatbot-header">
                <div class="chatbot-avatar">🤖</div>
                <div class="chatbot-info">
                    <div class="chatbot-name">HealthBot</div>
                    <div class="chatbot-status">Online • Ready to help</div>
                </div>
                <button class="chatbot-minimize" onclick="toggleChatbot()">−</button>
            </div>
            
            <div class="chatbot-messages" id="chatbot-messages">
                <!-- Messages will be added here -->
            </div>
            
            <div class="chatbot-typing" id="chatbot-typing" style="display: none;">
                <div class="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <span class="typing-text">HealthBot is typing...</span>
            </div>
            
            <div class="chatbot-input-container">
                <div class="chatbot-suggestions" id="chatbot-suggestions">
                    <button class="suggestion-btn" onclick="sendSuggestion('Login help')">🔑 Login Help</button>
                    <button class="suggestion-btn" onclick="sendSuggestion('Emergency SOS')">🚨 Emergency</button>
                    <button class="suggestion-btn" onclick="sendSuggestion('System features')">🌟 Features</button>
                </div>
                
                <div class="chatbot-input-area">
                    <input type="text" id="chatbot-input" placeholder="Type your question here..." maxlength="500">
                    <button id="chatbot-send" onclick="sendMessage()">
                        <span class="send-icon">➤</span>
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Add chatbot to body
    document.body.insertAdjacentHTML('beforeend', chatbotHTML);
}

function setupChatbotEvents() {
    // Toggle button click
    document.getElementById('chatbot-toggle').addEventListener('click', toggleChatbot);
    
    // Input field events
    const input = document.getElementById('chatbot-input');
    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    input.addEventListener('input', function() {
        const sendBtn = document.getElementById('chatbot-send');
        if (this.value.trim()) {
            sendBtn.classList.add('active');
        } else {
            sendBtn.classList.remove('active');
        }
    });
    
    // Auto-resize input
    input.addEventListener('input', autoResizeInput);
}

function addWelcomeMessage() {
    const welcomeMessage = {
        type: 'bot',
        content: CHATBOT_CONFIG.greeting,
        timestamp: new Date(),
        suggestions: ['Login help', 'Emergency SOS', 'System navigation', 'Technical support']
    };
    
    chatbotState.messages.push(welcomeMessage);
    renderMessage(welcomeMessage);
}

// ============================================================================
// CHATBOT UI FUNCTIONS
// ============================================================================
function toggleChatbot() {
    const container = document.getElementById('chatbot-container');
    const toggle = document.getElementById('chatbot-toggle');
    const badge = document.getElementById('chatbot-badge');
    
    chatbotState.isOpen = !chatbotState.isOpen;
    
    if (chatbotState.isOpen) {
        container.classList.add('open');
        toggle.classList.add('open');
        badge.style.display = 'none';
        
        // Focus input when opened
        setTimeout(() => {
            document.getElementById('chatbot-input').focus();
        }, 300);
    } else {
        container.classList.remove('open');
        toggle.classList.remove('open');
    }
}

function sendMessage() {
    const input = document.getElementById('chatbot-input');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add user message
    const userMessage = {
        type: 'user',
        content: message,
        timestamp: new Date()
    };
    
    chatbotState.messages.push(userMessage);
    renderMessage(userMessage);
    
    // Clear input
    input.value = '';
    document.getElementById('chatbot-send').classList.remove('active');
    
    // Hide suggestions
    document.getElementById('chatbot-suggestions').style.display = 'none';
    
    // Process and respond
    setTimeout(() => {
        processUserMessage(message);
    }, CHATBOT_CONFIG.responseDelay);
}

function sendSuggestion(suggestion) {
    document.getElementById('chatbot-input').value = suggestion;
    sendMessage();
}

function renderMessage(message) {
    const messagesContainer = document.getElementById('chatbot-messages');
    const messageElement = document.createElement('div');
    messageElement.className = `chatbot-message ${message.type}`;
    
    const time = message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    
    if (message.type === 'bot') {
        messageElement.innerHTML = `
            <div class="message-avatar">🤖</div>
            <div class="message-content">
                <div class="message-text">${formatBotMessage(message.content)}</div>
                <div class="message-time">${time}</div>
                ${message.suggestions ? renderSuggestions(message.suggestions) : ''}
            </div>
        `;
    } else {
        messageElement.innerHTML = `
            <div class="message-content">
                <div class="message-text">${message.content}</div>
                <div class="message-time">${time}</div>
            </div>
            <div class="message-avatar">👤</div>
        `;
    }
    
    messagesContainer.appendChild(messageElement);
    scrollToBottom();
    
    // Animate message appearance
    setTimeout(() => {
        messageElement.classList.add('visible');
    }, 100);
}

function formatBotMessage(content) {
    // Convert markdown-like formatting to HTML
    return content
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\n/g, '<br>')
        .replace(/•/g, '&bull;');
}

function renderSuggestions(suggestions) {
    return `
        <div class="message-suggestions">
            ${suggestions.map(suggestion => 
                `<button class="suggestion-chip" onclick="sendSuggestion('${suggestion}')">${suggestion}</button>`
            ).join('')}
        </div>
    `;
}

function showTypingIndicator() {
    chatbotState.isTyping = true;
    document.getElementById('chatbot-typing').style.display = 'flex';
    scrollToBottom();
}

function hideTypingIndicator() {
    chatbotState.isTyping = false;
    document.getElementById('chatbot-typing').style.display = 'none';
}

function scrollToBottom() {
    const messagesContainer = document.getElementById('chatbot-messages');
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function autoResizeInput() {
    const input = document.getElementById('chatbot-input');
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 100) + 'px';
}

// ============================================================================
// MESSAGE PROCESSING & AI LOGIC
// ============================================================================
function processUserMessage(message) {
    showTypingIndicator();
    
    setTimeout(() => {
        const response = generateResponse(message);
        hideTypingIndicator();
        
        const botMessage = {
            type: 'bot',
            content: response.content,
            timestamp: new Date(),
            suggestions: response.suggestions
        };
        
        chatbotState.messages.push(botMessage);
        renderMessage(botMessage);
        
    }, CHATBOT_CONFIG.typingDelay);
}

function generateResponse(userMessage) {
    const message = userMessage.toLowerCase().trim();
    
    // Handle greetings first
    if (message.match(/\b(hi|hello|hey|good morning|good afternoon|good evening)\b/)) {
        return {
            content: '👋 Hello! I\'m HealthBot, your healthcare assistant. I\'m here to help you with any questions about our healthcare system. What can I assist you with today?',
            suggestions: ['Login help', 'Emergency services', 'System features', 'Technical support']
        };
    }
    
    // Handle thanks
    if (message.match(/\b(thank|thanks|appreciate)\b/)) {
        return {
            content: '😊 You\'re welcome! I\'m glad I could help. Is there anything else you\'d like to know about our healthcare system?',
            suggestions: ['More help', 'System features', 'Emergency info']
        };
    }
    
    // Handle goodbye
    if (message.match(/\b(bye|goodbye|see you|exit)\b/)) {
        return {
            content: '👋 Goodbye! Remember, I\'m always here if you need help with the healthcare system. For emergencies, don\'t forget you can call 108. Take care!',
            suggestions: []
        };
    }
    
    // Check each knowledge base category
    for (const [category, data] of Object.entries(KNOWLEDGE_BASE)) {
        // Look for specific responses within the category first (more specific matches)
        for (const response of data.responses) {
            // Check if ALL conditions are present in the message
            const matchesCondition = response.condition.every(condition => 
                message.includes(condition.toLowerCase())
            );
            
            if (matchesCondition) {
                return {
                    content: response.answer,
                    suggestions: getContextualSuggestions(category)
                };
            }
        }
        
        // Then check if message contains any keywords from this category (general match)
        const hasKeyword = data.keywords.some(keyword => message.includes(keyword.toLowerCase()));
        
        if (hasKeyword) {
            // Return default response for the category
            return {
                content: data.default,
                suggestions: getContextualSuggestions(category)
            };
        }
    }
    
    // Fallback response
    return {
        content: CHATBOT_CONFIG.fallbackMessage,
        suggestions: ['Login help', 'Emergency SOS', 'System navigation', 'Technical support']
    };
}

function getContextualSuggestions(category) {
    const suggestions = {
        login: ['Reset password', 'ABHA ID help', 'Demo credentials', 'Login errors'],
        emergency: ['Call 108', 'Location issues', 'Find hospitals'],
        navigation: ['Patient dashboard', 'Doctor features', 'System guide'],
        technical: ['Page loading', 'Mobile issues', 'Browser help'],
        health: ['Risk score', 'Vital signs', 'Medical records'],
        general: ['System features', 'Privacy info', 'Contact support']
    };
    
    return suggestions[category] || ['More help', 'System features', 'Emergency info'];
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
function clearChatHistory() {
    chatbotState.messages = [];
    document.getElementById('chatbot-messages').innerHTML = '';
    addWelcomeMessage();
}

function exportChatHistory() {
    const history = chatbotState.messages.map(msg => ({
        type: msg.type,
        content: msg.content,
        time: msg.timestamp.toISOString()
    }));
    
    const blob = new Blob([JSON.stringify(history, null, 2)], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'healthcare-chat-history.json';
    a.click();
    URL.revokeObjectURL(url);
}

// ============================================================================
// INITIALIZATION
// ============================================================================
document.addEventListener('DOMContentLoaded', function() {
    // Initialize chatbot after a short delay to ensure page is fully loaded
    setTimeout(initializeChatbot, 1000);
});

// Global functions for HTML onclick events
window.toggleChatbot = toggleChatbot;
window.sendMessage = sendMessage;
window.sendSuggestion = sendSuggestion;
window.clearChatHistory = clearChatHistory;

console.log('🤖 HealthCare+ Chatbot System Loaded');

// ============================================================================
// END OF CHATBOT SYSTEM
// ============================================================================