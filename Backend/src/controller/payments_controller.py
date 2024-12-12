from typing import Annotated

from fastapi import APIRouter, Header

from models.requestModels.payment_request_model import PaymentRequestModel
from requestHandler.payments_handler import PaymentHandlerDependency

payments_router = APIRouter(
    tags=["payment"]
)


@payments_router.post(path="/group/{group_id}/payment")
async def create_payment(payment_handler: PaymentHandlerDependency,
                         group_id: str,
                         request_model: PaymentRequestModel,
                         x_user_name: Annotated[str | None, Header()]) -> None:
    """
    Creates a payment for a group.

    Args:
        payment_handler (PaymentHandlerDependency): The handler that manages payment operations.
        group_id (str): The ID of the group for which to create the payment.
        request_model (PaymentRequestModel): The request model containing the payment details.
        x_user_name (Annotated[str | None, Header]): Header to specify the user name for payment creation.

    Returns:
        None
    """
    return await payment_handler.create_payment(group_id=group_id,
                                                request_model=request_model,
                                                user_name=x_user_name)
