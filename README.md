# Smart Health Records & Emergency Response Management System

<div align="center">

## 🚀 [LIVE DEMO - Click Here to Access Application](https://prashantsinghrajput.github.io/health-care/templates/index.html)

### 🏥 Advanced Healthcare Platform with AI-Powered Risk Assessment

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Access%20Now-brightgreen?style=for-the-badge&logo=github)](https://prashantsinghrajput.github.io/health-care/templates/index.html)
[![Python](https://img.shields.io/badge/Python-3.8+-blue?style=for-the-badge&logo=python)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-2.0+-black?style=for-the-badge&logo=flask)](https://flask.palletsprojects.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth-orange?style=for-the-badge&logo=firebase)](https://firebase.google.com/)

</div>

---

## 🏥 Project Overview (Hinglish)

Ye ek complete healthcare system hai jo 3 main problems solve karta hai:
1. **Health Risk Prediction** - AI se patient ki health risk predict karta hai
2. **Emergency Detection** - Critical conditions ko automatically detect karta hai
3. **Smart Ambulance Dispatch** - Emergency mein fastest response

## 🎯 Theme: Healthcare & MedTech

## 🚀 Tech Stack
- **Frontend**: HTML, CSS, JavaScript (React optional)
- **Backend**: Python Flask
- **Database**: SQLite
- **AI/ML**: Scikit-learn, Pandas

## 📋 Features
✅ Email-based secure login
✅ Patient health dashboard
✅ AI health risk prediction (Low/Medium/High)
✅ Emergency detection logic
✅ SOS button with emergency workflow
✅ Doctor dashboard with emergency summary
✅ Ambulance dispatch system
✅ Role-based access control

## 🏗️ System Architecture

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   Patient   │────────▶│  Flask API   │────────▶│   SQLite    │
│  Frontend   │         │   Backend    │         │  Database   │
└─────────────┘         └──────────────┘         └─────────────┘
                               │
                               ▼
                        ┌──────────────┐
                        │   AI Model   │
                        │  (Sklearn)   │
                        └──────────────┘
                               │
                               ▼
                        ┌──────────────┐
                        │  Emergency   │
                        │   System     │
                        └──────────────┘
```

## 📊 Workflow

### Normal Flow:
1. Patient email login → Dashboard
2. Health vitals input → AI prediction
3. Risk score display → Recommendations

### Emergency Flow:
1. SOS button press / Auto-detection
2. Emergency alert → Doctor dashboard
3. Ambulance dispatch → Location tracking
4. Medical summary → Quick decision support

## 🚀 Quick Start

### Option 1: GitHub Pages (Live Demo)
**Direct Link:** [https://prashantsinghrajput.github.io/health-care/templates/index.html](https://prashantsinghrajput.github.io/health-care/templates/index.html)

### Option 2: Local Development
```bash
# Install dependencies
pip install -r requirements.txt

# Run the Flask application
python app.py

# Access at http://localhost:5000
```

### Demo Credentials:
- **Patient**: patient@healthcare.com / password123
- **Doctor**: doctor@healthcare.com / doctor123
- **Ambulance**: ambulance@healthcare.com / ambulance123

## 👥 User Roles
- **Patient**: View records, SOS button
- **Doctor**: Emergency dashboard, patient history
- **Admin**: System management

## 🔒 Security
- Role-based access control
- Data encryption
- Firebase authentication

## 🏆 Hackathon Pitch
"Humara system AI use karke health risks ko predict karta hai aur emergency mein life-saving decisions fast banata hai. Firebase authentication se secure aur India-ready solution hai!"
