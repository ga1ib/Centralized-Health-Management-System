from datetime import datetime

class AppointmentModel:
    def __init__(self, patient_email, doctor_email, date, time, status="pending"):
        self.patient_email = patient_email
        self.doctor_email = doctor_email
        self.date = date
        self.time = time
        self.status = status
        self.priority = "normal"  # Default priority
        self.created_at = datetime.now()
        self.updated_at = datetime.now()
        self.payment_id = None  # Added payment_id field
        self.patient_name = None  # Added patient_name field
        self.doctor_name = None  # Added doctor_name field

    def to_dict(self):
        return {
            "patient_email": self.patient_email,
            "patient_name": self.patient_name,
            "doctor_email": self.doctor_email,
            "doctor_name": self.doctor_name,
            "date": self.date,
            "time": self.time,
            "status": self.status,
            "priority": self.priority,
            "payment_id": self.payment_id,
            "created_at": self.created_at,
            "updated_at": self.updated_at
        }

    @staticmethod
    def from_dict(data):
        appointment = AppointmentModel(
            patient_email=data.get("patient_email"),
            doctor_email=data.get("doctor_email"),
            date=data.get("date"),
            time=data.get("time"),
            status=data.get("status", "pending")
        )
        appointment.patient_name = data.get("patient_name")
        appointment.doctor_name = data.get("doctor_name")
        appointment.payment_id = data.get("payment_id")
        if "priority" in data:
            appointment.priority = data["priority"]
        if "created_at" in data:
            appointment.created_at = data["created_at"]
        if "updated_at" in data:
            appointment.updated_at = data["updated_at"]
        return appointment