from datetime import datetime

class BillingModel:
    def __init__(self, patient_email, patient_name, doctor_email, doctor_name, amount, 
                 card_number, card_holder, expiry_date, schedule_date, schedule_time,
                 payment_date=None, payment_time=None, payment_status="pending", transaction_id=None):
        self.patient_email = patient_email
        self.patient_name = patient_name
        self.doctor_email = doctor_email
        self.doctor_name = doctor_name
        self.amount = amount
        # Mask all but last 4 digits of card number
        self.card_number = "*" * 12 + card_number[-4:] if card_number else None
        self.card_holder = card_holder
        self.expiry_date = expiry_date
        self.schedule_date = schedule_date
        self.schedule_time = schedule_time
        self.payment_date = payment_date or datetime.now().strftime("%Y-%m-%d")
        self.payment_time = payment_time or datetime.now().strftime("%H:%M:%S")
        self.payment_status = payment_status
        self.transaction_id = transaction_id
        self.created_at = datetime.now()

    def to_dict(self):
        return {
            "patient_email": self.patient_email,
            "patient_name": self.patient_name,
            "doctor_email": self.doctor_email,
            "doctor_name": self.doctor_name,
            "amount": self.amount,
            "card_number": self.card_number,
            "card_holder": self.card_holder,
            "expiry_date": self.expiry_date,
            "schedule_date": self.schedule_date,
            "schedule_time": self.schedule_time,
            "payment_date": self.payment_date,
            "payment_time": self.payment_time,
            "payment_status": self.payment_status,
            "transaction_id": self.transaction_id,
            "created_at": self.created_at
        }