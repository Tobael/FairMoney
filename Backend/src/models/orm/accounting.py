from datetime import datetime

from sqlalchemy import ForeignKey
from sqlalchemy.orm import mapped_column, Mapped, relationship

from src.models.orm.orm_base import ORMBase


class Accounting(ORMBase):
    __tablename__ = "accounting"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    uuid: Mapped[str]

    group_id: Mapped[int] = mapped_column(ForeignKey("group.id"))

    created_at: Mapped[datetime]
    created_by: Mapped[int] = mapped_column(ForeignKey("user.id"))

    # Relationship
    group: Mapped["Group"] = relationship(back_populates="accountings")
    balances: Mapped[list["Payment"]] = relationship(back_populates="balanced_by_accounting")

    transactions: Mapped[list["Transaction"]] = relationship(back_populates="accounting")

    created_by_user: Mapped["User"] = relationship(back_populates="accountings_created")
