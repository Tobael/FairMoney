from datetime import datetime
from typing import Annotated

from fastapi import Depends, HTTPException

from src.models.accounting import Accounting
from src.models.group import Group
from src.models.responseModels.acounts_response_model import TransactionResponseModel
from src.models.transaction import Transaction
from src.shared.db_query_service import DatabaseServiceDep


def convert_transaction_to_response_model(transaction: Transaction) -> TransactionResponseModel:
    return TransactionResponseModel(
        payment_from=transaction.payment_from.name,
        payment_to=transaction.payment_to.name,
        amount=transaction.amount
    )


class AccountingHandler:
    def __init__(self, database_service: DatabaseServiceDep) -> None:
        self.database_service = database_service

    async def _calculate_transactions(self, group: Group) -> list[Transaction]:

        fabi = group.users[0]
        krissi = group.users[1]

        # Todo: Implement the logic to calculate the accounting
        return [
            Transaction(
                payment_from=fabi,
                payment_to=krissi,
                amount=1.0
            ),
            Transaction(
                payment_from=krissi,
                payment_to=fabi,
                amount=1.0
            )
        ]

    async def get_accounting_preview(self,
                                     group_id: str) -> list[TransactionResponseModel]:
        group = await self.database_service.get_group(group_uuid=group_id)

        if group.closed:
            raise HTTPException(status_code=400, detail="Group is already closed.")

        transactions = await self._calculate_transactions(group=group)

        return [convert_transaction_to_response_model(transaction) for transaction in transactions]

    async def create_accounting(self,
                                group_id: str,
                                user_name: str) -> list[TransactionResponseModel]:

        group = await self.database_service.get_group(group_uuid=group_id)

        if group.closed:
            raise HTTPException(status_code=400, detail="Group is already closed.")

        transactions = await self._calculate_transactions(group=group)

        try:
            created_by_user = next(user for user in group.users if user.name == user_name)
        except StopIteration:
            raise HTTPException(status_code=400, detail="Invalid user in request.")

        accounting = Accounting(transactions=transactions,
                                created_by=created_by_user,
                                created_at=datetime.now())

        await self.database_service.create_accounting(group_uuid=group_id,
                                                      accounting=accounting)

        await self.database_service.commit()

        return [convert_transaction_to_response_model(transaction) for transaction in transactions]


AccountingHandlerDependency = Annotated[AccountingHandler, Depends(AccountingHandler)]
