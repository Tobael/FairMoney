from datetime import datetime

from sqlalchemy import ForeignKey
from sqlalchemy.orm import mapped_column, Mapped, relationship

from src.models.orm.orm_base import ORMBase


class Accounting(ORMBase):
    """ORM Class for Accounting Table."""

    __tablename__ = "accounting"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    uuid: Mapped[str]

    group_id: Mapped[int] = mapped_column(ForeignKey("group.id"))

    created_at: Mapped[datetime]
    created_by: Mapped[int] = mapped_column(ForeignKey("user.id"))

    # Relationship
    group: Mapped["Group"] = relationship(back_populates="accountings")  # noqa: F821
    balances: Mapped[list["Payment"]] = relationship(back_populates="balanced_by_accounting")  # noqa: F821

    transactions: Mapped[list["Transaction"]] = relationship(back_populates="accounting")  # noqa: F821

    created_by_user: Mapped["User"] = relationship(back_populates="accountings_created")  # noqa: F821
