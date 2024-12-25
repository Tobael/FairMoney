from datetime import datetime

from pydantic import BaseModel

from models.enumerations.event_types import EventType
from models.responseModels.payment_response_model import PaymentDetailResponseModel
from models.responseModels.transaction_response_model import TransactionResponseModel
from models.responseModels.user_response_model import UserResponseModel


class GroupHistoryResponseModel(BaseModel):
    """Group history response model."""

    type: EventType
    creator: str
    datetime: datetime
    details: PaymentDetailResponseModel | list[TransactionResponseModel] | None


class GroupResponseModel(BaseModel):
    """Group response model."""

    uuid: str
    title: str
    users: list[UserResponseModel]
    closed: bool
