from datetime import datetime

from sqlalchemy import ForeignKey
from sqlalchemy.orm import mapped_column, Mapped, relationship

from models.orm.orm_base import ORMBase
from models.orm.payment_participants import payment_participants_table


class Payment(ORMBase):
    """ORM Class for Accounting Table."""

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
    group: Mapped["Group"] = relationship(back_populates="payments")  # noqa: F821
    paid_by_user: Mapped["User"] = relationship(foreign_keys=[paid_by], back_populates="payments_paid")  # noqa: F821
    balanced_by_accounting: Mapped["Accounting"] = relationship(back_populates="balances")  # noqa: F821

    participants: Mapped[list["User"]] = relationship(back_populates="payments_participant",  # noqa: F821
                                                      secondary=payment_participants_table)

    created_by_user: Mapped["User"] = relationship(foreign_keys=created_by,  # noqa: F821
                                                   back_populates="payments_created")
