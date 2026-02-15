"""
╔══════════════════════════════════════════════════════════════════════════════╗
║                                                                              ║
║   ADVANCED HEALTHCARE AI/ML SYSTEM                                          ║
║   Multi-Risk Prediction with Explainable AI                                 ║
║                                                                              ║
║   Author: Senior Healthcare AI/ML Engineer                                  ║
║   Version: 2.0                                                               ║
║   Features: Heart Disease, Diabetes, Respiratory Risk Prediction            ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝
"""

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split, cross_val_score
import joblib
import os
import json
from datetime import datetime

class AdvancedHealthRiskPredictor:
    """
    Advanced Multi-Risk Healthcare AI System
    
    Predicts:
    1. Heart Disease Risk
    2. Diabetes Risk
    3. Respiratory Risk
    4. Overall Emergency Probability
    
    Features:
    - Explainable AI with feature importance
    - Multi-model ensemble
    - Confidence scores
    - Emergency threshold detection
    """
    
    def __init__(self):
        self.models = {
            'heart': None,
            'diabetes': None,
            'respiratory': None
        }
        self.scaler = StandardScaler()
        self.feature_names = ['age', 'bp_systolic', 'bp_diastolic', 
                             'blood_sugar', 'heart_rate', 'spo2']
        self.is_trained = False
        
        # Load or train models
        self.load_or_train_models()
    
    def load_or_train_models(self):
        """Load existing models or train new ones"""
        model_path = 'advanced_health_models.pkl'
        
        try:
            if os.path.exists(model_path):
                saved_data = joblib.load(model_path)
                self.models = saved_data['models']
                self.scaler = saved_data['scaler']
                self.is_trained = True
                print("✅ Loaded existing advanced models")
            else:
                print("📚 Training new advanced models...")
                self.train_models()
                self.save_models(model_path)
                print("✅ Models trained and saved")
        except Exception as e:
            print(f"⚠️ Model load error: {e}. Training new models...")
            self.train_models()
            try:
                self.save_models(model_path)
            except Exception as save_error:
                print(f"⚠️ Could not save models: {save_error}")
    
    def generate_synthetic_training_data(self, n_samples=1000):
        """
        Generate realistic synthetic training data for healthcare scenarios
        
        Returns:
            X: Features (age, bp_systolic, bp_diastolic, blood_sugar, heart_rate, spo2)
            y_heart: Heart disease labels
            y_diabetes: Diabetes labels
            y_respiratory: Respiratory labels
        """
        np.random.seed(42)
        
        # Generate base features with realistic distributions
        age = np.random.normal(50, 15, n_samples).clip(18, 90)
        
        # Blood Pressure (correlated with age)
        bp_systolic = np.random.normal(120 + age * 0.3, 15, n_samples).clip(90, 200)
        bp_diastolic = np.random.normal(80 + age * 0.15, 10, n_samples).clip(60, 120)
        
        # Blood Sugar (some correlation with age and BP)
        blood_sugar = np.random.normal(100 + age * 0.5, 25, n_samples).clip(70, 300)
        
        # Heart Rate (inverse correlation with age)
        heart_rate = np.random.normal(75 - age * 0.1, 12, n_samples).clip(50, 120)
        
        # SpO2 (slight decrease with age)
        spo2 = np.random.normal(98 - age * 0.05, 2, n_samples).clip(85, 100)
        
        X = np.column_stack([age, bp_systolic, bp_diastolic, 
                            blood_sugar, heart_rate, spo2])
        
        # Generate labels based on realistic medical thresholds
        
        # Heart Disease Risk
        heart_risk_score = (
            (bp_systolic > 140) * 2 +
            (bp_diastolic > 90) * 2 +
            (heart_rate > 100) * 1.5 +
            (heart_rate < 60) * 1 +
            (age > 60) * 1.5 +
            (spo2 < 95) * 1
        )
        y_heart = (heart_risk_score > 3).astype(int)
        
        # Diabetes Risk
        diabetes_risk_score = (
            (blood_sugar > 140) * 3 +
            (blood_sugar > 180) * 2 +
            (age > 50) * 1 +
            (bp_systolic > 140) * 1
        )
        y_diabetes = (diabetes_risk_score > 3).astype(int)
        
        # Respiratory Risk
        respiratory_risk_score = (
            (spo2 < 95) * 3 +
            (spo2 < 92) * 2 +
            (heart_rate > 100) * 1 +
            (age > 65) * 1
        )
        y_respiratory = (respiratory_risk_score > 3).astype(int)
        
        return X, y_heart, y_diabetes, y_respiratory
    
    def train_models(self):
        """Train all three risk prediction models"""
        # Generate training data
        X, y_heart, y_diabetes, y_respiratory = self.generate_synthetic_training_data(1000)
        
        # Normalize features
        X_scaled = self.scaler.fit_transform(X)
        
        # Train Heart Disease Model
        self.models['heart'] = GradientBoostingClassifier(
            n_estimators=100,
            learning_rate=0.1,
            max_depth=5,
            random_state=42
        )
        self.models['heart'].fit(X_scaled, y_heart)
        
        # Train Diabetes Model
        self.models['diabetes'] = RandomForestClassifier(
            n_estimators=100,
            max_depth=10,
            min_samples_split=5,
            random_state=42
        )
        self.models['diabetes'].fit(X_scaled, y_diabetes)
        
        # Train Respiratory Model
        self.models['respiratory'] = GradientBoostingClassifier(
            n_estimators=100,
            learning_rate=0.1,
            max_depth=5,
            random_state=42
        )
        self.models['respiratory'].fit(X_scaled, y_respiratory)
        
        self.is_trained = True
        
        # Print training summary
        print("\n" + "="*70)
        print("📊 MODEL TRAINING SUMMARY")
        print("="*70)
        print(f"Training samples: {len(X)}")
        print(f"Features: {', '.join(self.feature_names)}")
        print(f"\nHeart Disease Model: Gradient Boosting")
        print(f"Diabetes Model: Random Forest")
        print(f"Respiratory Model: Gradient Boosting")
        print("="*70 + "\n")
    
    def save_models(self, path):
        """Save trained models and scaler"""
        save_data = {
            'models': self.models,
            'scaler': self.scaler,
            'feature_names': self.feature_names,
            'trained_at': datetime.now().isoformat()
        }
        joblib.dump(save_data, path)
    
    def normalize_vitals(self, vitals):
        """Normalize input vitals"""
        X = np.array([[
            vitals['age'],
            vitals['bp_systolic'],
            vitals['bp_diastolic'],
            vitals['blood_sugar'],
            vitals['heart_rate'],
            vitals['spo2']
        ]])
        return self.scaler.transform(X)

    
    def predict_all_risks(self, vitals):
        """
        Predict all health risks with explanations
        
        Args:
            vitals: dict with keys: age, bp_systolic, bp_diastolic, 
                   blood_sugar, heart_rate, spo2
        
        Returns:
            dict with predictions, probabilities, explanations, and emergency status
        """
        if not self.is_trained:
            raise Exception("Models not trained yet!")
        
        # Normalize input
        X_scaled = self.normalize_vitals(vitals)
        
        # Get predictions and probabilities for each model
        predictions = {}
        probabilities = {}
        
        for risk_type, model in self.models.items():
            pred = model.predict(X_scaled)[0]
            prob = model.predict_proba(X_scaled)[0]
            
            predictions[risk_type] = pred
            probabilities[risk_type] = {
                'low_risk': float(prob[0]),
                'high_risk': float(prob[1])
            }
        
        # Calculate overall emergency probability
        emergency_prob = self.calculate_emergency_probability(
            probabilities, vitals
        )
        
        # Generate explanations
        explanations = self.generate_explanations(vitals, probabilities)
        
        # Determine emergency status
        emergency_status = self.determine_emergency_status(
            emergency_prob, vitals
        )
        
        # Get feature importance
        feature_importance = self.get_feature_importance()
        
        return {
            'predictions': predictions,
            'probabilities': probabilities,
            'emergency_probability': emergency_prob,
            'emergency_status': emergency_status,
            'explanations': explanations,
            'feature_importance': feature_importance,
            'risk_summary': self.generate_risk_summary(probabilities),
            'recommendations': self.generate_recommendations(
                predictions, vitals, emergency_status
            )
        }
    
    def calculate_emergency_probability(self, probabilities, vitals):
        """
        Calculate overall emergency probability
        
        Weighted combination of:
        - Heart disease risk (40%)
        - Diabetes risk (30%)
        - Respiratory risk (30%)
        - Critical vital thresholds
        """
        # Base probability from models
        heart_prob = probabilities['heart']['high_risk']
        diabetes_prob = probabilities['diabetes']['high_risk']
        respiratory_prob = probabilities['respiratory']['high_risk']
        
        # Weighted average
        base_prob = (
            heart_prob * 0.40 +
            diabetes_prob * 0.30 +
            respiratory_prob * 0.30
        )
        
        # Critical threshold adjustments
        critical_multiplier = 1.0
        
        # Critical SpO2
        if vitals['spo2'] < 90:
            critical_multiplier *= 1.5
        elif vitals['spo2'] < 92:
            critical_multiplier *= 1.3
        
        # Critical BP
        if vitals['bp_systolic'] > 180 or vitals['bp_systolic'] < 90:
            critical_multiplier *= 1.4
        
        # Critical Heart Rate
        if vitals['heart_rate'] > 120 or vitals['heart_rate'] < 50:
            critical_multiplier *= 1.3
        
        # Critical Blood Sugar
        if vitals['blood_sugar'] > 300 or vitals['blood_sugar'] < 50:
            critical_multiplier *= 1.3
        
        # Calculate final probability
        emergency_prob = min(base_prob * critical_multiplier, 1.0)
        
        return float(emergency_prob)
    
    def determine_emergency_status(self, emergency_prob, vitals):
        """
        Determine emergency status based on probability and critical thresholds
        
        Returns:
            dict with status, level, and immediate_action flag
        """
        # Critical thresholds that trigger immediate emergency
        critical_conditions = []
        
        if vitals['spo2'] < 90:
            critical_conditions.append("Critical oxygen level")
        if vitals['bp_systolic'] > 180:
            critical_conditions.append("Hypertensive crisis")
        if vitals['bp_systolic'] < 90:
            critical_conditions.append("Hypotension")
        if vitals['heart_rate'] > 120:
            critical_conditions.append("Tachycardia")
        if vitals['heart_rate'] < 50:
            critical_conditions.append("Bradycardia")
        if vitals['blood_sugar'] > 300:
            critical_conditions.append("Severe hyperglycemia")
        if vitals['blood_sugar'] < 50:
            critical_conditions.append("Severe hypoglycemia")
        
        # Determine status
        if critical_conditions or emergency_prob > 0.8:
            status = "CRITICAL"
            level = "emergency"
            immediate_action = True
            message = "Immediate medical attention required!"
        elif emergency_prob > 0.6:
            status = "HIGH"
            level = "urgent"
            immediate_action = True
            message = "Urgent medical consultation recommended"
        elif emergency_prob > 0.4:
            status = "MODERATE"
            level = "warning"
            immediate_action = False
            message = "Schedule medical checkup soon"
        else:
            status = "LOW"
            level = "normal"
            immediate_action = False
            message = "Continue regular health monitoring"
        
        return {
            'status': status,
            'level': level,
            'immediate_action': immediate_action,
            'message': message,
            'critical_conditions': critical_conditions
        }
    
    def generate_explanations(self, vitals, probabilities):
        """
        Generate human-readable explanations for each risk prediction
        
        Uses feature importance and threshold analysis
        """
        explanations = {}
        
        # Heart Disease Explanation
        heart_factors = []
        if vitals['bp_systolic'] > 140 or vitals['bp_diastolic'] > 90:
            heart_factors.append(f"Elevated blood pressure ({vitals['bp_systolic']}/{vitals['bp_diastolic']} mmHg)")
        if vitals['heart_rate'] > 100:
            heart_factors.append(f"Elevated heart rate ({vitals['heart_rate']} bpm)")
        if vitals['heart_rate'] < 60:
            heart_factors.append(f"Low heart rate ({vitals['heart_rate']} bpm)")
        if vitals['age'] > 60:
            heart_factors.append(f"Age factor ({vitals['age']} years)")
        if vitals['spo2'] < 95:
            heart_factors.append(f"Low oxygen saturation ({vitals['spo2']}%)")
        
        heart_prob = probabilities['heart']['high_risk']
        if heart_prob > 0.7:
            heart_risk = "HIGH"
        elif heart_prob > 0.4:
            heart_risk = "MODERATE"
        else:
            heart_risk = "LOW"
        
        explanations['heart'] = {
            'risk_level': heart_risk,
            'probability': heart_prob,
            'factors': heart_factors if heart_factors else ["All cardiac indicators within normal range"],
            'summary': f"{heart_risk} risk ({heart_prob*100:.1f}% probability)"
        }
        
        # Diabetes Explanation
        diabetes_factors = []
        if vitals['blood_sugar'] > 140:
            diabetes_factors.append(f"Elevated blood sugar ({vitals['blood_sugar']} mg/dL)")
        if vitals['blood_sugar'] > 180:
            diabetes_factors.append(f"Significantly high blood sugar")
        if vitals['age'] > 50:
            diabetes_factors.append(f"Age-related risk ({vitals['age']} years)")
        if vitals['bp_systolic'] > 140:
            diabetes_factors.append(f"Hypertension present")
        
        diabetes_prob = probabilities['diabetes']['high_risk']
        if diabetes_prob > 0.7:
            diabetes_risk = "HIGH"
        elif diabetes_prob > 0.4:
            diabetes_risk = "MODERATE"
        else:
            diabetes_risk = "LOW"
        
        explanations['diabetes'] = {
            'risk_level': diabetes_risk,
            'probability': diabetes_prob,
            'factors': diabetes_factors if diabetes_factors else ["Blood sugar levels within normal range"],
            'summary': f"{diabetes_risk} risk ({diabetes_prob*100:.1f}% probability)"
        }
        
        # Respiratory Explanation
        respiratory_factors = []
        if vitals['spo2'] < 95:
            respiratory_factors.append(f"Low oxygen saturation ({vitals['spo2']}%)")
        if vitals['spo2'] < 92:
            respiratory_factors.append(f"Critically low oxygen level")
        if vitals['heart_rate'] > 100:
            respiratory_factors.append(f"Compensatory tachycardia ({vitals['heart_rate']} bpm)")
        if vitals['age'] > 65:
            respiratory_factors.append(f"Age-related respiratory risk ({vitals['age']} years)")
        
        respiratory_prob = probabilities['respiratory']['high_risk']
        if respiratory_prob > 0.7:
            respiratory_risk = "HIGH"
        elif respiratory_prob > 0.4:
            respiratory_risk = "MODERATE"
        else:
            respiratory_risk = "LOW"
        
        explanations['respiratory'] = {
            'risk_level': respiratory_risk,
            'probability': respiratory_prob,
            'factors': respiratory_factors if respiratory_factors else ["Respiratory function within normal range"],
            'summary': f"{respiratory_risk} risk ({respiratory_prob*100:.1f}% probability)"
        }
        
        return explanations
    
    def get_feature_importance(self):
        """Get feature importance from models"""
        importance = {}
        
        for risk_type, model in self.models.items():
            if hasattr(model, 'feature_importances_'):
                feature_imp = model.feature_importances_
                importance[risk_type] = {
                    name: float(imp) 
                    for name, imp in zip(self.feature_names, feature_imp)
                }
        
        return importance
    
    def generate_risk_summary(self, probabilities):
        """Generate overall risk summary"""
        heart_risk = probabilities['heart']['high_risk']
        diabetes_risk = probabilities['diabetes']['high_risk']
        respiratory_risk = probabilities['respiratory']['high_risk']
        
        max_risk = max(heart_risk, diabetes_risk, respiratory_risk)
        
        if max_risk > 0.7:
            overall = "HIGH RISK"
            color = "red"
        elif max_risk > 0.4:
            overall = "MODERATE RISK"
            color = "orange"
        else:
            overall = "LOW RISK"
            color = "green"
        
        return {
            'overall': overall,
            'color': color,
            'heart_risk_pct': f"{heart_risk*100:.1f}%",
            'diabetes_risk_pct': f"{diabetes_risk*100:.1f}%",
            'respiratory_risk_pct': f"{respiratory_risk*100:.1f}%"
        }

    
    def generate_recommendations(self, predictions, vitals, emergency_status):
        """Generate personalized health recommendations"""
        recommendations = []
        
        # Emergency recommendations
        if emergency_status['immediate_action']:
            recommendations.append({
                'priority': 'CRITICAL',
                'action': '🚨 Seek immediate medical attention',
                'reason': emergency_status['message']
            })
            
            if emergency_status['critical_conditions']:
                for condition in emergency_status['critical_conditions']:
                    recommendations.append({
                        'priority': 'CRITICAL',
                        'action': f'Address {condition}',
                        'reason': 'Life-threatening condition detected'
                    })
        
        # Heart disease recommendations
        if predictions['heart'] == 1:
            if vitals['bp_systolic'] > 140:
                recommendations.append({
                    'priority': 'HIGH',
                    'action': 'Monitor blood pressure regularly',
                    'reason': 'Elevated blood pressure detected'
                })
            if vitals['heart_rate'] > 100:
                recommendations.append({
                    'priority': 'MEDIUM',
                    'action': 'Reduce stress and avoid stimulants',
                    'reason': 'Elevated heart rate'
                })
        
        # Diabetes recommendations
        if predictions['diabetes'] == 1:
            if vitals['blood_sugar'] > 140:
                recommendations.append({
                    'priority': 'HIGH',
                    'action': 'Consult endocrinologist for blood sugar management',
                    'reason': f'Blood sugar at {vitals["blood_sugar"]} mg/dL'
                })
                recommendations.append({
                    'priority': 'MEDIUM',
                    'action': 'Follow diabetic diet plan',
                    'reason': 'Help regulate blood sugar levels'
                })
        
        # Respiratory recommendations
        if predictions['respiratory'] == 1:
            if vitals['spo2'] < 95:
                recommendations.append({
                    'priority': 'HIGH',
                    'action': 'Consult pulmonologist',
                    'reason': f'Low oxygen saturation ({vitals["spo2"]}%)'
                })
                recommendations.append({
                    'priority': 'MEDIUM',
                    'action': 'Avoid strenuous activities',
                    'reason': 'Maintain adequate oxygen levels'
                })
        
        # General recommendations
        if vitals['age'] > 60:
            recommendations.append({
                'priority': 'LOW',
                'action': 'Schedule regular health checkups',
                'reason': 'Age-appropriate preventive care'
            })
        
        # If no critical issues
        if not recommendations:
            recommendations.append({
                'priority': 'LOW',
                'action': 'Continue healthy lifestyle',
                'reason': 'All vitals within normal range'
            })
            recommendations.append({
                'priority': 'LOW',
                'action': 'Regular exercise and balanced diet',
                'reason': 'Maintain good health'
            })
        
        return recommendations


class EmergencyDecisionEngine:
    """
    Advanced Emergency Decision Engine
    
    Determines when to trigger emergency alerts based on:
    - AI predictions
    - Critical vital thresholds
    - Trend analysis
    - Risk combinations
    """
    
    # Critical thresholds
    CRITICAL_THRESHOLDS = {
        'spo2_critical': 90,
        'spo2_warning': 92,
        'bp_systolic_high': 180,
        'bp_systolic_low': 90,
        'bp_diastolic_high': 110,
        'heart_rate_high': 120,
        'heart_rate_low': 50,
        'blood_sugar_high': 300,
        'blood_sugar_low': 50
    }
    
    # Emergency probability thresholds
    EMERGENCY_THRESHOLDS = {
        'critical': 0.8,
        'urgent': 0.6,
        'warning': 0.4
    }
    
    @staticmethod
    def evaluate_emergency(prediction_result, vitals):
        """
        Comprehensive emergency evaluation
        
        Returns:
            dict with emergency decision and details
        """
        emergency_prob = prediction_result['emergency_probability']
        emergency_status = prediction_result['emergency_status']
        
        # Check critical conditions
        critical_vitals = EmergencyDecisionEngine._check_critical_vitals(vitals)
        
        # Determine emergency level
        if emergency_status['immediate_action'] or critical_vitals['has_critical']:
            emergency_level = "CRITICAL"
            trigger_ambulance = True
            notify_doctor = True
            alert_family = True
        elif emergency_prob > EmergencyDecisionEngine.EMERGENCY_THRESHOLDS['urgent']:
            emergency_level = "URGENT"
            trigger_ambulance = False
            notify_doctor = True
            alert_family = True
        elif emergency_prob > EmergencyDecisionEngine.EMERGENCY_THRESHOLDS['warning']:
            emergency_level = "WARNING"
            trigger_ambulance = False
            notify_doctor = True
            alert_family = False
        else:
            emergency_level = "NORMAL"
            trigger_ambulance = False
            notify_doctor = False
            alert_family = False
        
        return {
            'emergency_level': emergency_level,
            'emergency_probability': emergency_prob,
            'trigger_ambulance': trigger_ambulance,
            'notify_doctor': notify_doctor,
            'alert_family': alert_family,
            'critical_vitals': critical_vitals,
            'response_time_required': EmergencyDecisionEngine._get_response_time(emergency_level),
            'recommended_actions': EmergencyDecisionEngine._get_emergency_actions(
                emergency_level, critical_vitals
            )
        }
    
    @staticmethod
    def _check_critical_vitals(vitals):
        """Check for critically abnormal vitals"""
        critical_issues = []
        
        if vitals['spo2'] < EmergencyDecisionEngine.CRITICAL_THRESHOLDS['spo2_critical']:
            critical_issues.append({
                'vital': 'SpO2',
                'value': vitals['spo2'],
                'severity': 'CRITICAL',
                'message': 'Dangerously low oxygen saturation'
            })
        
        if vitals['bp_systolic'] > EmergencyDecisionEngine.CRITICAL_THRESHOLDS['bp_systolic_high']:
            critical_issues.append({
                'vital': 'Blood Pressure',
                'value': f"{vitals['bp_systolic']}/{vitals['bp_diastolic']}",
                'severity': 'CRITICAL',
                'message': 'Hypertensive crisis'
            })
        
        if vitals['bp_systolic'] < EmergencyDecisionEngine.CRITICAL_THRESHOLDS['bp_systolic_low']:
            critical_issues.append({
                'vital': 'Blood Pressure',
                'value': f"{vitals['bp_systolic']}/{vitals['bp_diastolic']}",
                'severity': 'CRITICAL',
                'message': 'Severe hypotension'
            })
        
        if vitals['heart_rate'] > EmergencyDecisionEngine.CRITICAL_THRESHOLDS['heart_rate_high']:
            critical_issues.append({
                'vital': 'Heart Rate',
                'value': vitals['heart_rate'],
                'severity': 'CRITICAL',
                'message': 'Severe tachycardia'
            })
        
        if vitals['heart_rate'] < EmergencyDecisionEngine.CRITICAL_THRESHOLDS['heart_rate_low']:
            critical_issues.append({
                'vital': 'Heart Rate',
                'value': vitals['heart_rate'],
                'severity': 'CRITICAL',
                'message': 'Severe bradycardia'
            })
        
        if vitals['blood_sugar'] > EmergencyDecisionEngine.CRITICAL_THRESHOLDS['blood_sugar_high']:
            critical_issues.append({
                'vital': 'Blood Sugar',
                'value': vitals['blood_sugar'],
                'severity': 'CRITICAL',
                'message': 'Severe hyperglycemia'
            })
        
        if vitals['blood_sugar'] < EmergencyDecisionEngine.CRITICAL_THRESHOLDS['blood_sugar_low']:
            critical_issues.append({
                'vital': 'Blood Sugar',
                'value': vitals['blood_sugar'],
                'severity': 'CRITICAL',
                'message': 'Severe hypoglycemia'
            })
        
        return {
            'has_critical': len(critical_issues) > 0,
            'count': len(critical_issues),
            'issues': critical_issues
        }
    
    @staticmethod
    def _get_response_time(emergency_level):
        """Get required response time for emergency level"""
        response_times = {
            'CRITICAL': 'Immediate (< 5 minutes)',
            'URGENT': 'Within 15 minutes',
            'WARNING': 'Within 1 hour',
            'NORMAL': 'Routine monitoring'
        }
        return response_times.get(emergency_level, 'Unknown')
    
    @staticmethod
    def _get_emergency_actions(emergency_level, critical_vitals):
        """Get recommended emergency actions"""
        actions = []
        
        if emergency_level == 'CRITICAL':
            actions.append('🚨 Call emergency services (911/108)')
            actions.append('🚑 Dispatch ambulance immediately')
            actions.append('👨‍⚕️ Alert on-call physician')
            actions.append('👨‍👩‍👧 Notify emergency contacts')
            actions.append('🏥 Prepare emergency room')
            
            if critical_vitals['has_critical']:
                for issue in critical_vitals['issues']:
                    actions.append(f"⚠️ Address {issue['vital']}: {issue['message']}")
        
        elif emergency_level == 'URGENT':
            actions.append('📞 Contact primary care physician')
            actions.append('🏥 Schedule urgent appointment')
            actions.append('👨‍👩‍👧 Inform family members')
            actions.append('📊 Monitor vitals closely')
        
        elif emergency_level == 'WARNING':
            actions.append('📅 Schedule medical checkup')
            actions.append('📊 Continue monitoring vitals')
            actions.append('💊 Review current medications')
        
        else:
            actions.append('✅ Continue regular health monitoring')
            actions.append('🏃 Maintain healthy lifestyle')
        
        return actions


# ============================================================================
# USAGE EXAMPLE AND TESTING
# ============================================================================

def demo_prediction():
    """Demonstrate the advanced AI system"""
    print("\n" + "="*80)
    print("🏥 ADVANCED HEALTHCARE AI SYSTEM - DEMO")
    print("="*80 + "\n")
    
    # Initialize predictor
    predictor = AdvancedHealthRiskPredictor()
    
    # Test cases
    test_cases = [
        {
            'name': 'Healthy Young Adult',
            'vitals': {
                'age': 28,
                'bp_systolic': 120,
                'bp_diastolic': 80,
                'blood_sugar': 95,
                'heart_rate': 72,
                'spo2': 98
            }
        },
        {
            'name': 'Moderate Risk Patient',
            'vitals': {
                'age': 55,
                'bp_systolic': 145,
                'bp_diastolic': 92,
                'blood_sugar': 155,
                'heart_rate': 88,
                'spo2': 94
            }
        },
        {
            'name': 'Critical Emergency Patient',
            'vitals': {
                'age': 68,
                'bp_systolic': 185,
                'bp_diastolic': 110,
                'blood_sugar': 310,
                'heart_rate': 125,
                'spo2': 88
            }
        }
    ]
    
    for i, test_case in enumerate(test_cases, 1):
        print(f"\n{'─'*80}")
        print(f"TEST CASE {i}: {test_case['name']}")
        print(f"{'─'*80}\n")
        
        vitals = test_case['vitals']
        
        # Display vitals
        print("📊 Patient Vitals:")
        print(f"   Age: {vitals['age']} years")
        print(f"   Blood Pressure: {vitals['bp_systolic']}/{vitals['bp_diastolic']} mmHg")
        print(f"   Blood Sugar: {vitals['blood_sugar']} mg/dL")
        print(f"   Heart Rate: {vitals['heart_rate']} bpm")
        print(f"   SpO2: {vitals['spo2']}%")
        
        # Get AI prediction
        result = predictor.predict_all_risks(vitals)
        
        # Display results
        print(f"\n🤖 AI Analysis:")
        print(f"   Emergency Probability: {result['emergency_probability']*100:.1f}%")
        print(f"   Status: {result['emergency_status']['status']}")
        print(f"   Message: {result['emergency_status']['message']}")
        
        print(f"\n📈 Risk Breakdown:")
        for risk_type, explanation in result['explanations'].items():
            print(f"\n   {risk_type.upper()} DISEASE:")
            print(f"      Risk Level: {explanation['risk_level']}")
            print(f"      Probability: {explanation['probability']*100:.1f}%")
            print(f"      Factors:")
            for factor in explanation['factors']:
                print(f"         • {factor}")
        
        # Emergency decision
        emergency_decision = EmergencyDecisionEngine.evaluate_emergency(result, vitals)
        
        print(f"\n🚨 Emergency Decision:")
        print(f"   Level: {emergency_decision['emergency_level']}")
        print(f"   Trigger Ambulance: {'YES' if emergency_decision['trigger_ambulance'] else 'NO'}")
        print(f"   Notify Doctor: {'YES' if emergency_decision['notify_doctor'] else 'NO'}")
        print(f"   Response Time: {emergency_decision['response_time_required']}")
        
        print(f"\n💡 Recommendations:")
        for rec in result['recommendations'][:3]:  # Show top 3
            print(f"   [{rec['priority']}] {rec['action']}")
            print(f"      → {rec['reason']}")
    
    print(f"\n{'='*80}")
    print("✅ DEMO COMPLETED")
    print(f"{'='*80}\n")


if __name__ == "__main__":
    demo_prediction()
