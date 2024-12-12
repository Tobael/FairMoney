from enum import Enum


class EventType(Enum):
    """Enumeration for different types of events."""

    CREATED = "CREATED"
    PAYMENT = "PAYMENT"
    ACCOUTING = "ACCOUTING"
    CLOSED = "CLOSED"
