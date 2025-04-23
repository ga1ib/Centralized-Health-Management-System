from app.models.appointment_model import AppointmentModel
from datetime import datetime

class AppointmentFactory:
    @staticmethod
    def create_appointment(data):
        """
        Factory method to create different types of appointments based on status
        """
        # Create base appointment
        appointment = AppointmentModel(
            patient_email=data.get("patient_email"),
            doctor_email=data.get("doctor_email"),
            date=data.get("date"),
            time=data.get("time"),
            status=data.get("status", "pending")
        )
        
        # Add additional fields
        appointment.patient_name = data.get("patient_name")
        appointment.doctor_name = data.get("doctor_name")
        appointment.payment_id = data.get("payment_id")
        
        # Set priority based on status
        if data.get("status") == "urgent":
            appointment.priority = "high"
        elif data.get("status") == "Scheduled":
            appointment.priority = "normal"
        
        # Add timestamps
        current_time = datetime.now()
        appointment.created_at = current_time
        appointment.updated_at = current_time
        
        return appointment