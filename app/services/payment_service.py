from abc import ABC, abstractmethod
from datetime import datetime

class PaymentStrategy(ABC):
    @abstractmethod
    def process_payment(self, payment_data):
        pass

class CardPaymentStrategy(PaymentStrategy):
    def process_payment(self, payment_data):
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

class PaymentProcessor:
    def __init__(self, strategy: PaymentStrategy):
        self._strategy = strategy

    def process_payment(self, payment_data):
        return self._strategy.process_payment(payment_data)