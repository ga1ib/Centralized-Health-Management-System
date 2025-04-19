from abc import ABC, abstractmethod
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

class AuthSubject:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(AuthSubject, cls).__new__(cls)
            cls._instance._observers = []
        return cls._instance

    def attach(self, observer):
        if observer not in self._observers:
            self._observers.append(observer)
            logger.info(f"Observer {type(observer).__name__} attached")

    def detach(self, observer):
        try:
            self._observers.remove(observer)
            logger.info(f"Observer {type(observer).__name__} detached")
        except ValueError:
            logger.warning(f"Observer {type(observer).__name__} not found")

    def notify(self, event_type, user_email, details=None):
        logger.info(f"Notifying observers of event '{event_type}' for {user_email}")
        for observer in self._observers:
            try:
                observer.update(event_type, user_email, details)
            except Exception as e:
                logger.error(f"Error in observer {type(observer).__name__}: {str(e)}")

class AuthObserver(ABC):
    @abstractmethod
    def update(self, event_type, user_email, details=None):
        pass

class AuthLogger(AuthObserver):
    def update(self, event_type, user_email, details=None):
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        logger.info(f"[{timestamp}] {event_type} for {user_email}: {details or 'No additional details'}")

class EmailNotifier(AuthObserver):
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(EmailNotifier, cls).__new__(cls)
            cls._instance.mailer = None
        return cls._instance
    
    def set_mailer(self, mailer_function):
        self.mailer = mailer_function
        logger.info("Email mailer function set")
    
    def update(self, event_type, user_email, details=None):
        if event_type == "OTP_GENERATED" and details and "otp" in details:
            try:
                if not self.mailer:
                    raise Exception("Mailer not initialized")
                    
                logger.info(f"Sending OTP email to {user_email}")
                self.mailer(user_email, details["otp"])
                logger.info(f"OTP email sent successfully to {user_email}")
            except Exception as e:
                logger.error(f"Failed to send OTP email to {user_email}: {str(e)}")
                raise Exception(f"Failed to send OTP: {str(e)}")