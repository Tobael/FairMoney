from pydantic import BaseModel


class UserRequestModel(BaseModel):
    """User request model."""

    name: str
    paypal_me: str = ""
