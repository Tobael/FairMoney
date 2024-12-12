from sqlalchemy import ForeignKey
from sqlalchemy.orm import mapped_column, Mapped, relationship

from src.models.orm.orm_base import ORMBase


class Transaction(ORMBase):
    """ORM Class for Transaction Table."""

    __tablename__ = "transaction"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    uuid: Mapped[str]

    accounting_id: Mapped[int] = mapped_column(ForeignKey("accounting.id"))

    payment_from: Mapped[int] = mapped_column(ForeignKey("user.id"))
    payment_to: Mapped[int] = mapped_column(ForeignKey("user.id"))

    amount: Mapped[float]

    # Relationship
    accounting: Mapped["Accounting"] = relationship(back_populates="transactions")  # noqa: F821

    payment_from_user: Mapped["User"] = relationship(foreign_keys=payment_from,  # noqa: F821
                                                     back_populates="transactions_from")
    payment_to_user: Mapped["User"] = relationship(foreign_keys=payment_to,  # noqa: F821
                                                   back_populates="transactions_to")
