from pydantic import BaseModel


class PaymentDetailResponseModel(BaseModel):
    """Payment detail response model."""

    amount: float
    description: str
    paid_by: str
    participants: list[str]


class PaymentResponseModel(BaseModel):
    """Payment response model."""

    description: str
    amount: float
