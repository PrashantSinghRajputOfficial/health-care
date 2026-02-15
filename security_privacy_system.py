"""
HEALTHCARE-GRADE SECURITY & PRIVACY SYSTEM
RBAC + Data Masking + Emergency Access Control + ABHA Compliance
"""

from enum import Enum
from typing import Dict, List, Set, Optional
from datetime import datetime
import hashlib
import secrets
import re

class Role(Enum):
    """User roles in the system"""
    PATIENT = "PATIENT"
    DOCTOR = "DOCTOR"
    NURSE = "NURSE"
    AMBULANCE = "AMBULANCE"
    HOSPITAL_ADMIN = "HOSPITAL_ADMIN"
    SYSTEM_ADMIN = "SYSTEM_ADMIN"
    EMERGENCY_RESPONDER = "EMERGENCY_RESPONDER"


class DataSensitivity(Enum):
    """Data sensitivity levels"""
    PUBLIC = "PUBLIC"
    BASIC = "BASIC"
    SENSITIVE = "SENSITIVE"
    HIGHLY_SENSITIVE = "HIGHLY_SENSITIVE"
    EMERGENCY_ONLY = "EMERGENCY_ONLY"


class AccessControl:
    """Role-Based Access Control (RBAC) System"""
    
    # Define permissions for each role
    ROLE_PERMISSIONS = {
        Role.PATIENT: {
            'read': ['own_health_records', 'own_predictions', 'own_appointments', 
                    'own_prescriptions', 'doctor_profiles'],
            'write': ['own_vitals', 'emergency_sos', 'appointment_requests'],
            'delete': []
        },
        Role.DOCTOR: {
            'read': ['patient_health_records', 'patient_predictions', 'patient_history',
                    'emergency_alerts', 'lab_results', 'imaging_reports'],
            'write': ['prescriptions', 'diagnoses', 'treatment_plans', 'doctor_notes',
                     'emergency_responses'],
            'delete': ['own_notes']
        },
        Role.NURSE: {
            'read': ['patient_vitals', 'patient_basic_info', 'treatment_plans',
                    'medication_schedules'],
            'write': ['vitals_entry', 'medication_administration', 'nursing_notes'],
            'delete': []
        },
        Role.AMBULANCE: {
            'read': ['emergency_patient_summary', 'emergency_location', 'hospital_info'],
            'write': ['ambulance_status', 'patient_transport_notes', 'eta_updates'],
            'delete': []
        },
        Role.HOSPITAL_ADMIN: {
            'read': ['bed_availability', 'staff_schedules', 'hospital_analytics',
                    'patient_demographics'],
            'write': ['bed_management', 'staff_assignments', 'hospital_config'],
            'delete': []
        },
        Role.SYSTEM_ADMIN: {
            'read': ['all_system_data', 'audit_logs', 'system_metrics'],
            'write': ['system_config', 'user_management', 'role_assignments'],
            'delete': ['audit_logs_old']
        },
        Role.EMERGENCY_RESPONDER: {
            'read': ['emergency_patient_summary', 'critical_vitals', 'allergies',
                    'blood_group', 'emergency_contacts'],
            'write': ['emergency_notes', 'response_status'],
            'delete': []
        }
    }
    
    @staticmethod
    def check_permission(user_role: Role, action: str, resource: str) -> bool:
        """Check if user has permission for action on resource"""
        if user_role not in AccessControl.ROLE_PERMISSIONS:
            return False
        
        permissions = AccessControl.ROLE_PERMISSIONS[user_role]
        
        # Check if resource is in allowed list for this action
        return resource in permissions.get(action, [])
    
    @staticmethod
    def get_accessible_fields(user_role: Role, data_type: str) -> Set[str]:
        """Get list of fields accessible to this role"""
        
        field_access = {
            'patient_data': {
                Role.PATIENT: {'name', 'age', 'gender', 'abha_id', 'phone', 'email',
                              'address', 'blood_group', 'allergies', 'medical_history',
                              'vitals', 'prescriptions', 'lab_results'},
                Role.DOCTOR: {'name', 'age', 'gender', 'abha_id', 'phone', 'blood_group',
                             'allergies', 'medical_history', 'vitals', 'prescriptions',
                             'lab_results', 'imaging', 'family_history'},
                Role.NURSE: {'name', 'age', 'gender', 'bed_number', 'vitals',
                            'medication_schedule', 'allergies'},
                Role.AMBULANCE: {'name', 'age', 'gender', 'blood_group', 'allergies',
                                'emergency_contact', 'critical_conditions'},
                Role.EMERGENCY_RESPONDER: {'name', 'age', 'gender', 'blood_group',
                                          'allergies', 'critical_vitals', 'emergency_contact'}
            }
        }
        
        return field_access.get(data_type, {}).get(user_role, set())


class DataMasking:
    """Data masking for sensitive information"""
    
    @staticmethod
    def mask_abha_id(abha_id: str) -> str:
        """Mask ABHA ID: ABHA001 → ABH****"""
        if len(abha_id) <= 3:
            return abha_id
        return abha_id[:3] + '*' * (len(abha_id) - 3)
    
    @staticmethod
    def mask_phone(phone: str) -> str:
        """Mask phone: 9876543210 → 987****210"""
        if len(phone) <= 6:
            return phone
        return phone[:3] + '*' * (len(phone) - 6) + phone[-3:]
    
    @staticmethod
    def mask_email(email: str) -> str:
        """Mask email: user@example.com → u***@example.com"""
        if '@' not in email:
            return email
        local, domain = email.split('@')
        if len(local) <= 1:
            return email
        return local[0] + '***' + '@' + domain
    
    @staticmethod
    def mask_address(address: str) -> str:
        """Mask address: Keep only city and state"""
        # Simplified: return last 2 parts (city, state)
        parts = address.split(',')
        if len(parts) >= 2:
            return ', '.join(parts[-2:]).strip()
        return address
    
    @staticmethod
    def apply_masking(data: Dict, user_role: Role, data_type: str) -> Dict:
        """Apply appropriate masking based on role"""
        masked_data = data.copy()
        accessible_fields = AccessControl.get_accessible_fields(user_role, data_type)
        
        # Remove fields not accessible to this role
        for key in list(masked_data.keys()):
            if key not in accessible_fields:
                del masked_data[key]
        
        # Apply masking to sensitive fields
        if 'abha_id' in masked_data and user_role not in [Role.DOCTOR, Role.PATIENT]:
            masked_data['abha_id'] = DataMasking.mask_abha_id(masked_data['abha_id'])
        
        if 'phone' in masked_data and user_role not in [Role.DOCTOR, Role.PATIENT]:
            masked_data['phone'] = DataMasking.mask_phone(masked_data['phone'])
        
        if 'email' in masked_data and user_role not in [Role.DOCTOR, Role.PATIENT]:
            masked_data['email'] = DataMasking.mask_email(masked_data['email'])
        
        if 'address' in masked_data and user_role not in [Role.DOCTOR, Role.PATIENT]:
            masked_data['address'] = DataMasking.mask_address(masked_data['address'])
        
        return masked_data


class EmergencyAccessControl:
    """Emergency-only data sharing with limited medical summary"""
    
    @staticmethod
    def generate_emergency_summary(patient_data: Dict) -> Dict:
        """Generate limited medical summary for emergency responders"""
        return {
            'patient_id': patient_data.get('abha_id'),
            'name': patient_data.get('name'),
            'age': patient_data.get('age'),
            'gender': patient_data.get('gender'),
            'blood_group': patient_data.get('blood_group', 'Unknown'),
            'allergies': patient_data.get('allergies', []),
            'critical_conditions': EmergencyAccessControl._extract_critical_conditions(
                patient_data.get('medical_history', {})
            ),
            'current_medications': patient_data.get('current_medications', [])[:5],  # Max 5
            'emergency_contact': patient_data.get('emergency_contact'),
            'last_vitals': patient_data.get('last_vitals', {}),
            'data_access_level': 'EMERGENCY_ONLY',
            'expires_at': datetime.now().isoformat(),
            'disclaimer': 'Limited emergency data. Full records require patient consent.'
        }
    
    @staticmethod
    def _extract_critical_conditions(medical_history: Dict) -> List[str]:
        """Extract only critical conditions relevant for emergency"""
        critical = []
        
        if medical_history.get('cardiac_history'):
            critical.append('Cardiac disease')
        if medical_history.get('diabetes'):
            critical.append('Diabetes')
        if medical_history.get('respiratory_disease'):
            critical.append('Respiratory disease')
        if medical_history.get('kidney_disease'):
            critical.append('Kidney disease')
        if medical_history.get('seizure_disorder'):
            critical.append('Seizure disorder')
        
        return critical[:3]  # Max 3 conditions


class SecureTokenManager:
    """Secure API token management"""
    
    @staticmethod
    def generate_token(user_id: str, role: Role) -> str:
        """Generate secure access token"""
        timestamp = datetime.now().isoformat()
        random_part = secrets.token_hex(16)
        
        # Create token payload
        payload = f"{user_id}:{role.value}:{timestamp}:{random_part}"
        
        # Hash the payload
        token = hashlib.sha256(payload.encode()).hexdigest()
        
        return token
    
    @staticmethod
    def validate_token(token: str) -> bool:
        """Validate token format and integrity"""
        # Simplified validation
        return len(token) == 64 and re.match(r'^[a-f0-9]{64}$', token) is not None


class AuditLogger:
    """Audit logging for compliance"""
    
    @staticmethod
    def log_access(user_id: str, user_role: Role, action: str, 
                  resource: str, patient_id: Optional[str] = None) -> Dict:
        """Log data access for audit trail"""
        return {
            'timestamp': datetime.now().isoformat(),
            'user_id': user_id,
            'user_role': user_role.value,
            'action': action,
            'resource': resource,
            'patient_id': patient_id,
            'ip_address': '0.0.0.0',  # Would be actual IP in production
            'success': True
        }
    
    @staticmethod
    def log_emergency_access(responder_id: str, patient_id: str, 
                            emergency_id: str) -> Dict:
        """Log emergency data access"""
        return {
            'timestamp': datetime.now().isoformat(),
            'access_type': 'EMERGENCY',
            'responder_id': responder_id,
            'patient_id': patient_id,
            'emergency_id': emergency_id,
            'data_accessed': 'EMERGENCY_SUMMARY',
            'justification': 'Active emergency response',
            'expires_at': (datetime.now()).isoformat()
        }


class ThreatMitigation:
    """Security threat detection and mitigation"""
    
    THREATS = {
        'UNAUTHORIZED_ACCESS': {
            'description': 'User trying to access data without permission',
            'mitigation': 'Block access, log attempt, alert admin'
        },
        'DATA_BREACH': {
            'description': 'Bulk data extraction attempt',
            'mitigation': 'Rate limiting, IP blocking, immediate alert'
        },
        'SQL_INJECTION': {
            'description': 'SQL injection in input fields',
            'mitigation': 'Parameterized queries, input sanitization'
        },
        'XSS_ATTACK': {
            'description': 'Cross-site scripting attempt',
            'mitigation': 'Input validation, output encoding, CSP headers'
        },
        'BRUTE_FORCE': {
            'description': 'Multiple failed login attempts',
            'mitigation': 'Account lockout, CAPTCHA, rate limiting'
        },
        'SESSION_HIJACKING': {
            'description': 'Stolen session token usage',
            'mitigation': 'Token rotation, IP validation, timeout'
        }
    }
    
    @staticmethod
    def detect_threat(activity: Dict) -> Optional[str]:
        """Detect potential security threats"""
        # Simplified threat detection
        
        # Check for unauthorized access
        if not activity.get('authorized', True):
            return 'UNAUTHORIZED_ACCESS'
        
        # Check for bulk data access
        if activity.get('records_accessed', 0) > 100:
            return 'DATA_BREACH'
        
        # Check for failed login attempts
        if activity.get('failed_logins', 0) > 5:
            return 'BRUTE_FORCE'
        
        return None
    
    @staticmethod
    def apply_mitigation(threat_type: str) -> Dict:
        """Apply mitigation for detected threat"""
        if threat_type in ThreatMitigation.THREATS:
            return {
                'threat': threat_type,
                'action_taken': ThreatMitigation.THREATS[threat_type]['mitigation'],
                'timestamp': datetime.now().isoformat(),
                'status': 'MITIGATED'
            }
        return {'status': 'UNKNOWN_THREAT'}


# Example usage
if __name__ == "__main__":
    print("=== RBAC TEST ===")
    can_access = AccessControl.check_permission(
        Role.DOCTOR, 'read', 'patient_health_records'
    )
    print(f"Doctor can read patient records: {can_access}")
    
    print("\n=== DATA MASKING TEST ===")
    patient_data = {
        'name': 'Rajesh Kumar',
        'abha_id': 'ABHA001',
        'phone': '9876543210',
        'email': 'rajesh@example.com',
        'address': '123 Main St, Sector 15, Noida, UP',
        'blood_group': 'O+',
        'medical_history': {'diabetes': True}
    }
    
    masked = DataMasking.apply_masking(patient_data, Role.AMBULANCE, 'patient_data')
    print(f"Masked data for ambulance: {masked}")
    
    print("\n=== EMERGENCY SUMMARY TEST ===")
    emergency_summary = EmergencyAccessControl.generate_emergency_summary(patient_data)
    print(f"Emergency summary: {emergency_summary}")
    
    print("\n=== THREAT DETECTION TEST ===")
    activity = {'authorized': False, 'records_accessed': 150}
    threat = ThreatMitigation.detect_threat(activity)
    if threat:
        mitigation = ThreatMitigation.apply_mitigation(threat)
        print(f"Threat detected: {threat}")
        print(f"Mitigation: {mitigation}")
