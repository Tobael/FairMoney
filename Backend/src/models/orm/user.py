from sqlalchemy import ForeignKey
from sqlalchemy.orm import mapped_column, Mapped, relationship

from src.models.orm.group import Group
from src.models.orm.orm_base import ORMBase
from src.models.orm.payment import Payment
from src.models.orm.payment_participants import payment_participants_table
from src.models.orm.transaction import Transaction


class User(ORMBase):
    __tablename__ = "user"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    uuid: Mapped[str]

    name: Mapped[str]
    group_id: Mapped[int] = mapped_column(ForeignKey("group.id"))
    paypal_me_link: Mapped[str]

    # Relationship
    group: Mapped["Group"] = relationship(back_populates="users",
                                          foreign_keys=group_id)

    payments_paid: Mapped[list["Payment"]] = relationship(back_populates="paid_by_user",
                                                          foreign_keys="Payment.paid_by")
    payments_participant: Mapped[list["Payment"]] = relationship(back_populates="participants",
                                                                 secondary=payment_participants_table)

    transactions_from: Mapped[list["Transaction"]] = relationship(back_populates="payment_from_user",
                                                                  foreign_keys="Transaction.payment_from")
    transactions_to: Mapped[list["Transaction"]] = relationship(back_populates="payment_to_user",
                                                                foreign_keys="Transaction.payment_to")

    group_created: Mapped[list["Group"]] = relationship(back_populates="created_by_user",
                                                        foreign_keys="Group.created_by",
                                                        post_update=True)

    group_closed: Mapped[list["Group"]] = relationship(back_populates="closed_by_user",
                                                       foreign_keys="Group.closed_by")

    accountings_created: Mapped[list["Accounting"]] = relationship(back_populates="created_by_user")
    payments_created: Mapped[list["Payment"]] = relationship(back_populates="created_by_user",
                                                             foreign_keys="Payment.created_by")
