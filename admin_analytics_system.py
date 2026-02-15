"""
ADMIN ANALYTICS & MONITORING SYSTEM
Real-time KPIs + Performance tracking + Outcome analysis
"""

from datetime import datetime, timedelta
from typing import Dict, List
from collections import defaultdict
import statistics

class EmergencyResponseAnalytics:
    """Track emergency response performance"""
    
    def __init__(self):
        self.response_times = []
        self.emergencies = []
    
    def record_emergency(self, emergency: Dict) -> None:
        """Record emergency for analytics"""
        self.emergencies.append(emergency)
        
        if emergency.get('resolved_at'):
            response_time = self._calculate_response_time(
                emergency['created_at'],
                emergency['resolved_at']
            )
            self.response_times.append(response_time)
    
    def _calculate_response_time(self, start: str, end: str) -> float:
        """Calculate response time in minutes"""
        start_dt = datetime.fromisoformat(start)
        end_dt = datetime.fromisoformat(end)
        return (end_dt - start_dt).total_seconds() / 60
    
    def get_average_response_time(self, period_days: int = 7) -> Dict:
        """Get average response time"""
        if not self.response_times:
            return {'average_minutes': 0, 'sample_size': 0}
        
        return {
            'average_minutes': round(statistics.mean(self.response_times), 2),
            'median_minutes': round(statistics.median(self.response_times), 2),
            'min_minutes': round(min(self.response_times), 2),
            'max_minutes': round(max(self.response_times), 2),
            'sample_size': len(self.response_times),
            'period_days': period_days
        }
    
    def get_response_time_distribution(self) -> Dict:
        """Get response time distribution"""
        if not self.response_times:
            return {}
        
        distribution = {
            'under_10_min': 0,
            '10_20_min': 0,
            '20_30_min': 0,
            'over_30_min': 0
        }
        
        for time in self.response_times:
            if time < 10:
                distribution['under_10_min'] += 1
            elif time < 20:
                distribution['10_20_min'] += 1
            elif time < 30:
                distribution['20_30_min'] += 1
            else:
                distribution['over_30_min'] += 1
        
        # Convert to percentages
        total = len(self.response_times)
        return {
            key: round((count / total) * 100, 1)
            for key, count in distribution.items()
        }
    
    def get_severity_distribution(self) -> Dict:
        """Get distribution of emergency severities"""
        severity_counts = defaultdict(int)
        
        for emergency in self.emergencies:
            severity = emergency.get('severity_score', 0)
            if severity >= 8:
                severity_counts['critical'] += 1
            elif severity >= 6:
                severity_counts['high'] += 1
            elif severity >= 4:
                severity_counts['medium'] += 1
            else:
                severity_counts['low'] += 1
        
        total = len(self.emergencies)
        if total == 0:
            return {}
        
        return {
            key: {
                'count': count,
                'percentage': round((count / total) * 100, 1)
            }
            for key, count in severity_counts.items()
        }


class AIAccuracyTracker:
    """Track AI prediction accuracy"""
    
    def __init__(self):
        self.predictions = []
    
    def record_prediction(self, predicted_risk: str, actual_outcome: str,
                         confidence: float) -> None:
        """Record AI prediction and actual outcome"""
        self.predictions.append({
            'predicted_risk': predicted_risk,
            'actual_outcome': actual_outcome,
            'confidence': confidence,
            'correct': predicted_risk == actual_outcome,
            'timestamp': datetime.now().isoformat()
        })
    
    def get_accuracy_metrics(self) -> Dict:
        """Calculate AI accuracy metrics"""
        if not self.predictions:
            return {'accuracy': 0, 'sample_size': 0}
        
        correct = sum(1 for p in self.predictions if p['correct'])
        total = len(self.predictions)
        
        # Calculate accuracy by risk level
        by_risk = defaultdict(lambda: {'correct': 0, 'total': 0})
        for pred in self.predictions:
            risk = pred['predicted_risk']
            by_risk[risk]['total'] += 1
            if pred['correct']:
                by_risk[risk]['correct'] += 1
        
        risk_accuracy = {
            risk: round((data['correct'] / data['total']) * 100, 1)
            for risk, data in by_risk.items()
        }
        
        # Calculate confidence calibration
        avg_confidence = statistics.mean(p['confidence'] for p in self.predictions)
        
        return {
            'overall_accuracy': round((correct / total) * 100, 1),
            'accuracy_by_risk': risk_accuracy,
            'average_confidence': round(avg_confidence, 2),
            'sample_size': total,
            'false_positives': self._count_false_positives(),
            'false_negatives': self._count_false_negatives()
        }
    
    def _count_false_positives(self) -> int:
        """Count false positives (predicted high, actual low)"""
        return sum(1 for p in self.predictions 
                  if p['predicted_risk'] in ['High', 'Medium'] and 
                  p['actual_outcome'] == 'Low')
    
    def _count_false_negatives(self) -> int:
        """Count false negatives (predicted low, actual high)"""
        return sum(1 for p in self.predictions 
                  if p['predicted_risk'] == 'Low' and 
                  p['actual_outcome'] in ['High', 'Medium'])


class AmbulanceUtilizationTracker:
    """Track ambulance utilization and efficiency"""
    
    def __init__(self):
        self.ambulances = {}
        self.trips = []
    
    def register_ambulance(self, ambulance_id: str, ambulance_type: str) -> None:
        """Register ambulance for tracking"""
        self.ambulances[ambulance_id] = {
            'id': ambulance_id,
            'type': ambulance_type,
            'total_trips': 0,
            'total_distance_km': 0,
            'total_time_hours': 0,
            'status': 'AVAILABLE'
        }
    
    def record_trip(self, ambulance_id: str, trip_data: Dict) -> None:
        """Record ambulance trip"""
        if ambulance_id not in self.ambulances:
            return
        
        self.trips.append({
            'ambulance_id': ambulance_id,
            'distance_km': trip_data['distance_km'],
            'duration_minutes': trip_data['duration_minutes'],
            'severity': trip_data['severity'],
            'timestamp': datetime.now().isoformat()
        })
        
        # Update ambulance stats
        amb = self.ambulances[ambulance_id]
        amb['total_trips'] += 1
        amb['total_distance_km'] += trip_data['distance_km']
        amb['total_time_hours'] += trip_data['duration_minutes'] / 60
    
    def get_utilization_metrics(self) -> Dict:
        """Get ambulance utilization metrics"""
        if not self.ambulances:
            return {}
        
        total_ambulances = len(self.ambulances)
        active_ambulances = sum(1 for a in self.ambulances.values() 
                               if a['total_trips'] > 0)
        
        # Calculate average trips per ambulance
        total_trips = sum(a['total_trips'] for a in self.ambulances.values())
        avg_trips = total_trips / total_ambulances if total_ambulances > 0 else 0
        
        # Calculate utilization by type
        by_type = defaultdict(lambda: {'count': 0, 'trips': 0})
        for amb in self.ambulances.values():
            by_type[amb['type']]['count'] += 1
            by_type[amb['type']]['trips'] += amb['total_trips']
        
        utilization_by_type = {
            amb_type: {
                'total_ambulances': data['count'],
                'total_trips': data['trips'],
                'avg_trips_per_ambulance': round(data['trips'] / data['count'], 1)
            }
            for amb_type, data in by_type.items()
        }
        
        return {
            'total_ambulances': total_ambulances,
            'active_ambulances': active_ambulances,
            'utilization_rate': round((active_ambulances / total_ambulances) * 100, 1),
            'total_trips': total_trips,
            'avg_trips_per_ambulance': round(avg_trips, 1),
            'utilization_by_type': utilization_by_type
        }
    
    def get_efficiency_metrics(self) -> Dict:
        """Get ambulance efficiency metrics"""
        if not self.trips:
            return {}
        
        avg_distance = statistics.mean(t['distance_km'] for t in self.trips)
        avg_duration = statistics.mean(t['duration_minutes'] for t in self.trips)
        
        return {
            'average_distance_km': round(avg_distance, 2),
            'average_duration_minutes': round(avg_duration, 1),
            'total_distance_km': round(sum(t['distance_km'] for t in self.trips), 2),
            'total_trips': len(self.trips)
        }


class PatientOutcomeTracker:
    """Track patient outcomes (simulated for demo)"""
    
    def __init__(self):
        self.outcomes = []
    
    def record_outcome(self, patient_id: str, emergency_id: str,
                      severity: int, outcome: str) -> None:
        """Record patient outcome"""
        self.outcomes.append({
            'patient_id': patient_id,
            'emergency_id': emergency_id,
            'severity': severity,
            'outcome': outcome,  # 'RECOVERED', 'STABLE', 'CRITICAL', 'DECEASED'
            'timestamp': datetime.now().isoformat()
        })
    
    def get_outcome_statistics(self) -> Dict:
        """Get outcome statistics"""
        if not self.outcomes:
            return {}
        
        outcome_counts = defaultdict(int)
        for outcome in self.outcomes:
            outcome_counts[outcome['outcome']] += 1
        
        total = len(self.outcomes)
        
        # Calculate survival rate (recovered + stable)
        survival_count = (outcome_counts['RECOVERED'] + outcome_counts['STABLE'])
        survival_rate = (survival_count / total) * 100 if total > 0 else 0
        
        # Outcomes by severity
        by_severity = defaultdict(lambda: defaultdict(int))
        for outcome in self.outcomes:
            severity_level = 'HIGH' if outcome['severity'] >= 7 else 'MEDIUM' if outcome['severity'] >= 4 else 'LOW'
            by_severity[severity_level][outcome['outcome']] += 1
        
        return {
            'total_cases': total,
            'survival_rate': round(survival_rate, 1),
            'outcome_distribution': dict(outcome_counts),
            'outcomes_by_severity': dict(by_severity)
        }


class DashboardDataGenerator:
    """Generate dashboard data for admin panel"""
    
    def __init__(self):
        self.emergency_analytics = EmergencyResponseAnalytics()
        self.ai_tracker = AIAccuracyTracker()
        self.ambulance_tracker = AmbulanceUtilizationTracker()
        self.outcome_tracker = PatientOutcomeTracker()
    
    def generate_dashboard_data(self) -> Dict:
        """Generate complete dashboard data"""
        return {
            'timestamp': datetime.now().isoformat(),
            'emergency_response': {
                'average_response_time': self.emergency_analytics.get_average_response_time(),
                'response_time_distribution': self.emergency_analytics.get_response_time_distribution(),
                'severity_distribution': self.emergency_analytics.get_severity_distribution()
            },
            'ai_performance': self.ai_tracker.get_accuracy_metrics(),
            'ambulance_utilization': {
                'utilization': self.ambulance_tracker.get_utilization_metrics(),
                'efficiency': self.ambulance_tracker.get_efficiency_metrics()
            },
            'patient_outcomes': self.outcome_tracker.get_outcome_statistics(),
            'system_health': {
                'uptime_percentage': 99.8,
                'api_response_time_ms': 45,
                'active_users': 1250,
                'active_emergencies': 3
            }
        }
    
    def generate_sample_chart_data(self) -> Dict:
        """Generate sample data for charts"""
        # Last 7 days emergency trend
        emergency_trend = [
            {'date': '2026-01-19', 'count': 12, 'critical': 3},
            {'date': '2026-01-20', 'count': 15, 'critical': 4},
            {'date': '2026-01-21', 'count': 10, 'critical': 2},
            {'date': '2026-01-22', 'count': 18, 'critical': 5},
            {'date': '2026-01-23', 'count': 14, 'critical': 3},
            {'date': '2026-01-24', 'count': 16, 'critical': 4},
            {'date': '2026-01-25', 'count': 13, 'critical': 3}
        ]
        
        # Response time trend
        response_time_trend = [
            {'date': '2026-01-19', 'avg_minutes': 12.5},
            {'date': '2026-01-20', 'avg_minutes': 11.8},
            {'date': '2026-01-21', 'avg_minutes': 13.2},
            {'date': '2026-01-22', 'avg_minutes': 10.9},
            {'date': '2026-01-23', 'avg_minutes': 12.1},
            {'date': '2026-01-24', 'avg_minutes': 11.5},
            {'date': '2026-01-25', 'avg_minutes': 12.0}
        ]
        
        # AI accuracy trend
        ai_accuracy_trend = [
            {'date': '2026-01-19', 'accuracy': 87.5},
            {'date': '2026-01-20', 'accuracy': 88.2},
            {'date': '2026-01-21', 'accuracy': 89.1},
            {'date': '2026-01-22', 'accuracy': 88.8},
            {'date': '2026-01-23', 'accuracy': 90.2},
            {'date': '2026-01-24', 'accuracy': 89.5},
            {'date': '2026-01-25', 'accuracy': 90.8}
        ]
        
        return {
            'emergency_trend': emergency_trend,
            'response_time_trend': response_time_trend,
            'ai_accuracy_trend': ai_accuracy_trend
        }


# Example usage
if __name__ == "__main__":
    print("=== ADMIN ANALYTICS DEMO ===\n")
    
    dashboard = DashboardDataGenerator()
    
    # Simulate some data
    print("Simulating emergency data...")
    for i in range(10):
        dashboard.emergency_analytics.record_emergency({
            'created_at': (datetime.now() - timedelta(minutes=30)).isoformat(),
            'resolved_at': datetime.now().isoformat(),
            'severity_score': 7 + (i % 3)
        })
    
    print("Simulating AI predictions...")
    for i in range(20):
        dashboard.ai_tracker.record_prediction(
            'High' if i % 3 == 0 else 'Medium',
            'High' if i % 4 == 0 else 'Medium',
            0.85 + (i % 10) / 100
        )
    
    print("Simulating ambulance trips...")
    dashboard.ambulance_tracker.register_ambulance('AMB001', 'ICU')
    dashboard.ambulance_tracker.register_ambulance('AMB002', 'OXYGEN')
    for i in range(5):
        dashboard.ambulance_tracker.record_trip('AMB001', {
            'distance_km': 5 + i,
            'duration_minutes': 15 + i * 2,
            'severity': 8
        })
    
    print("\n=== DASHBOARD DATA ===")
    data = dashboard.generate_dashboard_data()
    
    print(f"\nEmergency Response:")
    print(f"  Average Response Time: {data['emergency_response']['average_response_time']['average_minutes']} min")
    
    print(f"\nAI Performance:")
    print(f"  Accuracy: {data['ai_performance']['overall_accuracy']}%")
    
    print(f"\nAmbulance Utilization:")
    print(f"  Utilization Rate: {data['ambulance_utilization']['utilization']['utilization_rate']}%")
    
    print(f"\nSystem Health:")
    print(f"  Uptime: {data['system_health']['uptime_percentage']}%")
    print(f"  Active Users: {data['system_health']['active_users']}")
