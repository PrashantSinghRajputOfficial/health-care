from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import sqlite3
import hashlib
import secrets
from datetime import datetime
import os
import json
from ai_model import HealthRiskPredictor, EmergencyDetector

app = Flask(__name__, template_folder='templates', static_folder='static')
# Fix CORS to allow all origins for development
CORS(app, resources={r"/*": {"origins": "*"}})

# Initialize AI model
predictor = HealthRiskPredictor()
emergency_detector = EmergencyDetector()

# Database setup
DATABASE = 'health_system.db'

def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Initialize database with tables"""
    # Create database directory if it doesn't exist
    db_dir = os.path.dirname(DATABASE)
    if db_dir and not os.path.exists(db_dir):
        os.makedirs(db_dir)
    
    conn = get_db()
    cursor = conn.cursor()
    
    # Users table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            name TEXT NOT NULL,
            role TEXT NOT NULL,
            phone TEXT,
            password_hash TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Health records table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS health_records (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            age INTEGER,
            bp_systolic INTEGER,
            bp_diastolic INTEGER,
            blood_sugar REAL,
            heart_rate INTEGER,
            spo2 INTEGER,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    
    # Predictions table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS predictions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            record_id INTEGER NOT NULL,
            risk_level TEXT NOT NULL,
            risk_score REAL NOT NULL,
            recommendations TEXT,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id),
            FOREIGN KEY (record_id) REFERENCES health_records (id)
        )
    ''')
    
    # Emergencies table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS emergencies (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            emergency_type TEXT NOT NULL,
            status TEXT DEFAULT 'ACTIVE',
            location TEXT,
            doctor_id INTEGER,
            ambulance_id INTEGER,
            vitals_summary TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            resolved_at TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    
    # Create demo users with email/password
    demo_users = [
        ('patient@healthcare.com', 'Rahul Kumar', 'patient', '9876543210', 'password123'),
        ('doctor@healthcare.com', 'Dr. Priya Sharma', 'doctor', '9876543211', 'doctor123'),
        ('ambulance@healthcare.com', 'Ambulance Service', 'ambulance', '9876543212', 'ambulance123')
    ]
    
    for email, name, role, phone, password in demo_users:
        password_hash = hashlib.sha256(password.encode()).hexdigest()
        try:
            cursor.execute('''
                INSERT INTO users (email, name, role, phone, password_hash)
                VALUES (?, ?, ?, ?, ?)
            ''', (email, name, role, phone, password_hash))
        except sqlite3.IntegrityError:
            pass  # User already exists
    
    conn.commit()
    conn.close()

# Routes
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/login')
@app.route('/login.html')
def login_page():
    return render_template('login.html')

@app.route('/signup')
@app.route('/signup.html')
def signup_page():
    return render_template('signup.html')

@app.route('/patient-dashboard')
@app.route('/patient-dashboard.html')
def patient_dashboard_page():
    return render_template('patient-dashboard.html')

@app.route('/doctor-dashboard')
@app.route('/doctor-dashboard.html')
def doctor_dashboard_page():
    return render_template('doctor-dashboard.html')

@app.route('/ambulance-panel')
@app.route('/ambulance-panel.html')
def ambulance_panel_page():
    return render_template('ambulance-panel.html')

@app.route('/emergency-sos')
@app.route('/emergency-sos.html')
def emergency_sos_page():
    return render_template('emergency-sos.html')

@app.route('/api/auth/login', methods=['POST'])
def login():
    """Email/Password based login"""
    try:
        data = request.json
        email = data.get('email')
        password = data.get('password')
        role = data.get('role')
        
        if not email or not password:
            return jsonify({'error': 'Email and password required'}), 400
        
        password_hash = hashlib.sha256(password.encode()).hexdigest()
        
        conn = get_db()
        
        # Check if role is provided, if yes, verify role matches
        if role:
            user = conn.execute(
                'SELECT * FROM users WHERE email = ? AND password_hash = ? AND role = ?',
                (email, password_hash, role)
            ).fetchone()
        else:
            user = conn.execute(
                'SELECT * FROM users WHERE email = ? AND password_hash = ?',
                (email, password_hash)
            ).fetchone()
        
        conn.close()
        
        if user:
            # Generate session token (simplified)
            token = secrets.token_hex(16)
            return jsonify({
                'success': True,
                'token': token,
                'user': {
                    'id': user['id'],
                    'name': user['name'],
                    'role': user['role'],
                    'email': user['email']
                }
            })
        else:
            return jsonify({'error': 'Invalid email, password, or role'}), 401
    except Exception as e:
        return jsonify({'error': f'Login error: {str(e)}'}), 500

@app.route('/api/auth/register', methods=['POST'])
def register():
    """Register new user with email/password"""
    try:
        data = request.json
        email = data.get('email')
        password = data.get('password')
        name = data.get('name')
        role = data.get('role', 'patient')
        phone = data.get('phone', '')
        
        # Validation
        if not email or not password or not name:
            return jsonify({'error': 'Email, password, and name are required'}), 400
        
        if len(password) < 8:
            return jsonify({'error': 'Password must be at least 8 characters'}), 400
        
        if role not in ['patient', 'doctor', 'ambulance']:
            return jsonify({'error': 'Invalid role'}), 400
        
        # Hash password
        password_hash = hashlib.sha256(password.encode()).hexdigest()
        
        conn = get_db()
        cursor = conn.cursor()
        
        try:
            cursor.execute('''
                INSERT INTO users (email, name, role, phone, password_hash)
                VALUES (?, ?, ?, ?, ?)
            ''', (email, name, role, phone, password_hash))
            
            user_id = cursor.lastrowid
            conn.commit()
            
            # Generate session token
            token = secrets.token_hex(16)
            
            return jsonify({
                'success': True,
                'message': 'Registration successful!',
                'token': token,
                'user': {
                    'id': user_id,
                    'name': name,
                    'role': role,
                    'email': email
                }
            })
        except sqlite3.IntegrityError:
            return jsonify({'error': 'Email already registered'}), 409
        finally:
            conn.close()
            
    except Exception as e:
        return jsonify({'error': f'Registration error: {str(e)}'}), 500

@app.route('/api/patient/dashboard/<int:user_id>', methods=['GET'])
def patient_dashboard(user_id):
    """Get patient dashboard data"""
    conn = get_db()
    
    # Get user info
    user = conn.execute('SELECT * FROM users WHERE id = ?', (user_id,)).fetchone()
    
    # Get recent health records
    records = conn.execute('''
        SELECT * FROM health_records 
        WHERE user_id = ? 
        ORDER BY timestamp DESC 
        LIMIT 10
    ''', (user_id,)).fetchall()
    
    # Get recent predictions
    predictions = conn.execute('''
        SELECT * FROM predictions 
        WHERE user_id = ? 
        ORDER BY timestamp DESC 
        LIMIT 5
    ''', (user_id,)).fetchall()
    
    conn.close()
    
    return jsonify({
        'user': dict(user) if user else None,
        'records': [dict(r) for r in records],
        'predictions': [dict(p) for p in predictions]
    })

@app.route('/api/health/predict', methods=['POST'])
def predict_health_risk():
    """AI-powered health risk prediction"""
    try:
        data = request.json
        user_id = data.get('user_id')
        
        # Extract vitals
        vitals = {
            'age': data.get('age'),
            'bp_systolic': data.get('bp_systolic'),
            'bp_diastolic': data.get('bp_diastolic'),
            'blood_sugar': data.get('blood_sugar'),
            'heart_rate': data.get('heart_rate'),
            'spo2': data.get('spo2')
        }
        
        # Validate inputs
        if None in vitals.values() or user_id is None:
            return jsonify({'error': 'All vitals and user_id are required'}), 400
        
        # Validate ranges
        if not (0 < vitals['age'] < 150):
            return jsonify({'error': 'Invalid age'}), 400
        if not (50 < vitals['bp_systolic'] < 250):
            return jsonify({'error': 'Invalid systolic BP'}), 400
        if not (30 < vitals['bp_diastolic'] < 150):
            return jsonify({'error': 'Invalid diastolic BP'}), 400
        if not (20 < vitals['blood_sugar'] < 500):
            return jsonify({'error': 'Invalid blood sugar'}), 400
        if not (30 < vitals['heart_rate'] < 200):
            return jsonify({'error': 'Invalid heart rate'}), 400
        if not (70 < vitals['spo2'] <= 100):
            return jsonify({'error': 'Invalid SpO2'}), 400
        
        # Save health record
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO health_records (user_id, age, bp_systolic, bp_diastolic, 
                                       blood_sugar, heart_rate, spo2)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (user_id, vitals['age'], vitals['bp_systolic'], vitals['bp_diastolic'],
              vitals['blood_sugar'], vitals['heart_rate'], vitals['spo2']))
        
        record_id = cursor.lastrowid
        
        # AI Prediction
        risk_level, risk_score, recommendations = predictor.predict(vitals)
        
        # Save prediction
        cursor.execute('''
            INSERT INTO predictions (user_id, record_id, risk_level, risk_score, recommendations)
            VALUES (?, ?, ?, ?, ?)
        ''', (user_id, record_id, risk_level, risk_score, recommendations))
        
        conn.commit()
        
        # Check for emergency
        is_emergency, emergency_type = emergency_detector.detect(vitals, risk_score)
        
        if is_emergency:
            # Create emergency record
            cursor.execute('''
                INSERT INTO emergencies (user_id, emergency_type, vitals_summary)
                VALUES (?, ?, ?)
            ''', (user_id, emergency_type, str(vitals)))
            conn.commit()
        
        conn.close()
        
        return jsonify({
            'success': True,
            'risk_level': risk_level,
            'risk_score': round(risk_score, 2),
            'recommendations': recommendations,
            'is_emergency': is_emergency,
            'emergency_type': emergency_type if is_emergency else None
        })
    except Exception as e:
        return jsonify({'error': f'Prediction error: {str(e)}'}), 500

@app.route('/api/emergency/sos', methods=['POST'])
def trigger_sos():
    """Emergency SOS button"""
    try:
        data = request.json
        user_id = data.get('user_id')
        location = data.get('location', 'Unknown')
        
        if not user_id:
            return jsonify({'error': 'User ID required'}), 400
        
        conn = get_db()
        cursor = conn.cursor()
        
        # Get latest vitals
        latest_record = conn.execute('''
            SELECT * FROM health_records 
            WHERE user_id = ? 
            ORDER BY timestamp DESC 
            LIMIT 1
        ''', (user_id,)).fetchone()
        
        vitals_summary = dict(latest_record) if latest_record else {}
        
        # Create emergency
        cursor.execute('''
            INSERT INTO emergencies (user_id, emergency_type, status, location, vitals_summary)
            VALUES (?, ?, ?, ?, ?)
        ''', (user_id, 'SOS_MANUAL', 'ACTIVE', location, str(vitals_summary)))
        
        emergency_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        return jsonify({
            'success': True,
            'message': 'Emergency alert sent! Ambulance is being dispatched.',
            'emergency_id': emergency_id
        })
    except Exception as e:
        return jsonify({'error': f'SOS error: {str(e)}'}), 500

@app.route('/api/doctor/emergencies', methods=['GET'])
def get_emergencies():
    """Get all active emergencies for doctor dashboard"""
    conn = get_db()
    
    emergencies = conn.execute('''
        SELECT e.*, u.name, u.phone, u.abha_id
        FROM emergencies e
        JOIN users u ON e.user_id = u.id
        WHERE e.status = 'ACTIVE'
        ORDER BY e.created_at DESC
    ''').fetchall()
    
    conn.close()
    
    return jsonify({
        'emergencies': [dict(e) for e in emergencies]
    })

@app.route('/api/ambulance/dispatch', methods=['POST'])
def dispatch_ambulance():
    """Dispatch ambulance for emergency"""
    data = request.json
    emergency_id = data.get('emergency_id')
    
    conn = get_db()
    cursor = conn.cursor()
    
    # Update emergency with ambulance info
    cursor.execute('''
        UPDATE emergencies 
        SET ambulance_id = ?, status = ?
        WHERE id = ?
    ''', (1, 'DISPATCHED', emergency_id))  # Mock ambulance ID
    
    conn.commit()
    conn.close()
    
    return jsonify({
        'success': True,
        'message': 'Ambulance dispatched successfully!',
        'eta': '10-15 minutes'
    })

if __name__ == '__main__':
    try:
        print("🏥 Smart Health System starting...")
        print("📊 Initializing database...")
        init_db()
        print("✅ Database initialized")
        print("🤖 Loading AI model...")
        # Test model initialization
        test_predictor = HealthRiskPredictor()
        print("✅ AI model loaded")
        print("🚀 Server running on http://localhost:5000")
        print("\n" + "="*50)
        print("Demo Credentials (Email/Password):")
        print("  Patient:   patient@healthcare.com / password123")
        print("  Doctor:    doctor@healthcare.com / doctor123")
        print("  Ambulance: ambulance@healthcare.com / ambulance123")
        print("="*50 + "\n")
        app.run(debug=True, port=5000, host='0.0.0.0')
    except Exception as e:
        print(f"❌ Error starting server: {e}")
        import traceback
        traceback.print_exc()
