from datetime import datetime
from typing import Annotated

from fastapi import Depends, HTTPException

from models.payment import Payment
from models.requestModels.payment_request_model import PaymentRequestModel
from shared.db_query_service import DatabaseServiceDep


class PaymentHandler:
    """
    Handles operations related to payments.

    Attributes:
        database_service (DatabaseServiceDep): The database service dependency.
    """

    def __init__(self, database_service: DatabaseServiceDep) -> None:
        self.database_service = database_service

    async def create_payment(self,
                             group_id: str,
                             request_model: PaymentRequestModel,
                             user_name: str) -> None:
        """
        Creates a payment entry for a group.

        Args:
            group_id (str): The ID of the group for which to create the payment.
            request_model (PaymentRequestModel): The request model containing the payment details.
            user_name (str): The name of the user creating the payment.

        Returns:
            None
        """
        group = await self.database_service.get_group(group_id)

        if group.closed:
            raise HTTPException(status_code=400, detail="Group is already closed.")

        if len(request_model.participants) == 0:
            raise HTTPException(status_code=400, detail="There must be at least one participant.")

        if request_model.amount <= 0:
            raise HTTPException(status_code=400, detail="Amount must be greater than 0.")

        if len(request_model.participants) != len(set(request_model.participants)):
            raise HTTPException(status_code=400, detail="Participant can not be repeated.")

        try:
            paid_by_user = next((user for user in group.users if user.name == request_model.paid_by))
            created_by_user = next((user for user in group.users if user.name == user_name))
            participants = [next((user for user in group.users if user.name == participant))
                            for participant in request_model.participants]
        except StopIteration:
            raise HTTPException(status_code=400, detail="Invalid user in request.")

        payment = Payment(
            amount=request_model.amount,
            description=request_model.description,
            paid_by=paid_by_user,
            participants=participants,
            created_at=datetime.now(),
            created_by=created_by_user
        )

        await self.database_service.create_payment(group_uuid=group_id,
                                                   payment=payment)

        await self.database_service.commit()


PaymentHandlerDependency = Annotated[PaymentHandler, Depends(PaymentHandler)]
