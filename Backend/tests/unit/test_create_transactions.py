from datetime import datetime

import pytest

from models.group import Group
from models.payment import Payment
from models.user import User
from requestHandler.accounting_handler import AccountingHandler


@pytest.fixture()
def user1():
    return User(name="User1")


@pytest.fixture()
def user2():
    return User(name="User2")


@pytest.fixture()
def user3():
    return User(name="User3")


@pytest.fixture()
def group(user1, user2, user3):
    payment1 = Payment(paid_by=user1, amount=100, participants=[user1, user2, user3],
                       description="", created_at=datetime.now(), created_by=user1)
    payment2 = Payment(paid_by=user2, amount=50, participants=[user1, user2],
                       description="", created_at=datetime.now(), created_by=user1)
    payment3 = Payment(paid_by=user3, amount=75, participants=[user2, user3],
                       description="", created_at=datetime.now(), created_by=user1)

    return Group(title="",
                 closed=False,
                 users=[user1, user2, user3],
                 accountings=[],
                 created_at=datetime.now(),
                 created_by=user1,
                 payments=[payment1, payment2, payment3])


# T101
@pytest.mark.asyncio
async def test_get_saldo_dict(group, user1, user2, user3) -> None:
    accounting_handler = AccountingHandler(database_service=None)
    saldo_dict = accounting_handler._get_saldo_dict(group)
    assert saldo_dict[user1] == 41.66666666666666
    assert saldo_dict[user2] == -45.833333333333336
    assert saldo_dict[user3] == 4.166666666666664


# T102
@pytest.mark.asyncio
async def test_calculate_transactions(group, user1, user2, user3) -> None:
    accounting_handler = AccountingHandler(database_service=None)

    saldo_dict = {
        user1: 41.66666666666666,
        user2: -45.833333333333336,
        user3: 4.166666666666664
    }

    transactions = accounting_handler._minimize_transactions(saldo_dict)
    assert len(transactions) == 2

    assert transactions[0][0] == user2
    assert transactions[0][1] == user1
    assert transactions[0][2] == 41.67

    assert transactions[1][0] == user2
    assert transactions[1][1] == user3
    assert transactions[1][2] == 4.17
