from enum import Enum


class EventType(Enum):
    CREATED = "CREATED"
    PAYMENT = "PAYMENT"
    ACCOUTING = "ACCOUTING"
    CLOSED = "CLOSED"
