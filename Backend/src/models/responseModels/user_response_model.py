from pydantic import BaseModel

from models.responseModels.payment_response_model import PaymentResponseModel


class UserResponseModel(BaseModel):
    """User response model."""

    user_name: str
    paypal_me: str
    sum_amount: float
    payments: list[PaymentResponseModel]
