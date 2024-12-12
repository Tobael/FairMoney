from datetime import datetime

from src.models.accounting import Accounting
from src.models.payment import Payment
from src.models.user import User


class Group:
    def __init__(self,
                 title: str,
                 closed: bool,
                 payments: list[Payment],
                 accountings: list[Accounting],
                 users: list[User],
                 created_at: datetime,
                 created_by: User,
                 closed_at: datetime = None,
                 closed_by: User = None,
                 uuid: str = None) -> None:
        self.uuid = uuid
        self.title = title
        self.closed = closed
        self.payments = payments
        self.accountings = accountings
        self.users = users

        self.created_at = created_at
        self.created_by = created_by

        self.closed_at = closed_at
        self.closed_by = closed_by

    def __str__(self) -> str:
        return (f"{self.title} {'(Closed)' if self.closed else ''} (User: {len(self.users)}, "
                f"Payments: {len(self.payments)}, Accountings: {len(self.accountings)})")
