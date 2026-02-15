"""
ADVANCED EMERGENCY RESPONSE SYSTEM
Real-world production-ready implementation
"""

import heapq
from datetime import datetime
from typing import Dict, List, Tuple, Optional
import math

class SeverityScorer:
    """Calculate emergency severity score (1-10)"""
    
    @staticmethod
    def calculate_severity(vitals: Dict, medical_history: Dict, ai_risk_score: float) -> Tuple[int, Dict]:
        """
        Calculate comprehensive severity score
        Returns: (severity_score, breakdown)
        """
        
        # 1. VITAL SIGNS SCORE (0-4 points)
        vital_score = 0.0
        
        # SpO2 - Most critical
        spo2 = vitals.get('spo2', 100)
        if spo2 < 85:
            vital_score += 1.5
        elif spo2 < 90:
            vital_score += 1.0
        elif spo2 < 94:
            vital_score += 0.5
        
        # Heart Rate
        hr = vitals.get('heart_rate', 75)
        if hr > 130 or hr < 45:
            vital_score += 1.0
        elif hr > 110 or hr < 55:
            vital_score += 0.5
        
        # Blood Pressure
        bp_sys = vitals.get('bp_systolic', 120)
        if bp_sys > 200 or bp_sys < 80:
            vital_score += 1.0
        elif bp_sys > 160 or bp_sys < 90:
            vital_score += 0.5
        
        # Blood Sugar
        sugar = vitals.get('blood_sugar', 100)
        if sugar > 400 or sugar < 40:
            vital_score += 0.5
        
        # 2. AI RISK SCORE (0-3 points)
        ai_score = ai_risk_score * 3
        
        # 3. MEDICAL HISTORY SCORE (0-2 points)
        history_score = 0.0
        if medical_history.get('cardiac_history'):
            history_score += 0.7
        if medical_history.get('diabetes'):
            history_score += 0.4
        if medical_history.get('respiratory_disease'):
            history_score += 0.5
        if medical_history.get('recent_surgery'):
            history_score += 0.4
        history_score = min(2.0, history_score)
        
        # 4. AGE FACTOR (0-1 point)
        age = vitals.get('age', 30)
        if age > 70:
            age_score = 1.0
        elif age > 60:
            age_score = 0.7
        elif age > 50:
            age_score = 0.4
        elif age < 5:
            age_score = 0.8
        else:
            age_score = 0.2
        
        # TOTAL SCORE
        total = vital_score + ai_score + history_score + age_score
        severity = min(10, max(1, round(total)))
        
        breakdown = {
            'vital_score': round(vital_score, 2),
            'ai_score': round(ai_score, 2),
            'history_score': round(history_score, 2),
            'age_score': round(age_score, 2),
            'total': round(total, 2)
        }
        
        return severity, breakdown


class AmbulanceAllocator:
    """Intelligent ambulance allocation system"""
    
    AMBULANCE_TYPES = {
        'ICU_AMBULANCE': {
            'equipment': ['Ventilator', 'Defibrillator', 'Cardiac Monitor', 
                         'IV Fluids', 'Emergency Drugs', 'Oxygen (High)', 'Suction'],
            'staff': ['Paramedic', 'ICU Nurse', 'Driver'],
            'cost_multiplier': 3.0
        },
        'OXYGEN_AMBULANCE': {
            'equipment': ['Oxygen Concentrator', 'Pulse Oximeter', 'Nebulizer',
                         'Cardiac Monitor', 'First Aid'],
            'staff': ['Paramedic', 'Driver'],
            'cost_multiplier': 2.0
        },
        'BASIC_AMBULANCE': {
            'equipment': ['Stretcher', 'First Aid', 'Oxygen (Basic)', 
                         'BP Monitor', 'Thermometer'],
            'staff': ['First Aider', 'Driver'],
            'cost_multiplier': 1.0
        }
    }
    
    @staticmethod
    def determine_ambulance_type(severity: int, vitals: Dict, symptoms: str) -> str:
        """Determine required ambulance type"""
        
        # Critical severity → ICU
        if severity >= 8:
            return 'ICU_AMBULANCE'
        
        # Low oxygen → Oxygen ambulance
        if vitals.get('spo2', 100) < 90:
            return 'OXYGEN_AMBULANCE'
        
        # Cardiac symptoms → ICU
        if any(word in symptoms.lower() for word in ['chest pain', 'heart', 'cardiac']):
            return 'ICU_AMBULANCE'
        
        # Breathing issues → Oxygen
        if any(word in symptoms.lower() for word in ['breathing', 'breathless', 'asthma']):
            return 'OXYGEN_AMBULANCE'
        
        # Moderate severity → Oxygen
        if severity >= 6:
            return 'OXYGEN_AMBULANCE'
        
        return 'BASIC_AMBULANCE'
    
    @staticmethod
    def calculate_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        """Calculate distance between two coordinates (Haversine formula)"""
        R = 6371  # Earth radius in km
        
        dlat = math.radians(lat2 - lat1)
        dlon = math.radians(lon2 - lon1)
        
        a = (math.sin(dlat/2) ** 2 + 
             math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * 
             math.sin(dlon/2) ** 2)
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
        
        return R * c
    
    @staticmethod
    def calculate_eta(distance_km: float, traffic_factor: float = 1.2) -> int:
        """Calculate ETA in minutes"""
        avg_speed = 40  # km/h for ambulance
        time_hours = (distance_km / avg_speed) * traffic_factor
        return max(5, int(time_hours * 60))


class EmergencyPriorityQueue:
    """Priority queue for multiple emergencies"""
    
    def __init__(self):
        self.queue = []
        self.counter = 0
    
    def add_emergency(self, emergency_data: Dict) -> int:
        """Add emergency to queue"""
        self.counter += 1
        
        priority = (
            -emergency_data['severity_score'],  # Negative for max-heap
            emergency_data['timestamp'],
            self.counter
        )
        
        heapq.heappush(self.queue, (priority, emergency_data))
        return self.counter
    
    def get_next(self) -> Optional[Dict]:
        """Get highest priority emergency"""
        if self.queue:
            return heapq.heappop(self.queue)[1]
        return None
    
    def peek(self) -> Optional[Dict]:
        """View next without removing"""
        return self.queue[0][1] if self.queue else None
    
    def get_all(self) -> List[Dict]:
        """Get all emergencies sorted"""
        return [item[1] for item in sorted(self.queue)]
    
    def size(self) -> int:
        """Get queue size"""
        return len(self.queue)


class AlertSystem:
    """Multi-channel alert system"""
    
    @staticmethod
    def generate_ambulance_alert(emergency: Dict) -> Dict:
        """Generate alert for ambulance team"""
        patient = emergency['patient']
        vitals = emergency['vitals']
        
        return {
            'recipient': 'ambulance_team',
            'priority': 'HIGH' if emergency['severity_score'] >= 7 else 'MEDIUM',
            'title': f"🚨 EMERGENCY DISPATCH - Severity {emergency['severity_score']}/10",
            'message': f"""
Patient: {patient['name']} ({patient['age']}y, {patient.get('gender', 'N/A')})
Location: {emergency['location']}
ABHA ID: {patient['abha_id']}

VITALS:
- SpO2: {vitals['spo2']}% {'🔴' if vitals['spo2'] < 90 else '✅'}
- Heart Rate: {vitals['heart_rate']} bpm
- BP: {vitals['bp_systolic']}/{vitals['bp_diastolic']} mmHg
- Blood Sugar: {vitals['blood_sugar']} mg/dL

MEDICAL HISTORY:
{AlertSystem._format_history(patient.get('medical_history', {}))}

REQUIRED EQUIPMENT:
{', '.join(emergency['ambulance']['equipment'])}

ETA: {emergency['ambulance']['eta_minutes']} minutes
            """.strip(),
            'actions': ['ACCEPT', 'REJECT', 'REQUEST_BACKUP']
        }
    
    @staticmethod
    def generate_hospital_alert(emergency: Dict) -> Dict:
        """Generate alert for hospital"""
        return {
            'recipient': 'hospital_emergency',
            'priority': 'CRITICAL' if emergency['severity_score'] >= 8 else 'HIGH',
            'title': f"🏥 INCOMING EMERGENCY - ETA {emergency['ambulance']['eta_minutes']} min",
            'message': f"""
Severity: {emergency['severity_score']}/10
Patient: {emergency['patient']['name']} ({emergency['patient']['abha_id']})

CONDITION: {emergency.get('condition_summary', 'Emergency transport')}

REQUIRED PREPARATION:
- Bed Type: {AlertSystem._get_bed_type(emergency['severity_score'])}
- Specialist: {AlertSystem._get_specialist(emergency['vitals'])}

ALLERGIES: {emergency['patient'].get('allergies', 'None')}
BLOOD GROUP: {emergency['patient'].get('blood_group', 'Unknown')}
            """.strip(),
            'actions': ['PREPARE_BED', 'ALERT_DOCTOR', 'ARRANGE_BLOOD']
        }
    
    @staticmethod
    def _format_history(history: Dict) -> str:
        """Format medical history"""
        items = []
        if history.get('cardiac_history'):
            items.append('Cardiac disease')
        if history.get('diabetes'):
            items.append('Diabetes')
        if history.get('respiratory_disease'):
            items.append('Respiratory disease')
        return ', '.join(items) if items else 'None reported'
    
    @staticmethod
    def _get_bed_type(severity: int) -> str:
        """Determine required bed type"""
        if severity >= 8:
            return 'ICU'
        elif severity >= 6:
            return 'HDU (High Dependency)'
        else:
            return 'General Ward'
    
    @staticmethod
    def _get_specialist(vitals: Dict) -> str:
        """Determine required specialist"""
        if vitals.get('spo2', 100) < 90:
            return 'Pulmonologist'
        if vitals.get('heart_rate', 75) > 120:
            return 'Cardiologist'
        if vitals.get('bp_systolic', 120) > 180:
            return 'Cardiologist'
        return 'Emergency Physician'


# Example usage
if __name__ == "__main__":
    # Test severity scoring
    vitals = {
        'age': 58,
        'spo2': 88,
        'heart_rate': 135,
        'bp_systolic': 185,
        'bp_diastolic': 110,
        'blood_sugar': 145
    }
    
    medical_history = {
        'cardiac_history': True,
        'diabetes': True,
        'respiratory_disease': False
    }
    
    scorer = SeverityScorer()
    severity, breakdown = scorer.calculate_severity(vitals, medical_history, 0.92)
    
    print(f"Severity Score: {severity}/10")
    print(f"Breakdown: {breakdown}")
    
    # Test ambulance allocation
    allocator = AmbulanceAllocator()
    amb_type = allocator.determine_ambulance_type(severity, vitals, "chest pain")
    print(f"Required Ambulance: {amb_type}")
