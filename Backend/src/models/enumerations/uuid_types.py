from enum import Enum


class UniqueIdType(Enum):
    """Enumeration for different types of UUIDs."""

    Group = "group"
    USER = "user"
    PAYMENT = "payment"
    ACCOUNTING = "accounting"
    TRANSACTION = "transaction"
