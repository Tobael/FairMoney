from typing import Annotated

from fastapi import APIRouter, Header

from src.models.responseModels.acounts_response_model import TransactionResponseModel
from src.requestHandler.accounting_handler import AccountingHandlerDependency

accounting_router = APIRouter(
    tags=["accounting"]
)


@accounting_router.get(path="/group/{group_id}/accounting/preview",
                       response_model=list[TransactionResponseModel])
async def get_accounting_preview(accounting_handler: AccountingHandlerDependency,
                                 group_id: str) -> list[TransactionResponseModel]:
    return await accounting_handler.get_accounting_preview(group_id=group_id)


@accounting_router.post(path="/group/{group_id}/accounting",
                        response_model=list[TransactionResponseModel])
async def create_accounting(accounting_handler: AccountingHandlerDependency,
                            group_id: str,
                            x_user_name: Annotated[str | None, Header()]) -> list[TransactionResponseModel]:
    return await accounting_handler.create_accounting(group_id=group_id,
                                                      user_name=x_user_name)
