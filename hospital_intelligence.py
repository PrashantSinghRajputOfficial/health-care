"""
HOSPITAL-SIDE INTELLIGENCE SYSTEM
Real-time bed management + Doctor alerts + Clinical decision support
"""

from datetime import datetime, timedelta
from typing import Dict, List, Optional
from enum import Enum

class BedType(Enum):
    """Bed types in hospital"""
    ICU = "ICU"
    HDU = "HDU"  # High Dependency Unit
    OXYGEN = "OXYGEN"
    GENERAL = "GENERAL"
    ISOLATION = "ISOLATION"


class BedStatus(Enum):
    """Bed availability status"""
    AVAILABLE = "AVAILABLE"
    OCCUPIED = "OCCUPIED"
    RESERVED = "RESERVED"
    MAINTENANCE = "MAINTENANCE"


class HospitalBedManager:
    """Real-time bed availability and reservation system"""
    
    def __init__(self):
        self.beds = self._initialize_beds()
        self.reservations = {}
    
    def _initialize_beds(self) -> Dict:
        """Initialize hospital bed inventory"""
        return {
            BedType.ICU: {
                'total': 20,
                'available': 5,
                'occupied': 12,
                'reserved': 2,
                'maintenance': 1,
                'beds': [
                    {'id': f'ICU-{i:02d}', 'status': BedStatus.AVAILABLE, 
                     'equipment': ['Ventilator', 'Cardiac Monitor', 'IV Pump']}
                    for i in range(1, 21)
                ]
            },
            BedType.HDU: {
                'total': 30,
                'available': 8,
                'occupied': 20,
                'reserved': 1,
                'maintenance': 1,
                'beds': [
                    {'id': f'HDU-{i:02d}', 'status': BedStatus.AVAILABLE,
                     'equipment': ['Oxygen', 'Monitor', 'IV Pump']}
                    for i in range(1, 31)
                ]
            },
            BedType.OXYGEN: {
                'total': 40,
                'available': 15,
                'occupied': 22,
                'reserved': 2,
                'maintenance': 1,
                'beds': [
                    {'id': f'OXY-{i:02d}', 'status': BedStatus.AVAILABLE,
                     'equipment': ['Oxygen Concentrator', 'Pulse Oximeter']}
                    for i in range(1, 41)
                ]
            },
            BedType.GENERAL: {
                'total': 100,
                'available': 35,
                'occupied': 60,
                'reserved': 3,
                'maintenance': 2,
                'beds': [
                    {'id': f'GEN-{i:03d}', 'status': BedStatus.AVAILABLE,
                     'equipment': ['Basic monitoring']}
                    for i in range(1, 101)
                ]
            }
        }
    
    def get_availability(self, bed_type: BedType = None) -> Dict:
        """Get real-time bed availability"""
        if bed_type:
            return {
                'bed_type': bed_type.value,
                'total': self.beds[bed_type]['total'],
                'available': self.beds[bed_type]['available'],
                'occupied': self.beds[bed_type]['occupied'],
                'reserved': self.beds[bed_type]['reserved'],
                'occupancy_rate': round((self.beds[bed_type]['occupied'] / 
                                       self.beds[bed_type]['total']) * 100, 1)
            }
        
        # Return all bed types
        return {
            bed_type.value: self.get_availability(bed_type)
            for bed_type in BedType
        }
    
    def reserve_bed(self, bed_type: BedType, patient_id: str, 
                   emergency_id: str, duration_minutes: int = 30) -> Optional[Dict]:
        """Reserve bed for incoming emergency"""
        
        # Check availability
        if self.beds[bed_type]['available'] == 0:
            # Try to find alternative
            return self._find_alternative_bed(bed_type, patient_id, emergency_id)
        
        # Find first available bed
        for bed in self.beds[bed_type]['beds']:
            if bed['status'] == BedStatus.AVAILABLE:
                # Reserve the bed
                bed['status'] = BedStatus.RESERVED
                bed['reserved_for'] = patient_id
                bed['reserved_at'] = datetime.now()
                bed['expires_at'] = datetime.now() + timedelta(minutes=duration_minutes)
                
                # Update counts
                self.beds[bed_type]['available'] -= 1
                self.beds[bed_type]['reserved'] += 1
                
                # Store reservation
                self.reservations[emergency_id] = {
                    'bed_id': bed['id'],
                    'bed_type': bed_type.value,
                    'patient_id': patient_id,
                    'reserved_at': bed['reserved_at'],
                    'expires_at': bed['expires_at']
                }
                
                return {
                    'success': True,
                    'bed_id': bed['id'],
                    'bed_type': bed_type.value,
                    'equipment': bed['equipment'],
                    'expires_in_minutes': duration_minutes
                }
        
        return None
    
    def _find_alternative_bed(self, preferred_type: BedType, 
                             patient_id: str, emergency_id: str) -> Optional[Dict]:
        """Find alternative bed if preferred type not available"""
        
        # Upgrade path: GENERAL → OXYGEN → HDU → ICU
        # Downgrade path: ICU → HDU → OXYGEN → GENERAL
        
        alternatives = {
            BedType.ICU: [BedType.HDU],
            BedType.HDU: [BedType.ICU, BedType.OXYGEN],
            BedType.OXYGEN: [BedType.HDU, BedType.GENERAL],
            BedType.GENERAL: [BedType.OXYGEN]
        }
        
        for alt_type in alternatives.get(preferred_type, []):
            if self.beds[alt_type]['available'] > 0:
                result = self.reserve_bed(alt_type, patient_id, emergency_id)
                if result:
                    result['is_alternative'] = True
                    result['preferred_type'] = preferred_type.value
                    return result
        
        return {
            'success': False,
            'message': 'No beds available',
            'waiting_list_position': self._add_to_waiting_list(patient_id, preferred_type)
        }
    
    def _add_to_waiting_list(self, patient_id: str, bed_type: BedType) -> int:
        """Add patient to waiting list"""
        # Simplified waiting list
        return 1  # Position in queue
    
    def confirm_admission(self, emergency_id: str) -> bool:
        """Confirm patient admission (convert reservation to occupied)"""
        if emergency_id not in self.reservations:
            return False
        
        reservation = self.reservations[emergency_id]
        bed_type = BedType(reservation['bed_type'])
        bed_id = reservation['bed_id']
        
        # Find and update bed
        for bed in self.beds[bed_type]['beds']:
            if bed['id'] == bed_id:
                bed['status'] = BedStatus.OCCUPIED
                bed['patient_id'] = reservation['patient_id']
                bed['admitted_at'] = datetime.now()
                
                # Update counts
                self.beds[bed_type]['reserved'] -= 1
                self.beds[bed_type]['occupied'] += 1
                
                return True
        
        return False


class DoctorAlertSystem:
    """Intelligent doctor alert and clinical decision support"""
    
    @staticmethod
    def generate_doctor_alert(emergency: Dict, patient_history: Dict) -> Dict:
        """Generate comprehensive doctor alert with clinical suggestions"""
        
        vitals = emergency['vitals']
        severity = emergency['severity_score']
        
        # Analyze critical vitals
        critical_vitals = DoctorAlertSystem._identify_critical_vitals(vitals)
        
        # Generate clinical suggestions (non-prescriptive)
        suggestions = DoctorAlertSystem._generate_clinical_suggestions(
            vitals, patient_history, critical_vitals
        )
        
        # Identify required investigations
        investigations = DoctorAlertSystem._suggest_investigations(vitals, patient_history)
        
        return {
            'alert_type': 'INCOMING_EMERGENCY',
            'priority': 'URGENT' if severity >= 7 else 'HIGH',
            'patient': {
                'name': emergency['patient']['name'],
                'age': emergency['patient']['age'],
                'gender': emergency['patient'].get('gender', 'N/A'),
                'abha_id': emergency['patient']['abha_id']
            },
            'eta_minutes': emergency['ambulance']['eta_minutes'],
            'severity_score': severity,
            'critical_vitals': critical_vitals,
            'medical_history_summary': DoctorAlertSystem._summarize_history(patient_history),
            'clinical_suggestions': suggestions,
            'suggested_investigations': investigations,
            'required_specialists': DoctorAlertSystem._identify_specialists(vitals, patient_history),
            'disclaimer': '⚠️ This is non-prescriptive clinical decision support. Final decisions rest with treating physician.'
        }
    
    @staticmethod
    def _identify_critical_vitals(vitals: Dict) -> List[Dict]:
        """Identify which vitals are critical"""
        critical = []
        
        # SpO2
        spo2 = vitals.get('spo2', 100)
        if spo2 < 85:
            critical.append({
                'parameter': 'SpO2',
                'value': f'{spo2}%',
                'severity': 'CRITICAL',
                'normal_range': '95-100%',
                'concern': 'Severe hypoxemia - immediate oxygen therapy required'
            })
        elif spo2 < 90:
            critical.append({
                'parameter': 'SpO2',
                'value': f'{spo2}%',
                'severity': 'HIGH',
                'normal_range': '95-100%',
                'concern': 'Hypoxemia - oxygen supplementation needed'
            })
        
        # Heart Rate
        hr = vitals.get('heart_rate', 75)
        if hr > 130:
            critical.append({
                'parameter': 'Heart Rate',
                'value': f'{hr} bpm',
                'severity': 'HIGH',
                'normal_range': '60-100 bpm',
                'concern': 'Severe tachycardia - cardiac monitoring required'
            })
        elif hr < 50:
            critical.append({
                'parameter': 'Heart Rate',
                'value': f'{hr} bpm',
                'severity': 'HIGH',
                'normal_range': '60-100 bpm',
                'concern': 'Bradycardia - assess for heart block'
            })
        
        # Blood Pressure
        bp_sys = vitals.get('bp_systolic', 120)
        if bp_sys > 180:
            critical.append({
                'parameter': 'Blood Pressure',
                'value': f'{bp_sys}/{vitals.get("bp_diastolic", 80)} mmHg',
                'severity': 'HIGH',
                'normal_range': '90-140/60-90 mmHg',
                'concern': 'Hypertensive emergency - risk of stroke/MI'
            })
        elif bp_sys < 90:
            critical.append({
                'parameter': 'Blood Pressure',
                'value': f'{bp_sys}/{vitals.get("bp_diastolic", 80)} mmHg',
                'severity': 'HIGH',
                'normal_range': '90-140/60-90 mmHg',
                'concern': 'Hypotension - assess for shock'
            })
        
        # Blood Sugar
        sugar = vitals.get('blood_sugar', 100)
        if sugar > 300:
            critical.append({
                'parameter': 'Blood Sugar',
                'value': f'{sugar} mg/dL',
                'severity': 'HIGH',
                'normal_range': '70-140 mg/dL',
                'concern': 'Severe hyperglycemia - check for DKA'
            })
        elif sugar < 50:
            critical.append({
                'parameter': 'Blood Sugar',
                'value': f'{sugar} mg/dL',
                'severity': 'CRITICAL',
                'normal_range': '70-140 mg/dL',
                'concern': 'Severe hypoglycemia - immediate glucose needed'
            })
        
        return critical
    
    @staticmethod
    def _generate_clinical_suggestions(vitals: Dict, history: Dict, 
                                      critical_vitals: List[Dict]) -> List[str]:
        """Generate non-prescriptive clinical suggestions"""
        suggestions = []
        
        # Based on critical vitals
        for vital in critical_vitals:
            if vital['parameter'] == 'SpO2' and vital['severity'] == 'CRITICAL':
                suggestions.append("Consider immediate high-flow oxygen therapy")
                suggestions.append("Assess airway patency and breathing effort")
                suggestions.append("Prepare for possible intubation")
            
            elif vital['parameter'] == 'Heart Rate' and vital['value'].split()[0].isdigit():
                hr = int(vital['value'].split()[0])
                if hr > 130:
                    suggestions.append("12-lead ECG recommended")
                    suggestions.append("Consider cardiac causes (MI, arrhythmia)")
                    suggestions.append("Assess for signs of heart failure")
        
        # Based on medical history
        if history.get('cardiac_history'):
            suggestions.append("Review previous cardiac events and interventions")
            suggestions.append("Check for recent medication changes")
        
        if history.get('diabetes'):
            suggestions.append("Monitor blood glucose closely")
            suggestions.append("Assess for diabetic complications")
        
        return suggestions
    
    @staticmethod
    def _suggest_investigations(vitals: Dict, history: Dict) -> List[str]:
        """Suggest required investigations"""
        investigations = ['Complete Blood Count', 'Basic Metabolic Panel']
        
        # Cardiac workup
        if vitals.get('heart_rate', 75) > 120 or vitals.get('bp_systolic', 120) > 160:
            investigations.extend(['ECG', 'Troponin', 'BNP'])
        
        # Respiratory workup
        if vitals.get('spo2', 100) < 92:
            investigations.extend(['ABG', 'Chest X-ray'])
        
        # Diabetes workup
        if vitals.get('blood_sugar', 100) > 200 or history.get('diabetes'):
            investigations.extend(['HbA1c', 'Ketones'])
        
        return investigations
    
    @staticmethod
    def _identify_specialists(vitals: Dict, history: Dict) -> List[str]:
        """Identify required specialist consultations"""
        specialists = ['Emergency Physician']
        
        if vitals.get('spo2', 100) < 90:
            specialists.append('Pulmonologist')
        
        if vitals.get('heart_rate', 75) > 120 or history.get('cardiac_history'):
            specialists.append('Cardiologist')
        
        if vitals.get('blood_sugar', 100) > 300 or vitals.get('blood_sugar', 100) < 50:
            specialists.append('Endocrinologist')
        
        return specialists
    
    @staticmethod
    def _summarize_history(history: Dict) -> str:
        """Summarize medical history"""
        items = []
        if history.get('cardiac_history'):
            items.append('Known cardiac disease')
        if history.get('diabetes'):
            items.append('Diabetes mellitus')
        if history.get('hypertension'):
            items.append('Hypertension')
        if history.get('respiratory_disease'):
            items.append('Chronic respiratory disease')
        
        return ', '.join(items) if items else 'No significant history reported'


class LabAlertSystem:
    """Critical lab value warning system"""
    
    CRITICAL_RANGES = {
        'hemoglobin': {'low': 7.0, 'high': 20.0, 'unit': 'g/dL'},
        'wbc': {'low': 2.0, 'high': 30.0, 'unit': '×10³/μL'},
        'platelets': {'low': 50, 'high': 1000, 'unit': '×10³/μL'},
        'sodium': {'low': 120, 'high': 160, 'unit': 'mEq/L'},
        'potassium': {'low': 2.5, 'high': 6.5, 'unit': 'mEq/L'},
        'creatinine': {'low': 0.5, 'high': 5.0, 'unit': 'mg/dL'},
        'troponin': {'low': 0, 'high': 0.04, 'unit': 'ng/mL'}
    }
    
    @staticmethod
    def check_critical_values(lab_results: Dict) -> List[Dict]:
        """Check for critical lab values"""
        alerts = []
        
        for test, value in lab_results.items():
            if test in LabAlertSystem.CRITICAL_RANGES:
                ranges = LabAlertSystem.CRITICAL_RANGES[test]
                
                if value < ranges['low']:
                    alerts.append({
                        'test': test,
                        'value': value,
                        'unit': ranges['unit'],
                        'status': 'CRITICALLY LOW',
                        'normal_range': f"{ranges['low']}-{ranges['high']} {ranges['unit']}",
                        'action_required': True
                    })
                elif value > ranges['high']:
                    alerts.append({
                        'test': test,
                        'value': value,
                        'unit': ranges['unit'],
                        'status': 'CRITICALLY HIGH',
                        'normal_range': f"{ranges['low']}-{ranges['high']} {ranges['unit']}",
                        'action_required': True
                    })
        
        return alerts


# Example usage
if __name__ == "__main__":
    # Test bed management
    bed_manager = HospitalBedManager()
    
    print("=== BED AVAILABILITY ===")
    availability = bed_manager.get_availability()
    for bed_type, info in availability.items():
        print(f"{bed_type}: {info['available']}/{info['total']} available ({info['occupancy_rate']}% occupied)")
    
    print("\n=== RESERVE ICU BED ===")
    reservation = bed_manager.reserve_bed(BedType.ICU, "P12345", "EMG001")
    print(f"Reservation: {reservation}")
    
    print("\n=== DOCTOR ALERT ===")
    emergency = {
        'severity_score': 9,
        'patient': {'name': 'Rajesh Kumar', 'age': 58, 'abha_id': 'ABHA001'},
        'vitals': {'spo2': 88, 'heart_rate': 135, 'bp_systolic': 185, 
                  'bp_diastolic': 110, 'blood_sugar': 145},
        'ambulance': {'eta_minutes': 8}
    }
    
    patient_history = {'cardiac_history': True, 'diabetes': True}
    
    alert = DoctorAlertSystem.generate_doctor_alert(emergency, patient_history)
    print(f"Alert Priority: {alert['priority']}")
    print(f"Critical Vitals: {len(alert['critical_vitals'])}")
    print(f"Suggestions: {len(alert['clinical_suggestions'])}")
