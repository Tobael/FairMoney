from sqlalchemy import ForeignKey
from sqlalchemy.orm import mapped_column, Mapped, relationship

from src.models.orm.orm_base import ORMBase


class Transaction(ORMBase):
    __tablename__ = "transaction"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    uuid: Mapped[str]

    accounting_id: Mapped[int] = mapped_column(ForeignKey("accounting.id"))

    payment_from: Mapped[int] = mapped_column(ForeignKey("user.id"))
    payment_to: Mapped[int] = mapped_column(ForeignKey("user.id"))

    amount: Mapped[float]

    # Relationship
    accounting: Mapped["Accounting"] = relationship(back_populates="transactions")

    payment_from_user: Mapped["User"] = relationship(foreign_keys=payment_from, back_populates="transactions_from")
    payment_to_user: Mapped["User"] = relationship(foreign_keys=payment_to, back_populates="transactions_to")
