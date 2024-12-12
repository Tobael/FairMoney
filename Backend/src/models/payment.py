from datetime import datetime

from src.models.accounting import Accounting
from src.models.user import User


class Payment:
    """Payment model."""

    def __init__(self,
                 amount: float,
                 description: str,
                 paid_by: User,
                 participants: list[User],
                 created_at: datetime,
                 created_by: User,
                 balanced_by: Accounting = None,
                 uuid: str = None) -> None:
        self.uuid = uuid
        self.amount = amount
        self.description = description
        self.paid_by = paid_by
        self.participants = participants
        self.balanced_by = balanced_by
        self.created_at = created_at
        self.created_by = created_by

    def __str__(self) -> str:
        """
        Returns the string representation of the Payment object.

        Returns:
            str: The details of the payment.
        """
        return (f"{self.description} {'(Balanced)' if self.balanced_by is not None else ''} {self.paid_by} -> "
                f"({", ".join([str(participant) for participant in self.participants])}) ({self.amount} €) ")
