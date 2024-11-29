from typing import Annotated

from fastapi import APIRouter, Header

from src.models.requestModels.payment_request_model import PaymentRequestModel
from src.requestHandler.payments_handler import PaymentHandlerDependency

payments_router = APIRouter(
    tags=["payment"]
)


@payments_router.post(path="/group/{group_id}/payment")
async def create_payment(payment_handler: PaymentHandlerDependency,
                         group_id: str,
                         request_model: PaymentRequestModel,
                         x_user_name: Annotated[str | None, Header()]) -> None:
    return await payment_handler.create_payment(group_id=group_id,
                                                request_model=request_model,
                                                user_name=x_user_name)
