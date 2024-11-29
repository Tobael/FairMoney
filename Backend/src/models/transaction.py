from src.models.user import User


class Transaction:
    def __init__(self,
                 payment_from: User,
                 payment_to: User,
                 amount: float,
                 uuid: str = None) -> None:
        self.uuid = uuid
        self.payment_from = payment_from
        self.payment_to = payment_to
        self.amount = amount
