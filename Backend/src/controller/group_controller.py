from typing import Annotated

from fastapi import APIRouter, Header

from src.models.requestModels.group_request_model import GroupCreateRequestModel
from src.models.responseModels.group_response_model import GroupHistoryResponseModel, GroupResponseModel
from src.requestHandler.group_handler import GroupHandlerDependency

group_router = APIRouter(
    tags=["group"]
)


@group_router.get(path="/group/{group_id}",
                  response_model=GroupResponseModel)
async def get_group(group_handler: GroupHandlerDependency,
                    group_id: str) -> GroupResponseModel:
    return await group_handler.get_group(group_id=group_id)


@group_router.post(path="/group",
                   response_model=None)
async def create_group(group_handler: GroupHandlerDependency,
                       request_model: GroupCreateRequestModel,
                       x_user_name: Annotated[str | None, Header()]) -> GroupResponseModel:
    return await group_handler.create_group(request_model=request_model,
                                            user_name=x_user_name)


@group_router.put(path="/group/{group_id}/close",
                  response_model=None)
async def close_group(group_handler: GroupHandlerDependency,
                      group_id: str,
                      x_user_name: Annotated[str | None, Header()]) -> None:
    return await group_handler.close_group(group_id=group_id,
                                           user_name=x_user_name)


@group_router.get(path="/group/{group_id}/history",
                  response_model=list[GroupHistoryResponseModel])
async def get_group_history(group_handler: GroupHandlerDependency,
                            group_id: str) -> list[GroupHistoryResponseModel]:
    return await group_handler.get_group_history(group_id=group_id)
