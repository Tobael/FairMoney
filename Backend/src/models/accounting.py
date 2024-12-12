from datetime import datetime

from src.models.transaction import Transaction
from src.models.user import User


class Accounting:
    """Accounting model."""

    def __init__(self,
                 transactions: list[Transaction],
                 created_at: datetime,
                 created_by: User,
                 uuid: str = None) -> None:
        self.uuid = uuid
        self.transactions = transactions
        self.created_at = created_at
        self.created_by = created_by

    def __str__(self) -> str:
        """
        Returns the string representation of the Accounting object.

        Returns:
            str: The details of the accounting.
        """
        return " | ".join([str(transaction) for transaction in self.transactions])
