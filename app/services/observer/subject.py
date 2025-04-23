from abc import ABC, abstractmethod

class Subject:
    def __init__(self):
        self._observers = []
    
    def attach(self, observer):
        if observer not in self._observers:
            self._observers.append(observer)
    
    def detach(self, observer):
        self._observers.remove(observer)
    
    def notify(self, event_type, old_value, new_value):
        for observer in self._observers:
            observer.update(event_type, old_value, new_value)