from pydantic import BaseModel


class UserRequestModel(BaseModel):
    """User request model."""

    name: str
    paypal_me: str = ""


class GroupCreateRequestModel(BaseModel):
    """Group create request model."""

    title: str
    users: list[UserRequestModel]
