from abc import ABC, abstractmethod
from datetime import datetime

class PaymentStrategy(ABC):
    @abstractmethod
    def process_payment(self, payment_data):
        pass

class CardPaymentStrategy(PaymentStrategy):
    def process_payment(self, payment_data):
        try:
            # Validate card data
            if not self._validate_card_data(payment_data):
                return {"success": False, "error": "Invalid card data"}

            # In a real implementation, this would integrate with a payment gateway
            # For demo purposes, we'll simulate a successful payment
            return {
                "success": True,
                "transaction_id": f"CARD_{datetime.now().strftime('%Y%m%d%H%M%S')}",
                "payment_method": "card",
                "amount": payment_data["amount"],
                "payment_time": datetime.now(),
                "payment_date": datetime.now().strftime("%Y-%m-%d")
            }
        except Exception as e:
            print(f"Payment processing error: {str(e)}")
            return {"success": False, "error": str(e)}

    def _validate_card_data(self, payment_data):
        # Validate card number (16 digits)
        card_number = payment_data.get('card_number', '').replace(' ', '')
        if not card_number.isdigit() or len(card_number) != 16:
            return False

        # Validate card holder (not empty)
        if not payment_data.get('card_holder', '').strip():
            return False

        # Validate expiry date (MM/YY format)
        expiry = payment_data.get('expiry_date', '')
        if not expiry or len(expiry) != 5 or expiry[2] != '/':
            return False
        
        try:
            month, year = expiry.split('/')
            if not (month.isdigit() and year.isdigit()):
                return False
            month_num = int(month)
            if not (1 <= month_num <= 12):
                return False
        except:
            return False

        # All validations passed
        return True

class PaymentProcessor:
    def __init__(self, strategy: PaymentStrategy):
        self._strategy = strategy

    def process_payment(self, payment_data):
        return self._strategy.process_payment(payment_data)