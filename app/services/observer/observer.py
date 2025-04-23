from abc import ABC, abstractmethod

class Observer(ABC):
    @abstractmethod
    def update(self, event_type, old_value, new_value):
        pass