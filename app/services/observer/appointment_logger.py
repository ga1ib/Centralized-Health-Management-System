from .observer import Observer
from datetime import datetime

class AppointmentLogger(Observer):
    def update(self, event_type, old_value, new_value):
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        if event_type == "creation":
            print(f"[{timestamp}] New appointment created: {new_value}")
        else:
            # Handle status change events
            print(f"[{timestamp}] Appointment {event_type} status changed from {old_value} to {new_value}")