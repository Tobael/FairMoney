from pydantic import BaseModel


class PaymentRequestModel(BaseModel):
    """Payment request model."""

    description: str
    paid_by: str
    participants: list[str]
    amount: float
