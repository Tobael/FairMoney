from datetime import datetime

from src.models.transaction import Transaction
from src.models.user import User


class Accounting:
    def __init__(self,
                 transactions: list[Transaction],
                 created_at: datetime,
                 created_by: User,
                 uuid: str = None) -> None:
        self.uuid = uuid
        self.transactions = transactions
        self.created_at = created_at
        self.created_by = created_by
