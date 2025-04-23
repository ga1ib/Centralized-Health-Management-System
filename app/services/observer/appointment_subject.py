from .subject import Subject

class AppointmentSubject(Subject):
    def __init__(self):
        super().__init__()
        self._status = None
        
    def set_status(self, appointment_id, old_status, new_status):
        self._status = new_status
        self.notify(appointment_id, old_status, new_status)
        
    def get_status(self):
        return self._status

    def notify_creation(self, appointment_data):
        # Notify observers about new appointment creation
        self.notify("creation", None, appointment_data)