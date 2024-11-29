import functools
from datetime import datetime
from typing import Annotated

from fastapi import Depends, HTTPException

from src.models.enumerations.event_types import EventType
from src.models.group import Group
from src.models.requestModels.group_request_model import GroupCreateRequestModel
from src.models.responseModels.group_response_model import (GroupResponseModel,
                                                            GroupHistoryResponseModel,
                                                            UserResponseModel,
                                                            PaymentResponseModel,
                                                            PaymentDetailResponseModel,
                                                            TransactionResponseModel)
from src.models.user import User
from src.shared.db_query_service import DatabaseServiceDep


def convert_group_to_response_model(group: Group) -> GroupResponseModel:
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
            sum_amount=functools.reduce(lambda x, y: x + y.amount, user_payments[user.name], 0),
            payments=user_payments[user.name]
        ) for user in group.users],
        closed=group.closed
    )


class GroupHandler:
    def __init__(self, database_service: DatabaseServiceDep) -> None:
        self.database_service = database_service

    async def create_group(self,
                           request_model: GroupCreateRequestModel,
                           user_name: str) -> GroupResponseModel:
        user_names = [user.name for user in request_model.users]

        if len(user_names) != len(set(user_names)):
            raise HTTPException(status_code=400, detail="User names must be unique.")

        user = [User(name=user_request.name,
                     paypal_me_link=user_request.paypal_me) for user_request in request_model.users]

        created_by_user = next((user for user in user if user.name == user_name), None)
        if created_by_user is None:
            raise HTTPException(status_code=400, detail="Creator must be part of the group.")

        group = Group(
            title=request_model.title,
            closed=False,
            users=[User(name=user_request.name,
                        paypal_me_link=user_request.paypal_me) for user_request in request_model.users],
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
        group = await self.database_service.get_group(group_uuid=group_id)

        return convert_group_to_response_model(group)

    async def close_group(self, group_id: str, user_name: str) -> None:
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

        group_history.sort(key=lambda x: x.datetime)

        return group_history


GroupHandlerDependency = Annotated[GroupHandler, Depends(GroupHandler)]
