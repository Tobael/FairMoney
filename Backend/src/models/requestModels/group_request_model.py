from pydantic import BaseModel

from models.requestModels.user_request_model import UserRequestModel


class GroupCreateRequestModel(BaseModel):
    """Group create request model."""

    title: str
    users: list[UserRequestModel]
