import math
from datetime import datetime
from typing import Annotated

from fastapi import Depends, HTTPException

from models.accounting import Accounting
from models.group import Group
from models.responseModels.transaction_response_model import TransactionResponseModel
from models.transaction import Transaction
from models.user import User
from shared.db_query_service import DatabaseServiceDep


def convert_transaction_to_response_model(transaction: Transaction) -> TransactionResponseModel:
    """
    Converts a Transaction object to a TransactionResponseModel.

    Args:
        transaction (Transaction): The transaction object to convert.

    Returns:
        TransactionResponseModel: The response model representing the transaction.
    """
    return TransactionResponseModel(
        payment_from=transaction.payment_from.name,
        payment_to=transaction.payment_to.name,
        amount=transaction.amount
    )


class AccountingHandler:
    """
    Handles operations related to accountings.

    Attributes:
        database_service (DatabaseServiceDep): The database service dependency.
    """

    def __init__(self, database_service: DatabaseServiceDep) -> None:
        self.database_service = database_service

    def _minimize_transactions(self, balances: dict[User, float]) -> list[tuple[User, User, float]]:
        """
        Greedy algorithm to minimizes the number of transactions needed to settle balances between users.

        Args:
            balances (dict[User, float]): A dictionary mapping users to their balance amounts.

        Returns:
            list[tuple[User, User, float]]: A list of tuples representing the minimized transactions.
        """
        # Split into creditors and debtors
        creditors = [(user, balance) for user, balance in balances.items() if balance > 0]
        debtors = [(user, balance) for user, balance in balances.items() if balance < 0]

        # Sort creditors and debtors according to the amount of their claims or debts
        creditors.sort(key=lambda x: x[1], reverse=True)
        debtors.sort(key=lambda x: x[1], reverse=True)

        transactions = []

        # Minimize the number of transactions
        while creditors and debtors:
            # Get the first creditor and debtor
            creditor, credit_amount = creditors.pop(0)
            debtor, debt_amount = debtors.pop(0)
            debt_amount = abs(debt_amount)

            # Determine the transaction amount as the minimum of the credit and debt amounts
            transaction_amount = min(credit_amount, debt_amount)
            transaction_amount = math.ceil(transaction_amount * 100) / 100

            transactions.append((debtor, creditor, transaction_amount))

            # Adjust the remaining credit or debt and reinsert into the list if not settled
            if credit_amount > debt_amount:
                creditors.append((creditor, credit_amount - transaction_amount))
                creditors.sort(key=lambda x: x[1], reverse=True)
            elif debt_amount > credit_amount:
                debtors.append((debtor, debt_amount - transaction_amount))
                debtors.sort(key=lambda x: x[1], reverse=True)

        return transactions

    async def _calculate_transactions(self, group: Group) -> list[Transaction]:
        """
        Calculates the transactions needed to settle all payments within a group.

        Args:
            group (Group): The group object containing the payments.

        Returns:
            list[Transaction]: A list of transactions needed to settle the group's payments.
        """
        saldo_dict: dict[User, float] = {}

        for payment in group.payments:
            # Ignore already balanced payments
            if payment.balanced_by is not None:
                continue

            if payment.paid_by not in saldo_dict:
                saldo_dict[payment.paid_by] = 0.0
            saldo_dict[payment.paid_by] += payment.amount

            amount_per_participant = payment.amount / len(payment.participants)
            for participant in payment.participants:
                if participant not in saldo_dict:
                    saldo_dict[participant] = 0.0
                saldo_dict[participant] -= amount_per_participant

        transactions = self._minimize_transactions(saldo_dict)

        return [
            Transaction(
                payment_from=debtor,
                payment_to=creditor,
                amount=transaction_amount
            ) for debtor, creditor, transaction_amount in transactions
        ]

    async def get_accounting_preview(self,
                                     group_id: str) -> list[TransactionResponseModel]:
        """
        Retrieves a preview of the accounting for a group.

        Args:
            group_id (str): The ID of the group for which to retrieve the accounting preview.

        Returns:
            list[TransactionResponseModel]: A list of transaction response models representing the accounting preview.
        """
        group = await self.database_service.get_group(group_uuid=group_id)

        if group.closed:
            raise HTTPException(status_code=400, detail="Group is already closed.")

        transactions = await self._calculate_transactions(group=group)

        return [convert_transaction_to_response_model(transaction) for transaction in transactions]

    async def create_accounting(self,
                                group_id: str,
                                user_name: str) -> list[TransactionResponseModel]:
        """
        Creates accounting entries for a group.

        Args:
            group_id (str): The ID of the group for which to create accounting entries.
            user_name (str): The name of the user creating the accounting entries.

        Returns:
            list[TransactionResponseModel]: List of transaction response models representing the created accounting.
        """
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
