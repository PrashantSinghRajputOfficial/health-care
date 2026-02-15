# Smart Health Records & Emergency Response Management System

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
✅ ABHA-based login (mock implementation)
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
1. Patient ABHA login → Dashboard
2. Health vitals input → AI prediction
3. Risk score display → Recommendations

### Emergency Flow:
1. SOS button press / Auto-detection
2. Emergency alert → Doctor dashboard
3. Ambulance dispatch → Location tracking
4. Medical summary → Quick decision support

## 🚀 Quick Start

```bash
# Install dependencies
pip install -r requirements.txt

# Run the application
python app.py

# Access at http://localhost:5000
```

## 👥 User Roles
- **Patient**: View records, SOS button
- **Doctor**: Emergency dashboard, patient history
- **Admin**: System management

## 🔒 Security
- Role-based access control
- Data encryption (mock)
- ABHA authentication (demo)

## 🏆 Hackathon Pitch
"Humara system AI use karke health risks ko predict karta hai aur emergency mein life-saving decisions fast banata hai. ABHA integration se India-ready solution hai!"
