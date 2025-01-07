# T103
from datetime import datetime

import pytest

from models.accounting import Accounting
from models.enumerations.uuid_types import UniqueIdType
from models.group import Group
from models.payment import Payment
from models.transaction import Transaction
from models.user import User
from shared.db_query_service import DatabaseService
from shared.db_session_manager import get_db_session


# T103
@pytest.mark.asyncio
async def test_create_initial_group(sql_lite_cursor) -> None:
    database_service = DatabaseService(db_session=await get_db_session())

    group_uuid = await database_service.create_initial_group(group=Group(
        title="Test Group",
        closed=False,
        payments=[],
        accountings=[],
        users=[],
        created_at=datetime.now(),
        created_by=User(
            name="Test User",
            paypal_me_link=""
        )))
    await database_service.commit()

    sql_lite_cursor.execute('SELECT * FROM "group"')
    groups = sql_lite_cursor.fetchall()

    assert len(groups) == 1
    assert groups[0][1] == group_uuid


# T104
@pytest.mark.asyncio
async def test_get_group() -> None:
    database_service = DatabaseService(db_session=await get_db_session())

    inital_group = Group(
        title="Test Group",
        closed=False,
        payments=[],
        accountings=[],
        users=[User(
            name="Test User",
            paypal_me_link=""
        )],
        created_at=datetime.now(),
        created_by=User(
            name="Test User",
            paypal_me_link=""
        ))

    group_uuid = await database_service.create_initial_group(group=inital_group)
    await database_service.commit()

    group = await database_service.get_group(group_uuid)

    assert group.uuid == group_uuid
    assert group.title == inital_group.title
    assert group.closed == inital_group.closed
    assert len(group.payments) == len(inital_group.payments)
    assert len(group.accountings) == len(inital_group.accountings)
    assert len(group.users) == len(inital_group.users)
    assert group.created_at == inital_group.created_at
    assert group.created_by.name == inital_group.created_by.name
    assert group.closed_at == inital_group.closed_at
    assert group.closed_by == inital_group.closed_by


# T105
@pytest.mark.asyncio
async def test_create_payment(sql_lite_cursor) -> None:
    database_service = DatabaseService(db_session=await get_db_session())

    sql_lite_cursor.execute('INSERT INTO "group" (uuid, title, closed, created_at, created_by)'
                            ' VALUES ("test_uuid", "Test Group", 0, "2021-10-10 10:00:00", "Test User")')
    sql_lite_cursor.execute('INSERT INTO "user" (uuid, name, group_id, paypal_me_link)'
                            ' VALUES ("test_user_uuid", "Test User", 1, "")')
    sql_lite_cursor.execute('INSERT INTO "user" (uuid, name, group_id, paypal_me_link)'
                            ' VALUES ("test_user_uuid2", "Test User2", 1, "")')
    sql_lite_cursor.execute('COMMIT')

    await database_service.create_payment(
        group_uuid="test_uuid",
        payment=Payment(
            paid_by=User(
                name="Test User",
                paypal_me_link="",
                uuid="test_user_uuid"
            ),
            amount=100,
            participants=[User(
                name="Test User",
                paypal_me_link="",
                uuid="test_user_uuid"
            ),
                User(
                    name="Test User2",
                    paypal_me_link="",
                    uuid="test_user_uuid2"
                )
            ],
            description="Test Payment",
            created_at=datetime.now(),
            created_by=User(
                name="Test User",
                paypal_me_link="",
                uuid="test_user_uuid"
            )
        ))

    await database_service.commit()

    sql_lite_cursor.execute('SELECT * FROM "payment"')
    payments = sql_lite_cursor.fetchall()

    sql_lite_cursor.execute('SELECT * FROM "payment_participants"')
    payment_participants = sql_lite_cursor.fetchall()

    assert len(payments) == 1
    assert payments[0][3] == 100.0
    assert payments[0][4] == "Test Payment"

    assert len(payment_participants) == 2
    x = 2


# T106
@pytest.mark.asyncio
async def test_create_accounting(sql_lite_cursor) -> None:
    database_service = DatabaseService(db_session=await get_db_session())

    sql_lite_cursor.execute('INSERT INTO "group" (uuid, title, closed, created_at, created_by)'
                            ' VALUES ("test_uuid", "Test Group", 0, "2021-10-10 10:00:00", "Test User")')
    sql_lite_cursor.execute('INSERT INTO "user" (uuid, name, group_id, paypal_me_link)'
                            ' VALUES ("test_user_uuid", "Test User", 1, "")')
    sql_lite_cursor.execute('INSERT INTO "user" (uuid, name, group_id, paypal_me_link)'
                            ' VALUES ("test_user_uuid2", "Test User2", 1, "")')
    sql_lite_cursor.execute('COMMIT')

    await database_service.create_accounting(group_uuid="test_uuid",
                                             accounting=Accounting(
                                                 transactions=[
                                                     Transaction(
                                                         uuid="test_transaction_uuid",
                                                         payment_from=User(
                                                             name="Test User",
                                                             paypal_me_link="",
                                                             uuid="test_user_uuid"
                                                         ),
                                                         payment_to=User(
                                                             name="Test User2",
                                                             paypal_me_link="",
                                                             uuid="test_user_uuid2"
                                                         ),
                                                         amount=100.0
                                                     ),
                                                     Transaction(
                                                         uuid="test_transaction_uuid",
                                                         payment_from=User(
                                                             name="Test User2",
                                                             paypal_me_link="",
                                                             uuid="test_user_uuid2"
                                                         ),
                                                         payment_to=User(
                                                             name="Test User",
                                                             paypal_me_link="",
                                                             uuid="test_user_uuid"
                                                         ),
                                                         amount=200.0
                                                     )
                                                 ],
                                                 created_at=datetime.now(),
                                                 created_by=User(
                                                     name="Test User",
                                                     paypal_me_link="",
                                                     uuid="test_user_uuid"
                                                 )
                                             ))
    await database_service.commit()

    sql_lite_cursor.execute('SELECT * FROM "accounting"')
    accountings = sql_lite_cursor.fetchall()

    sql_lite_cursor.execute('SELECT * FROM "transaction"')
    transactions = sql_lite_cursor.fetchall()

    assert len(accountings) == 1

    assert len(transactions) == 2
    assert transactions[0][5] == 100.0
    assert transactions[1][5] == 200.0


# T107
@pytest.mark.asyncio
async def test_close_group(sql_lite_cursor) -> None:
    database_service = DatabaseService(db_session=await get_db_session())
    sql_lite_cursor.execute('INSERT INTO "group" (uuid, title, closed, created_at, created_by)'
                            ' VALUES ("test_uuid", "Test Group", 0, "2021-10-10 10:00:00", "Test User")')
    sql_lite_cursor.execute('INSERT INTO "user" (uuid, name, group_id, paypal_me_link)'
                            ' VALUES ("test_user_uuid", "Test User", 1, "")')
    sql_lite_cursor.execute('COMMIT')

    await database_service.close_group(group=Group(
        uuid="test_uuid",
        title="Test Group",
        closed=True,
        closed_by=User(
            name="Test User",
            paypal_me_link="",
            uuid="test_user_uuid"
        ),
        payments=[],
        accountings=[],
        users=[User(
            name="Test User",
            paypal_me_link="",
            uuid="test_user_uuid"
        )],
        created_at=datetime.now(),
        created_by=User(
            name="Test User",
            paypal_me_link=""
        )
    ))
    await database_service.commit()

    sql_lite_cursor.execute('SELECT * FROM "group"')
    groups = sql_lite_cursor.fetchall()

    assert len(groups) == 1
    assert groups[0][3] == 1


# T108
@pytest.mark.asyncio
async def test_get_unique_uuid(sql_lite_cursor) -> None:
    database_service = DatabaseService(db_session=await get_db_session())
    uuid_group = database_service._get_unique_uuid(UniqueIdType.Group)
    uuid_user = database_service._get_unique_uuid(UniqueIdType.USER)
    uuid_payment = database_service._get_unique_uuid(UniqueIdType.PAYMENT)
    uuid_accounting = database_service._get_unique_uuid(UniqueIdType.ACCOUNTING)
    uuid_transcation = database_service._get_unique_uuid(UniqueIdType.TRANSACTION)

    assert uuid_group is not None
    assert uuid_user is not None
    assert uuid_payment is not None
    assert uuid_accounting is not None
    assert uuid_transcation is not None
