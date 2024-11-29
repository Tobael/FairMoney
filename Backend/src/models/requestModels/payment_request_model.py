from pydantic import BaseModel


class PaymentRequestModel(BaseModel):
    description: str
    paid_by: str
    participants: list[str]
    amount: float
