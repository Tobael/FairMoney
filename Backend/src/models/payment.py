from datetime import datetime

from src.models.accounting import Accounting
from src.models.user import User


class Payment:
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
