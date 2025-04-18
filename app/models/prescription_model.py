from datetime import datetime

class PrescriptionModel:
    def __init__(self, blood_pressure, heart_rate, temperature, symptoms, disease, medicines, doctor_email, created_at=None):
        self.blood_pressure = blood_pressure
        self.heart_rate = heart_rate
        self.temperature = temperature
        self.symptoms = symptoms
        self.disease = disease
        self.medicines = medicines  # List of dicts: [{medicine, timetable}]
        self.doctor_email = doctor_email
        self.created_at = created_at or datetime.now().isoformat()

    def to_dict(self):
        return {
            "blood_pressure": self.blood_pressure,
            "heart_rate": self.heart_rate,
            "temperature": self.temperature,
            "symptoms": self.symptoms,
            "disease": self.disease,
            "medicines": self.medicines,
            "doctor_email": self.doctor_email,
            "created_at": self.created_at
        }
