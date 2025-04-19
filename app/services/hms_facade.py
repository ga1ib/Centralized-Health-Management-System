from app.services.db_connection import DatabaseConnection

class HMSFacade:
    def __init__(self):
        self.db = DatabaseConnection().get_database()

    def get_doctor_patient_records(self, doctor_email):
        # Returns appointments with status 'visited' or 'completed' for a doctor
        return list(self.db["Appointments"].find(
            {
                "doctor_email": doctor_email,
                "status": {"$in": ["visited", "completed"]}
            },
            {"_id": 0}
        ))

    def get_patient_prescriptions(self, doctor_email, patient_email):
        # Returns all prescriptions for a patient by a doctor
        return list(self.db["Prescriptions"].find(
            {
                "doctor_email": doctor_email,
                "patient_email": patient_email
            },
            {"_id": 0}
        ))
