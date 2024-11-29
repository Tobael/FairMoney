from pydantic import BaseModel


class TransactionResponseModel(BaseModel):
    payment_from: str
    payment_to: str
    amount: float
