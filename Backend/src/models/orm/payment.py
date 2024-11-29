from datetime import datetime

from sqlalchemy import ForeignKey
from sqlalchemy.orm import mapped_column, Mapped, relationship

from src.models.orm.orm_base import ORMBase
from src.models.orm.payment_participants import payment_participants_table


class Payment(ORMBase):
    __tablename__ = "payment"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    uuid: Mapped[str]

    group_id: Mapped[int] = mapped_column(ForeignKey("group.id"))

    amount: Mapped[float]
    description: Mapped[str]

    paid_by: Mapped[int] = mapped_column(ForeignKey("user.id"))
    balanced_by: Mapped[int] = mapped_column(ForeignKey("accounting.id"), nullable=True)

    created_at: Mapped[datetime]
    created_by: Mapped[int] = mapped_column(ForeignKey("user.id"))

    # Relationship
    group: Mapped["Group"] = relationship(back_populates="payments")
    paid_by_user: Mapped["User"] = relationship(foreign_keys=[paid_by], back_populates="payments_paid")
    balanced_by_accounting: Mapped["Accounting"] = relationship(back_populates="balances")

    participants: Mapped[list["User"]] = relationship(back_populates="payments_participant",
                                                      secondary=payment_participants_table)

    created_by_user: Mapped["User"] = relationship(foreign_keys=created_by,
                                                   back_populates="payments_created")
