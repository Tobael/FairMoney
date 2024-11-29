from pydantic import BaseModel


class UserRequestModel(BaseModel):
    name: str
    paypal_me: str = ""


class GroupCreateRequestModel(BaseModel):
    title: str
    users: list[UserRequestModel]
