from datetime import datetime

class AppointmentModel:
    def __init__(self, patient_email, doctor_email, date, time, status="pending"):
        self.patient_email = patient_email
        self.doctor_email = doctor_email
        self.date = date
        self.time = time
        self.status = status
        self.created_at = datetime.now()
        self.updated_at = datetime.now()

    def to_dict(self):
        return {
            "patient_email": self.patient_email,
            "doctor_email": self.doctor_email,
            "date": self.date,
            "time": self.time,
            "status": self.status,
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
        if "created_at" in data:
            appointment.created_at = data["created_at"]
        if "updated_at" in data:
            appointment.updated_at = data["updated_at"]
        return appointment