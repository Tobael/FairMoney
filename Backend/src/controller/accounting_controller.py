from typing import Annotated

from fastapi import APIRouter, Header

from models.responseModels.acounts_response_model import TransactionResponseModel
from requestHandler.accounting_handler import AccountingHandlerDependency

accounting_router = APIRouter(
    tags=["accounting"]
)


@accounting_router.get(path="/group/{group_id}/accounting/preview",
                       response_model=list[TransactionResponseModel])
async def get_accounting_preview(accounting_handler: AccountingHandlerDependency,
                                 group_id: str) -> list[TransactionResponseModel]:
    """
    Retrieves a preview of the accounting for a group.

    Args:
        accounting_handler (AccountingHandlerDependency): The handler that manages accounting operations.
        group_id (str): The ID of the group for which to retrieve the accounting preview.

    Returns:
        list[TransactionResponseModel]: A list of transaction response models representing the accounting preview.
    """
    return await accounting_handler.get_accounting_preview(group_id=group_id)


@accounting_router.post(path="/group/{group_id}/accounting",
                        response_model=list[TransactionResponseModel])
async def create_accounting(accounting_handler: AccountingHandlerDependency,
                            group_id: str,
                            x_user_name: Annotated[str | None, Header()]) -> list[TransactionResponseModel]:
    """
    Creates accounting entries for a group.

    Args:
        accounting_handler (AccountingHandlerDependency): The handler that manages accounting operations.
        group_id (str): The ID of the group for which to create accounting entries.
        x_user_name (Annotated[str | None, Header]): Header to specify the user name for accounting creation.

    Returns:
        list[TransactionResponseModel]: List of transaction response models representing the created accounting entries.
    """
    return await accounting_handler.create_accounting(group_id=group_id,
                                                      user_name=x_user_name)
