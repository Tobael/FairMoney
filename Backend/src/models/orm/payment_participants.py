from sqlalchemy import ForeignKey, Table, Column

from src.models.orm.orm_base import ORMBase

payment_participants_table = Table(
    "payment_participants",
    ORMBase.metadata,
    Column("participant_id", ForeignKey("user.id")),
    Column("payment_id", ForeignKey("payment.id")),
)
