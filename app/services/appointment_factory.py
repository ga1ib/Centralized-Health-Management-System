from app.models.appointment_model import AppointmentModel
from datetime import datetime

class AppointmentFactory:
    @staticmethod
    def create_appointment(data):
        """
        Factory method to create different types of appointments based on status
        """
        appointment = AppointmentModel(
            patient_email=data.get("patient_email"),
            doctor_email=data.get("doctor_email"),
            date=data.get("date"),
            time=data.get("time"),
            status=data.get("status", "pending")
        )
        
        # Additional initialization based on status
        if data.get("status") == "urgent":
            appointment.priority = "high"
        elif data.get("status") == "regular":
            appointment.priority = "normal"
        
        # Add timestamps
        appointment.created_at = datetime.now()
        appointment.updated_at = datetime.now()
        
        return appointment