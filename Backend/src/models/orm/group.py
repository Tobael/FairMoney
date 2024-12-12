from datetime import datetime

from models.orm.orm_base import ORMBase
from sqlalchemy import ForeignKey
from sqlalchemy.orm import mapped_column, Mapped, relationship


class Group(ORMBase):
    """ORM Class for Group Table."""

    __tablename__ = "group"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    uuid: Mapped[str]
    title: Mapped[str]
    closed: Mapped[bool]

    created_at: Mapped[datetime]
    created_by: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=True)

    closed_at: Mapped[datetime] = mapped_column(nullable=True)
    closed_by: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=True)

    # Relationship
    users: Mapped[list["User"]] = relationship(back_populates="group",  # noqa: F821
                                               foreign_keys="User.group_id",
                                               post_update=True)

    payments: Mapped[list["Payment"]] = relationship(back_populates="group")  # noqa: F821
    accountings: Mapped[list["Accounting"]] = relationship(back_populates="group")  # noqa: F821

    created_by_user: Mapped["User"] = relationship(back_populates="group_created",  # noqa: F821
                                                   foreign_keys=created_by,
                                                   post_update=True)

    closed_by_user: Mapped["User"] = relationship(back_populates="group_closed",  # noqa: F821
                                                  foreign_keys=closed_by)
