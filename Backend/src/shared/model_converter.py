from src.models.accounting import Accounting
from src.models.group import Group
from src.models.orm.group import Group as ORMGroup
from src.models.payment import Payment
from src.models.transaction import Transaction
from src.models.user import User


def convert_group_db_to_base(orm_group: ORMGroup) -> Group:
    user_list = [User(
        uuid=user.uuid,
        name=user.name,
        paypal_me_link=user.paypal_me_link) for user in orm_group.users]

    accounting_list = [Accounting(
        uuid=accounting.uuid,
        created=accounting.created,
        created_by=accounting.created_by_user.uuid,
        transactions=[Transaction(
            uuid=transaction.uuid,
            amount=transaction.amount,
            payment_from=next(user for user in user_list if user.name == transaction.payment_from_user.uuid),
            payment_to=next(user for user in user_list if user.name == transaction.payment_to_user.uuid)
        ) for transaction in accounting.transactions]
    ) for accounting in orm_group.accountings]

    payment_list = [Payment(
        uuid=payment.uuid,
        amount=payment.amount,
        description=payment.description,
        balanced_by=next(
            accounting for accounting in accounting_list if accounting.uuid == payment.balanced_by_accounting.uuid),
        paid_by=payment.paid_by_user.uuid,
        participants=[participant.participant_id for participant in
                      payment.participants],
        created=payment.created,
        created_by=next(user for user in user_list if user.uuid == payment.created_by_user.uuid)
    ) for payment in orm_group.payments]

    return Group(uuid=orm_group.uuid,
                 title=orm_group.title,
                 closed=orm_group.closed,
                 created=orm_group.created,
                 created_by=next(user for user in user_list if user.uuid == orm_group.created_by_user.uuid),

                 users=user_list,
                 payments=payment_list,
                 accountings=accounting_list)


def convert_group_base_to_resp(orm_group: ORMGroup) -> Group:
    pass
