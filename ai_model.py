"""
AI/ML Model for Health Risk Prediction
Simple aur explainable model for hackathon
"""

import numpy as np
from sklearn.ensemble import RandomForestClassifier
import joblib
import os

class HealthRiskPredictor:
    """Health risk prediction using AI"""
    
    def __init__(self):
        self.model = None
        self.load_or_train_model()
    
    def load_or_train_model(self):
        """Load existing model or train new one"""
        model_path = 'health_risk_model.pkl'
        
        try:
            if os.path.exists(model_path):
                self.model = joblib.load(model_path)
                print("✅ Loaded existing model from", model_path)
            else:
                print("📚 Training new model...")
                self.train_model()
                joblib.dump(self.model, model_path)
                print("✅ Model trained and saved to", model_path)
        except Exception as e:
            print(f"⚠️ Model load error: {e}. Training new model...")
            self.train_model()
            try:
                joblib.dump(self.model, model_path)
            except Exception as save_error:
                print(f"⚠️ Could not save model: {save_error}")
    
    def train_model(self):
        """Train model with synthetic data (for demo)"""
        # Enhanced synthetic training data
        # Features: age, bp_systolic, bp_diastolic, blood_sugar, heart_rate, spo2
        
        # LOW RISK - Healthy vitals
        low_risk = [
            [25, 120, 80, 90, 72, 98],
            [30, 125, 82, 95, 75, 97],
            [28, 118, 78, 88, 70, 99],
            [35, 130, 85, 100, 78, 97],
            [32, 122, 81, 92, 73, 98],
            [27, 119, 79, 89, 71, 98],
            [33, 124, 83, 94, 76, 97],
            [29, 121, 80, 91, 74, 98],
        ]
        
        # MEDIUM RISK - Some elevated vitals
        medium_risk = [
            [45, 140, 90, 120, 80, 96],
            [50, 145, 92, 130, 85, 95],
            [55, 150, 95, 150, 88, 94],
            [48, 142, 91, 125, 82, 95],
            [52, 148, 93, 135, 86, 94],
            [47, 141, 90, 122, 81, 96],
            [53, 147, 94, 140, 87, 95],
            [49, 143, 91, 128, 83, 95],
        ]
        
        # HIGH RISK - Critical vitals
        high_risk = [
            [60, 160, 100, 180, 95, 93],
            [65, 170, 105, 200, 100, 91],
            [70, 180, 110, 250, 110, 89],
            [62, 165, 102, 190, 98, 92],
            [68, 175, 108, 220, 105, 90],
            [63, 162, 101, 185, 96, 92],
            [67, 172, 106, 210, 102, 91],
            [64, 168, 103, 195, 99, 91],
        ]
        
        # Combine all data
        X_train = np.array(low_risk + medium_risk + high_risk)
        y_train = np.array([0]*len(low_risk) + [1]*len(medium_risk) + [2]*len(high_risk))
        
        # Train Random Forest with optimized parameters
        self.model = RandomForestClassifier(
            n_estimators=100,      # 100 decision trees
            max_depth=10,          # Prevent overfitting
            min_samples_split=2,   # Minimum samples to split node
            random_state=42        # Reproducibility
        )
        self.model.fit(X_train, y_train)
        
        # Print training info (for demo)
        print(f"✅ Model trained with {len(X_train)} samples")
        print(f"   - Low Risk: {len(low_risk)} samples")
        print(f"   - Medium Risk: {len(medium_risk)} samples")
        print(f"   - High Risk: {len(high_risk)} samples")
    
    def normalize_vitals(self, vitals):
        """Normalize vitals for prediction"""
        return np.array([[
            vitals['age'],
            vitals['bp_systolic'],
            vitals['bp_diastolic'],
            vitals['blood_sugar'],
            vitals['heart_rate'],
            vitals['spo2']
        ]])
    
    def predict(self, vitals):
        """
        Predict health risk
        Returns: (risk_level, risk_score, recommendations)
        """
        try:
            # Normalize input
            X = self.normalize_vitals(vitals)
            
            # Get prediction
            prediction = self.model.predict(X)[0]
            probabilities = self.model.predict_proba(X)[0]
            
            # Map to risk level
            risk_levels = ['Low', 'Medium', 'High']
            risk_level = risk_levels[prediction]
            risk_score = probabilities[prediction]
            
            # Generate recommendations
            recommendations = self.generate_recommendations(vitals, risk_level)
            
            return risk_level, risk_score, recommendations
        except Exception as e:
            print(f"❌ Prediction error: {e}")
            # Fallback to rule-based prediction
            return self.fallback_prediction(vitals)
    
    def generate_recommendations(self, vitals, risk_level):
        """Generate personalized recommendations"""
        recommendations = []
        
        # BP check
        if vitals['bp_systolic'] > 140 or vitals['bp_diastolic'] > 90:
            recommendations.append("BP high hai - namak kam khao aur doctor se consult karo")
        
        # Blood sugar check
        if vitals['blood_sugar'] > 140:
            recommendations.append("Blood sugar high hai - meetha kam karo")
        elif vitals['blood_sugar'] < 70:
            recommendations.append("Blood sugar low hai - kuch meetha khao")
        
        # Heart rate check
        if vitals['heart_rate'] > 100:
            recommendations.append("Heart rate fast hai - rest karo aur stress kam karo")
        elif vitals['heart_rate'] < 60:
            recommendations.append("Heart rate slow hai - doctor se check karao")
        
        # SpO2 check
        if vitals['spo2'] < 95:
            recommendations.append("Oxygen level low hai - deep breathing karo")
        
        # Risk-based recommendations
        if risk_level == 'High':
            recommendations.append("⚠️ HIGH RISK - Turant doctor se milna zaroori hai!")
        elif risk_level == 'Medium':
            recommendations.append("⚡ MEDIUM RISK - Regular checkup karao")
        else:
            recommendations.append("✅ LOW RISK - Healthy lifestyle maintain karo")
        
        return " | ".join(recommendations)


    def fallback_prediction(self, vitals):
        """Rule-based fallback if ML model fails"""
        risk_score = 0
        risk_factors = 0
        
        # Check each vital
        if vitals['bp_systolic'] > 140 or vitals['bp_diastolic'] > 90:
            risk_factors += 1
        if vitals['blood_sugar'] > 140 or vitals['blood_sugar'] < 70:
            risk_factors += 1
        if vitals['heart_rate'] > 100 or vitals['heart_rate'] < 60:
            risk_factors += 1
        if vitals['spo2'] < 95:
            risk_factors += 1
        if vitals['age'] > 60:
            risk_factors += 1
        
        # Determine risk level
        if risk_factors >= 3:
            risk_level = 'High'
            risk_score = 0.8
        elif risk_factors >= 1:
            risk_level = 'Medium'
            risk_score = 0.5
        else:
            risk_level = 'Low'
            risk_score = 0.2
        
        recommendations = self.generate_recommendations(vitals, risk_level)
        return risk_level, risk_score, recommendations


class EmergencyDetector:
    """Detect emergency conditions from vitals"""
    
    def detect(self, vitals, risk_score):
        """
        Detect if emergency condition exists
        Returns: (is_emergency, emergency_type)
        """
        emergency_conditions = []
        
        # Critical SpO2
        if vitals['spo2'] < 90:
            emergency_conditions.append("CRITICAL_SPO2")
        
        # Critical heart rate
        if vitals['heart_rate'] > 120 or vitals['heart_rate'] < 50:
            emergency_conditions.append("CRITICAL_HEART_RATE")
        
        # Critical BP
        if vitals['bp_systolic'] > 180 or vitals['bp_systolic'] < 90:
            emergency_conditions.append("CRITICAL_BP")
        
        # Critical blood sugar
        if vitals['blood_sugar'] > 300 or vitals['blood_sugar'] < 50:
            emergency_conditions.append("CRITICAL_SUGAR")
        
        # High AI risk score
        if risk_score > 0.8:
            emergency_conditions.append("HIGH_AI_RISK")
        
        is_emergency = len(emergency_conditions) > 0
        emergency_type = ", ".join(emergency_conditions) if is_emergency else None
        
        return is_emergency, emergency_type


# Explanation for hackathon judges
"""
AI MODEL EXPLANATION (Hinglish):

1. ALGORITHM: Random Forest Classifier
   - Kyun? Simple, fast, aur explainable hai
   - Multiple decision trees use karta hai
   - Overfitting se bachata hai

2. FEATURES (Input):
   - Age: Patient ki umar
   - BP (Systolic/Diastolic): Blood pressure
   - Blood Sugar: Glucose level
   - Heart Rate: Dil ki speed
   - SpO2: Oxygen saturation

3. OUTPUT:
   - Risk Level: Low / Medium / High
   - Risk Score: 0-1 (confidence)
   - Recommendations: Personalized advice

4. TRAINING:
   - Demo ke liye synthetic data use kiya
   - Real deployment mein hospital data use karenge
   - Model ko regularly retrain karenge

5. EMERGENCY DETECTION:
   - Rule-based + AI hybrid approach
   - Critical thresholds check karta hai
   - False positives kam karne ke liye multiple conditions check

6. SCALABILITY:
   - Model ko easily update kar sakte hain
   - More features add kar sakte hain (ECG, X-ray, etc.)
   - Deep learning models bhi integrate kar sakte hain

7. EXPLAINABILITY:
   - Doctors ko samajh aaye isliye simple model
   - Feature importance dekh sakte hain
   - Recommendations clear aur actionable hain
"""
