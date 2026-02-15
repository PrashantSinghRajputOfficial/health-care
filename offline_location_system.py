"""
LOW-NETWORK & LOCATION SUPPORT SYSTEM
Offline emergency mode + GPS tracking + SMS fallback
"""

from typing import Dict, List, Tuple, Optional
from datetime import datetime
import math
import json

class LocationService:
    """GPS-based location tracking and nearest ambulance selection"""
    
    @staticmethod
    def get_current_location() -> Dict:
        """Get current GPS location (mock implementation)"""
        # In production, this would use actual GPS API
        return {
            'latitude': 28.6139,
            'longitude': 77.2090,
            'accuracy': 10,  # meters
            'timestamp': datetime.now().isoformat(),
            'address': 'Sector 15, Noida, UP'
        }
    
    @staticmethod
    def calculate_distance(lat1: float, lon1: float, 
                          lat2: float, lon2: float) -> float:
        """
        Calculate distance between two coordinates using Haversine formula
        Returns distance in kilometers
        """
        R = 6371  # Earth radius in km
        
        # Convert to radians
        lat1_rad = math.radians(lat1)
        lat2_rad = math.radians(lat2)
        dlat = math.radians(lat2 - lat1)
        dlon = math.radians(lon2 - lon1)
        
        # Haversine formula
        a = (math.sin(dlat/2) ** 2 + 
             math.cos(lat1_rad) * math.cos(lat2_rad) * 
             math.sin(dlon/2) ** 2)
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
        
        distance = R * c
        return round(distance, 2)
    
    @staticmethod
    def find_nearest_ambulances(patient_location: Dict, 
                               ambulance_list: List[Dict],
                               max_results: int = 3) -> List[Dict]:
        """
        Find nearest available ambulances
        Returns sorted list by distance
        """
        patient_lat = patient_location['latitude']
        patient_lon = patient_location['longitude']
        
        # Calculate distance for each ambulance
        for ambulance in ambulance_list:
            if ambulance.get('status') == 'AVAILABLE':
                amb_lat = ambulance['location']['latitude']
                amb_lon = ambulance['location']['longitude']
                
                distance = LocationService.calculate_distance(
                    patient_lat, patient_lon, amb_lat, amb_lon
                )
                ambulance['distance_km'] = distance
                ambulance['eta_minutes'] = LocationService.calculate_eta(distance)
        
        # Filter available ambulances and sort by distance
        available = [a for a in ambulance_list if a.get('status') == 'AVAILABLE']
        sorted_ambulances = sorted(available, key=lambda x: x.get('distance_km', float('inf')))
        
        return sorted_ambulances[:max_results]
    
    @staticmethod
    def calculate_eta(distance_km: float, avg_speed_kmh: float = 40) -> int:
        """Calculate ETA in minutes"""
        traffic_factor = 1.3  # Account for traffic
        time_hours = (distance_km / avg_speed_kmh) * traffic_factor
        return max(5, int(time_hours * 60))
    
    @staticmethod
    def get_route_coordinates(start: Dict, end: Dict) -> List[Dict]:
        """Get route coordinates for map display (simplified)"""
        # In production, use Google Maps API or similar
        return [
            {'latitude': start['latitude'], 'longitude': start['longitude']},
            {'latitude': end['latitude'], 'longitude': end['longitude']}
        ]


class OfflineDataCache:
    """Cache critical medical data for offline access"""
    
    def __init__(self):
        self.cache = {}
    
    def cache_patient_data(self, patient_id: str, data: Dict) -> None:
        """Cache essential patient data for offline access"""
        essential_data = {
            'patient_id': patient_id,
            'name': data.get('name'),
            'age': data.get('age'),
            'gender': data.get('gender'),
            'blood_group': data.get('blood_group'),
            'allergies': data.get('allergies', []),
            'chronic_conditions': data.get('chronic_conditions', []),
            'emergency_contact': data.get('emergency_contact'),
            'last_vitals': data.get('last_vitals', {}),
            'current_medications': data.get('current_medications', [])[:5],
            'cached_at': datetime.now().isoformat(),
            'cache_version': '1.0'
        }
        
        self.cache[patient_id] = essential_data
    
    def get_cached_data(self, patient_id: str) -> Optional[Dict]:
        """Retrieve cached patient data"""
        return self.cache.get(patient_id)
    
    def is_cache_valid(self, patient_id: str, max_age_hours: int = 24) -> bool:
        """Check if cached data is still valid"""
        if patient_id not in self.cache:
            return False
        
        cached_at = datetime.fromisoformat(self.cache[patient_id]['cached_at'])
        age_hours = (datetime.now() - cached_at).total_seconds() / 3600
        
        return age_hours < max_age_hours
    
    def export_cache(self) -> str:
        """Export cache as JSON for local storage"""
        return json.dumps(self.cache, indent=2)
    
    def import_cache(self, cache_json: str) -> None:
        """Import cache from JSON"""
        self.cache = json.loads(cache_json)


class OfflineEmergencyMode:
    """Handle emergencies in offline/low-connectivity scenarios"""
    
    def __init__(self):
        self.offline_queue = []
        self.cache = OfflineDataCache()
    
    def trigger_offline_emergency(self, patient_id: str, 
                                 location: Dict, vitals: Dict) -> Dict:
        """Trigger emergency in offline mode"""
        
        # Get cached patient data
        patient_data = self.cache.get_cached_data(patient_id)
        
        if not patient_data:
            patient_data = {
                'patient_id': patient_id,
                'name': 'Unknown',
                'cached_data_unavailable': True
            }
        
        # Create offline emergency record
        emergency = {
            'emergency_id': f"OFFLINE_{datetime.now().strftime('%Y%m%d%H%M%S')}",
            'patient_id': patient_id,
            'patient_data': patient_data,
            'location': location,
            'vitals': vitals,
            'timestamp': datetime.now().isoformat(),
            'status': 'PENDING_SYNC',
            'offline_mode': True
        }
        
        # Add to offline queue
        self.offline_queue.append(emergency)
        
        return {
            'success': True,
            'emergency_id': emergency['emergency_id'],
            'message': 'Emergency recorded offline. Will sync when connection restored.',
            'offline_mode': True,
            'cached_data_available': not patient_data.get('cached_data_unavailable', False)
        }
    
    def sync_offline_emergencies(self) -> List[Dict]:
        """Sync offline emergencies when connection restored"""
        synced = []
        
        for emergency in self.offline_queue:
            # In production, send to server
            emergency['status'] = 'SYNCED'
            emergency['synced_at'] = datetime.now().isoformat()
            synced.append(emergency)
        
        # Clear queue after sync
        self.offline_queue = []
        
        return synced
    
    def get_offline_emergency_summary(self, patient_id: str) -> Dict:
        """Get emergency summary from cached data"""
        cached_data = self.cache.get_cached_data(patient_id)
        
        if not cached_data:
            return {
                'available': False,
                'message': 'No cached data available for offline access'
            }
        
        return {
            'available': True,
            'patient_name': cached_data['name'],
            'age': cached_data['age'],
            'blood_group': cached_data['blood_group'],
            'allergies': cached_data['allergies'],
            'chronic_conditions': cached_data['chronic_conditions'],
            'emergency_contact': cached_data['emergency_contact'],
            'last_vitals': cached_data['last_vitals'],
            'data_freshness': cached_data['cached_at']
        }


class SMSFallbackSystem:
    """SMS-based emergency alert fallback for low connectivity"""
    
    @staticmethod
    def generate_emergency_sms(emergency: Dict) -> Dict:
        """Generate SMS alert for emergency"""
        patient = emergency['patient']
        location = emergency['location']
        
        # SMS to emergency contact
        emergency_contact_sms = {
            'to': patient.get('emergency_contact_phone'),
            'message': f"""EMERGENCY ALERT
{patient['name']} needs help!
Location: {location.get('address', 'GPS coordinates sent')}
Time: {datetime.now().strftime('%I:%M %p')}
Ambulance dispatched.
Track: [Link]"""
        }
        
        # SMS to ambulance
        ambulance_sms = {
            'to': emergency['ambulance'].get('phone'),
            'message': f"""EMERGENCY DISPATCH
Patient: {patient['name']}, {patient['age']}y
Location: {location.get('address')}
GPS: {location['latitude']}, {location['longitude']}
Blood Group: {patient.get('blood_group', 'Unknown')}
Allergies: {', '.join(patient.get('allergies', ['None']))}
Severity: {emergency['severity_score']}/10"""
        }
        
        # SMS to hospital
        hospital_sms = {
            'to': emergency['hospital'].get('phone'),
            'message': f"""INCOMING EMERGENCY
ETA: {emergency['ambulance']['eta_minutes']} min
Patient: {patient['name']}, {patient['age']}y
Severity: {emergency['severity_score']}/10
Prepare: {SMSFallbackSystem._get_bed_type(emergency['severity_score'])} bed"""
        }
        
        return {
            'emergency_contact': emergency_contact_sms,
            'ambulance': ambulance_sms,
            'hospital': hospital_sms,
            'sent_at': datetime.now().isoformat()
        }
    
    @staticmethod
    def _get_bed_type(severity: int) -> str:
        """Determine bed type from severity"""
        if severity >= 8:
            return 'ICU'
        elif severity >= 6:
            return 'HDU'
        else:
            return 'General'
    
    @staticmethod
    def send_sms(phone: str, message: str) -> Dict:
        """Send SMS (mock implementation)"""
        # In production, integrate with SMS gateway (Twilio, AWS SNS, etc.)
        return {
            'success': True,
            'to': phone,
            'message_length': len(message),
            'sent_at': datetime.now().isoformat(),
            'provider': 'SMS_GATEWAY',
            'cost': 0.05  # USD per SMS
        }


class NetworkStatusMonitor:
    """Monitor network connectivity status"""
    
    @staticmethod
    def check_connectivity() -> Dict:
        """Check current network status"""
        # In production, ping server or check actual connectivity
        return {
            'online': True,  # Mock value
            'connection_type': '4G',  # WiFi, 4G, 3G, 2G, Offline
            'signal_strength': 85,  # 0-100
            'latency_ms': 45,
            'timestamp': datetime.now().isoformat()
        }
    
    @staticmethod
    def is_low_connectivity() -> bool:
        """Check if connectivity is low"""
        status = NetworkStatusMonitor.check_connectivity()
        
        # Low connectivity if:
        # - Signal strength < 30%
        # - Latency > 1000ms
        # - Connection type is 2G
        
        return (status['signal_strength'] < 30 or 
                status['latency_ms'] > 1000 or 
                status['connection_type'] == '2G')
    
    @staticmethod
    def get_recommended_mode() -> str:
        """Get recommended operation mode based on connectivity"""
        if not NetworkStatusMonitor.check_connectivity()['online']:
            return 'OFFLINE_MODE'
        elif NetworkStatusMonitor.is_low_connectivity():
            return 'LOW_BANDWIDTH_MODE'
        else:
            return 'NORMAL_MODE'


# Example usage
if __name__ == "__main__":
    print("=== LOCATION SERVICE TEST ===")
    patient_loc = {'latitude': 28.6139, 'longitude': 77.2090}
    
    # Mock ambulance data
    ambulances = [
        {
            'id': 'AMB001',
            'type': 'ICU',
            'status': 'AVAILABLE',
            'location': {'latitude': 28.6200, 'longitude': 77.2150}
        },
        {
            'id': 'AMB002',
            'type': 'OXYGEN',
            'status': 'AVAILABLE',
            'location': {'latitude': 28.6100, 'longitude': 77.2000}
        }
    ]
    
    nearest = LocationService.find_nearest_ambulances(patient_loc, ambulances)
    print(f"Nearest ambulance: {nearest[0]['id']} - {nearest[0]['distance_km']} km away")
    
    print("\n=== OFFLINE MODE TEST ===")
    offline_system = OfflineEmergencyMode()
    
    # Cache patient data
    patient_data = {
        'name': 'Rajesh Kumar',
        'age': 58,
        'blood_group': 'O+',
        'allergies': ['Penicillin'],
        'emergency_contact': '9876543210'
    }
    offline_system.cache.cache_patient_data('P001', patient_data)
    
    # Trigger offline emergency
    result = offline_system.trigger_offline_emergency(
        'P001',
        patient_loc,
        {'spo2': 88, 'heart_rate': 135}
    )
    print(f"Offline emergency: {result}")
    
    print("\n=== SMS FALLBACK TEST ===")
    emergency = {
        'patient': {'name': 'Rajesh Kumar', 'age': 58, 'blood_group': 'O+',
                   'emergency_contact_phone': '9876543210'},
        'location': {'address': 'Sector 15, Noida'},
        'severity_score': 9,
        'ambulance': {'phone': '9876543211', 'eta_minutes': 8},
        'hospital': {'phone': '9876543212'}
    }
    
    sms_alerts = SMSFallbackSystem.generate_emergency_sms(emergency)
    print(f"SMS alerts generated: {len(sms_alerts)} messages")
    
    print("\n=== NETWORK STATUS TEST ===")
    status = NetworkStatusMonitor.check_connectivity()
    mode = NetworkStatusMonitor.get_recommended_mode()
    print(f"Network status: {status['connection_type']} - {status['signal_strength']}%")
    print(f"Recommended mode: {mode}")
