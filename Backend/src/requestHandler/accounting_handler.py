import math
from datetime import datetime
from typing import Annotated

from fastapi import Depends, HTTPException

from models.accounting import Accounting
from models.group import Group
from models.responseModels.acounts_response_model import TransactionResponseModel
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

    def minimize_transactions_from_balances(self, balances):
        """
        Minimize the number of transactions required to settle debts from balances.

        Args:
            balances (dict): A dictionary where keys are person names and values are their net balances.
                             Positive values indicate credit (they are owed money),
                             Negative values indicate debt (they owe money).

        Returns:
            list of tuples: Optimized list of transactions in the form (debtor, creditor, amount).
        """
        # Step 1: Create a list of net balances
        net_balances = [balance for balance in balances.values() if balance != 0]

        # Base case: If all balances are settled
        if not net_balances:
            return []

        # Step 2: Find the first non-zero balance and try to settle it
        first = net_balances[0]
        settlements = []

        for i in range(1, len(net_balances)):
            # Attempt to settle 'first' with net_balances[i]
            net_balances[i] += first

            # Recursive call to settle the remaining balances
            sub_settlements = self.minimize_transactions_from_balances(
                {k: v for k, v in zip(balances.keys(), net_balances) if v != 0}
            )

            # Add the current settlement
            current_settlement = [(list(balances.keys())[0], list(balances.keys())[i], -first)]
            all_settlements = current_settlement + sub_settlements

            # Restore original balance for backtracking
            net_balances[i] -= first

            # If this is the optimal solution so far, keep it
            if not settlements or len(all_settlements) < len(settlements):
                settlements = all_settlements

        return settlements

    def minimize_transactions(self, expenses: dict[User, float]):
        # Berechne den Nettosaldo jeder Person
        balances = {}
        for person, amount in expenses.items():
            balances[person] = balances.get(person, 0) + amount

        # Trenne die Personen in Gläubiger und Schuldner
        creditors = []
        debtors = []
        for person, balance in balances.items():
            if balance > 0:
                creditors.append((person, balance))
            elif balance < 0:
                debtors.append((person, -balance))

        # Sortiere Gläubiger und Schuldner nach der Höhe ihrer Forderungen bzw. Schulden
        creditors.sort(key=lambda x: x[1], reverse=True)
        debtors.sort(key=lambda x: x[1], reverse=True)

        transactions = []

        # Minimiere die Anzahl der Transaktionen
        while creditors and debtors:
            creditor, credit_amount = creditors.pop(0)
            debtor, debt_amount = debtors.pop(0)

            transaction_amount = min(credit_amount, debt_amount)
            transactions.append((debtor, creditor, transaction_amount))

            if credit_amount > debt_amount:
                creditors.insert(0, (creditor, credit_amount - transaction_amount))
            elif debt_amount > credit_amount:
                debtors.insert(0, (debtor, debt_amount - transaction_amount))

        return transactions

    async def _calculate_transactions(self, group: Group) -> list[Transaction]:

        fabi = group.users[0]
        krissi = group.users[1]

        soldo_dict: dict[User, float] = {}

        for payment in group.payments:
            if payment.paid_by not in soldo_dict:
                soldo_dict[payment.paid_by] = 0.0
            soldo_dict[payment.paid_by] += payment.amount

            for participant in payment.participants:
                amount_per_participant = payment.amount / len(payment.participants)
                if participant not in soldo_dict:
                    soldo_dict[participant] = 0.0
                soldo_dict[participant] -= amount_per_participant

        for key, value in soldo_dict.items():
            soldo_dict[key] = math.ceil(value * 100) / 100

        x = self.minimize_transactions(soldo_dict)
        # y = self.minimize_transactions_from_balances(soldo_dict)

        # Todo: Implement the logic to calculate the accounting
        return [
            Transaction(
                payment_from=debtor,
                payment_to=creditor,
                amount=transaction_amount
            ) for debtor, creditor, transaction_amount in x
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
