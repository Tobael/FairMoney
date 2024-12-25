from pydantic import BaseModel


class TransactionResponseModel(BaseModel):
    """Transaction response model."""

    payment_from: str
    payment_to: str
    amount: float
