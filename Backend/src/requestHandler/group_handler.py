import functools
import re
from datetime import datetime
from typing import Annotated

from fastapi import Depends, HTTPException

from models.enumerations.event_types import EventType
from models.group import Group
from models.requestModels.group_request_model import GroupCreateRequestModel
from models.responseModels.group_response_model import (GroupResponseModel,
                                                        GroupHistoryResponseModel,
                                                        UserResponseModel,
                                                        PaymentResponseModel,
                                                        PaymentDetailResponseModel,
                                                        TransactionResponseModel)
from models.user import User
from shared.db_query_service import DatabaseServiceDep


def check_and_unify_paypal_me_link(paypal_me_link: str) -> str:
    """
    Validates and unifies a PayPal.me link.

    Args:
        paypal_me_link (str): The PayPal.me link to validate and unify.

    Returns:
        str: The unified PayPal.me link.

    Raises:
        HTTPException: If the PayPal.me link is invalid.
    """
    if paypal_me_link == "":
        return ""

    pattern = re.compile("^(https://)?paypal.me/[^/]+$")

    if not pattern.match(paypal_me_link):
        raise HTTPException(status_code=400, detail="Invalid paypal me link.")

    if not paypal_me_link.startswith("https://"):
        return "https://" + paypal_me_link
    return paypal_me_link


def convert_group_to_response_model(group: Group) -> GroupResponseModel:
    """
    Converts a Group object to a GroupResponseModel.

    Args:
        group (Group): The group object to convert.

    Returns:
        GroupResponseModel: The response model representing the group.
    """
    user_payments: dict[str, list[PaymentResponseModel]] = {user.name: [] for user in group.users}

    for payment in group.payments:
        if group.closed:
            user_payments[payment.paid_by.name].append(PaymentResponseModel(description=payment.description,
                                                                            amount=payment.amount))
        elif payment.balanced_by is None:
            user_payments[payment.paid_by.name].append(PaymentResponseModel(description=payment.description,
                                                                            amount=payment.amount))

    return GroupResponseModel(
        uuid=group.uuid,
        title=group.title,
        users=[UserResponseModel(
            user_name=user.name,
            paypal_me=user.paypal_me_link,
            sum_amount=functools.reduce(lambda x, y: x + y.amount, user_payments[user.name], 0),
            payments=user_payments[user.name]
        ) for user in group.users],
        closed=group.closed
    )


class GroupHandler:
    """
    Handles operations related to groups.

    Attributes:
        database_service (DatabaseServiceDep): The database service dependency.
    """

    def __init__(self, database_service: DatabaseServiceDep) -> None:
        self.database_service = database_service

    async def create_group(self,
                           request_model: GroupCreateRequestModel,
                           user_name: str) -> GroupResponseModel:
        """
        Creates a new group.

        Args:
            request_model (GroupCreateRequestModel): The request model containing the group creation details.
            user_name (str): The name of the user creating the group.

        Returns:
            GroupResponseModel: The response model representing the created group.
        """
        user_names = [user.name for user in request_model.users]

        if len(user_names) != len(set(user_names)):
            raise HTTPException(status_code=400, detail="User names must be unique.")

        if len(request_model.users) > 20:
            raise HTTPException(status_code=400, detail="Maximum number of users is 20.")

        users = [User(name=user_request.name,
                      paypal_me_link=check_and_unify_paypal_me_link(user_request.paypal_me))
                 for user_request in request_model.users]

        created_by_user = next((user for user in users if user.name == user_name), None)
        if created_by_user is None:
            raise HTTPException(status_code=400, detail="Creator must be part of the group.")

        group = Group(
            title=request_model.title,
            closed=False,
            users=users,
            payments=[],
            accountings=[],
            created_at=datetime.now(),
            created_by=created_by_user
        )

        group_id = await self.database_service.create_initial_group(group=group)
        await self.database_service.commit()

        result = await self.database_service.get_group(group_uuid=group_id)

        return convert_group_to_response_model(result)

    async def get_group(self, group_id: str) -> GroupResponseModel:
        """
        Retrieves the details of a group.

        Args:
            group_id (str): The ID of the group to retrieve.

        Returns:
            GroupResponseModel: The response model representing the group.
        """
        group = await self.database_service.get_group(group_uuid=group_id)

        return convert_group_to_response_model(group)

    async def close_group(self, group_id: str, user_name: str) -> None:
        """
        Closes a group.

        Args:
            group_id (str): The ID of the group to close.
            user_name (str): The name of the user closing the group.

        Returns:
            None
        """
        group = await self.database_service.get_group(group_uuid=group_id)

        try:
            closed_by_user = next(user for user in group.users if user.name == user_name)
        except StopIteration:
            raise HTTPException(status_code=400, detail="Invalid user in request.")

        group.closed = True
        group.closed_at = datetime.now()
        group.closed_by = closed_by_user

        await self.database_service.close_group(group=group)
        await self.database_service.commit()

    async def get_group_history(self, group_id: str) -> list[GroupHistoryResponseModel]:
        """
        Retrieves the history of a group.

        Args:
            group_id (str): The ID of the group to retrieve the history for.

        Returns:
            list[GroupHistoryResponseModel]: A list of response models representing the group's history.
        """
        group = await self.database_service.get_group(group_uuid=group_id)

        group_history: list[GroupHistoryResponseModel] = [
            GroupHistoryResponseModel(
                type=EventType.CREATED,
                creator=group.created_by.name,
                datetime=group.created_at,
                details=None
            )]

        group_history.extend([GroupHistoryResponseModel(
            type=EventType.PAYMENT,
            creator=payment.created_by.name,
            datetime=payment.created_at,
            details=PaymentDetailResponseModel(
                amount=payment.amount,
                description=payment.description,
                paid_by=payment.paid_by.name,
                participants=[user.name for user in payment.participants]
            )
        ) for payment in group.payments])

        group_history.extend([GroupHistoryResponseModel(
            type=EventType.ACCOUTING,
            creator=accounting.created_by.name,
            datetime=accounting.created_at,
            details=[TransactionResponseModel(
                payment_from=transaction.payment_from.name,
                payment_to=transaction.payment_to.name,
                amount=transaction.amount) for transaction in accounting.transactions]
        ) for accounting in group.accountings])

        if group.closed:
            group_history.append(GroupHistoryResponseModel(
                type=EventType.CLOSED,
                creator=group.closed_by.name,
                datetime=group.closed_at,
                details=None
            ))

        group_history.sort(key=lambda x: x.datetime, reverse=True)

        return group_history


GroupHandlerDependency = Annotated[GroupHandler, Depends(GroupHandler)]
