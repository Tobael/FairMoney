import uuid
from typing import Annotated

from fastapi import Depends, HTTPException
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload

from src.models.accounting import Accounting
from src.models.enumerations.uuid_types import UniqueIdType
from src.models.group import Group as Group
from src.models.orm.accounting import Accounting as ORMAccounting
from src.models.orm.group import Group as ORMGroup
from src.models.orm.payment import Payment as ORMPayment
from src.models.orm.transaction import Transaction as ORMTransaction
from src.models.orm.user import User as ORMUser
from src.models.payment import Payment as Payment
from src.models.transaction import Transaction
from src.models.user import User
from src.shared.db_session_manager import DBSessionDep


class DatabaseService:
    """
    Service class that supports the read and operations to the database.

    Attributes:
        db_session (DBSessionDep): The database session dependency.
    """

    def __init__(self,
                 db_session: DBSessionDep) -> None:
        self.db_session = db_session

    async def create_initial_group(self,
                                   group: Group) -> str:
        """
        Creates an initial group in the database.

        Args:
            group (Group): The group object containing the group details.

        Returns:
            str: The UUID of the created group.
        """
        group_uuid = await self._get_unique_uuid(id_type=UniqueIdType.Group)

        new_group = ORMGroup(uuid=group_uuid,
                             title=group.title,
                             closed=group.closed,
                             created_at=group.created_at)

        for user in group.users:
            user_uuid = await self._get_unique_uuid(id_type=UniqueIdType.USER)
            new_user = ORMUser(uuid=user_uuid,
                               name=user.name,
                               paypal_me_link=user.paypal_me_link)
            new_group.users.append(new_user)

            if user.name == group.created_by.name:
                new_group.created_by_user = new_user

        try:
            self.db_session.add(new_group)
        except Exception:
            await self.db_session.rollback()
            raise HTTPException(status_code=500, detail="Group could not be created due to an internal error.")

        return group_uuid

    async def _get_group(self,
                         group_uuid: str) -> ORMGroup:
        """
        Retrieves a group from the database by its UUID. For internal use only.

        Args:
            group_uuid (str): The UUID of the group to retrieve.

        Returns:
            ORMGroup: The ORM group object.
        """
        query = select(ORMGroup).where(ORMGroup.uuid == group_uuid).options(selectinload(ORMGroup.payments)
                                                                            .selectinload(ORMPayment.participants),
                                                                            selectinload(ORMGroup.users),
                                                                            selectinload(ORMGroup.accountings)
                                                                            .selectinload(ORMAccounting.transactions))
        result = await self.db_session.execute(query)
        db_group = result.scalar()
        return db_group

    async def get_group(self,
                        group_uuid: str) -> Group:
        """
        Retrieves a group and its related data from the database.

        Args:
            group_uuid (str): The UUID of the group to retrieve.

        Returns:
            Group: The group object with related data.
        """
        db_group = await self._get_group(group_uuid=group_uuid)

        if db_group is None:
            raise HTTPException(status_code=404, detail=f"Group with uuid {group_uuid} does not exist")

        user_list = [User(
            uuid=user.uuid,
            name=user.name,
            paypal_me_link=user.paypal_me_link) for user in db_group.users]

        accounting_list = [Accounting(
            uuid=accounting.uuid,
            created_at=accounting.created_at,
            created_by=next(user for user in user_list if user.uuid == accounting.created_by_user.uuid),
            transactions=[Transaction(
                uuid=transaction.uuid,
                amount=transaction.amount,
                payment_from=next(user for user in user_list if user.uuid == transaction.payment_from_user.uuid),
                payment_to=next(user for user in user_list if user.uuid == transaction.payment_to_user.uuid)
            ) for transaction in accounting.transactions]
        ) for accounting in db_group.accountings]

        payment_list = [Payment(
            uuid=payment.uuid,
            amount=payment.amount,
            description=payment.description,
            balanced_by=next(
                (accounting for accounting in accounting_list if payment.balanced_by_accounting is not None and
                 accounting.uuid == payment.balanced_by_accounting.uuid),
                None),
            paid_by=next(user for user in user_list if user.uuid == payment.paid_by_user.uuid),
            participants=[next(user for user in user_list if user.uuid == participant.uuid)
                          for participant in payment.participants],
            created_at=payment.created_at,
            created_by=next(user for user in user_list if user.uuid == payment.created_by_user.uuid)
        ) for payment in db_group.payments]

        group = Group(uuid=db_group.uuid,
                      title=db_group.title,
                      closed=db_group.closed,
                      created_at=db_group.created_at,
                      created_by=next(user for user in user_list if user.uuid == db_group.created_by_user.uuid),

                      users=user_list,
                      payments=payment_list,
                      accountings=accounting_list)

        if db_group.closed:
            group.closed_at = db_group.closed_at
            group.closed_by = next(user for user in user_list if user.uuid == db_group.closed_by_user.uuid)

        return group

    async def create_payment(self,
                             group_uuid: str,
                             payment: Payment) -> None:
        """
        Creates a payment entry for a group.

        Args:
            group_uuid (str): The UUID of the group for which to create the payment.
            payment (Payment): The payment object containing the payment details.

        Returns:
            None
        """
        payment_uuid = await self._get_unique_uuid(id_type=UniqueIdType.PAYMENT)

        group = await self._get_group(group_uuid)

        paid_by_user = next((user for user in group.users if user.uuid == payment.paid_by.uuid))
        created_by_user = next((user for user in group.users if user.uuid == payment.created_by.uuid))
        participants = [next((user for user in group.users if user.uuid == participant.uuid))
                        for participant in payment.participants]

        new_payment = ORMPayment(uuid=payment_uuid,
                                 amount=payment.amount,
                                 description=payment.description,
                                 created_at=payment.created_at,
                                 group=group,
                                 paid_by_user=paid_by_user,
                                 balanced_by_accounting=None,
                                 participants=participants,
                                 created_by_user=created_by_user)

        try:
            self.db_session.add(new_payment)
        except Exception:
            await self.db_session.rollback()
            raise HTTPException(status_code=500, detail="Payment could not be created due to an internal error.")

    async def create_accounting(self,
                                group_uuid: str,
                                accounting: Accounting) -> None:
        """
        Creates an accounting entry for a group.

        Args:
            group_uuid (str): The UUID of the group for which to create the accounting.
            accounting (Accounting): The accounting object containing the accounting details.

        Returns:
            None
        """
        accounting_uuid = await self._get_unique_uuid(id_type=UniqueIdType.ACCOUNTING)

        group = await self._get_group(group_uuid)

        created_by_user = next((user for user in group.users if user.uuid == accounting.created_by.uuid))

        new_accounting = ORMAccounting(uuid=accounting_uuid,
                                       group=group,
                                       created_at=accounting.created_at,
                                       created_by_user=created_by_user)

        for payment in group.payments:
            if payment.balanced_by_accounting is None:
                payment.balanced_by_accounting = new_accounting

        transactions: list[ORMTransaction] = []

        for transaction in accounting.transactions:
            payment_from_user = next((user for user in group.users if user.uuid == transaction.payment_from.uuid))
            payment_to_user = next((user for user in group.users if user.uuid == transaction.payment_to.uuid))

            transaction_uuid = await self._get_unique_uuid(id_type=UniqueIdType.TRANSACTION)

            new_transaction = ORMTransaction(uuid=transaction_uuid,
                                             amount=transaction.amount,
                                             accounting=new_accounting,
                                             payment_from_user=payment_from_user,
                                             payment_to_user=payment_to_user)

            transactions.append(new_transaction)

        try:
            self.db_session.add(new_accounting)
            for transaction in transactions:
                self.db_session.add(transaction)
        except Exception:
            await self.db_session.rollback()
            raise HTTPException(status_code=500, detail="Accounting could not be created due to an internal error.")

    async def close_group(self,
                          group: Group) -> None:
        """
        Closes a group.

        Args:
            group (Group): The group object containing the group details.

        Returns:
            None
        """
        db_group = await self._get_group(group_uuid=group.uuid)

        closed_by_user = next((user for user in db_group.users if user.uuid == group.closed_by.uuid))

        db_group.closed = group.closed
        db_group.closed_by_user = closed_by_user
        db_group.closed_at = group.closed_at

    async def commit(self) -> None:
        """
        Commits the current transaction to the database.

        Returns:
            None
        """
        try:
            await self.db_session.commit()
        except Exception as e:
            await self.db_session.rollback()
            raise HTTPException(status_code=500, detail=f"Database connection raised an internal error: {e}")

    async def _get_unique_uuid(self, id_type: UniqueIdType) -> str:
        """
        Generates a unique UUID for a entity type.

        Args:
            id_type (UniqueIdType): The type of entity for which to generate the UUID.

        Returns:
            str: The generated unique UUID.

        Raises:
            HTTPException: If a unique UUID could not be generated after multiple attempts.
        """
        retries = 20

        orm_class_mapping = {
            UniqueIdType.Group: ORMGroup,
            UniqueIdType.USER: ORMUser,
            UniqueIdType.PAYMENT: ORMPayment,
            UniqueIdType.ACCOUNTING: ORMAccounting,
            UniqueIdType.TRANSACTION: ORMTransaction
        }

        orm_class = orm_class_mapping[id_type]

        while retries > 0:
            new_uuid = str(uuid.uuid4())

            query = select(func.count()).filter(orm_class.uuid == new_uuid)
            result = await self.db_session.execute(query)
            count = int(result.scalar_one())

            if count == 0:
                return new_uuid
            retries = retries - 1
        raise HTTPException(status_code=500, detail="Could not generate a unique uuid.")


DatabaseServiceDep = Annotated[DatabaseService, Depends(DatabaseService)]
