from datetime import datetime

from pydantic import BaseModel

from src.models.enumerations.event_types import EventType
from src.models.responseModels.acounts_response_model import TransactionResponseModel


class PaymentDetailResponseModel(BaseModel):
    """Payment detail response model."""

    amount: float
    description: str
    paid_by: str
    participants: list[str]


class GroupHistoryResponseModel(BaseModel):
    """Group history response model."""

    type: EventType
    creator: str
    datetime: datetime
    details: PaymentDetailResponseModel | list[TransactionResponseModel] | None


class PaymentResponseModel(BaseModel):
    """Payment response model."""

    description: str
    amount: float


class UserResponseModel(BaseModel):
    """User response model."""

    user_name: str
    sum_amount: float
    payments: list[PaymentResponseModel]


class GroupResponseModel(BaseModel):
    """Group response model."""

    uuid: str
    title: str
    users: list[UserResponseModel]
    closed: bool
