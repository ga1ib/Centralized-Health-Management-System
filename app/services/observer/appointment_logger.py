from .observer import Observer
from datetime import datetime

class AppointmentLogger(Observer):
    def update(self, appointment_id, old_status, new_status):
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        print(f"[{timestamp}] Appointment {appointment_id} status changed from {old_status} to {new_status}")