from datetime import datetime

from pydantic import BaseModel

from src.models.enumerations.event_types import EventType
from src.models.responseModels.acounts_response_model import TransactionResponseModel


class PaymentDetailResponseModel(BaseModel):
    amount: float
    description: str
    paid_by: str
    participants: list[str]


class GroupHistoryResponseModel(BaseModel):
    type: EventType
    creator: str
    datetime: datetime
    details: PaymentDetailResponseModel | list[TransactionResponseModel] | None


class PaymentResponseModel(BaseModel):
    description: str
    amount: float


class UserResponseModel(BaseModel):
    user_name: str
    sum_amount: float
    payments: list[PaymentResponseModel]


class GroupResponseModel(BaseModel):
    uuid: str
    title: str
    users: list[UserResponseModel]
    closed: bool
