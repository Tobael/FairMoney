import contextlib
from typing import AsyncIterator, Annotated

from fastapi import HTTPException, Depends
from sqlalchemy.ext.asyncio import (
    AsyncConnection,
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)

# noinspection PyUnresolvedReferences
from src.models.orm.accounting import Accounting
# noinspection PyUnresolvedReferences
from src.models.orm.group import Group
from src.models.orm.orm_base import ORMBase
# noinspection PyUnresolvedReferences
from src.models.orm.payment import Payment
# noinspection PyUnresolvedReferences
from src.models.orm.payment_participants import payment_participants_table
# noinspection PyUnresolvedReferences
from src.models.orm.transaction import Transaction
# noinspection PyUnresolvedReferences
from src.models.orm.user import User


class DatabaseSessionManager:
    def __init__(self, host: str, engine_kwargs: dict[str, any] = {}):
        self._engine = create_async_engine(host, **engine_kwargs)
        self._sessionmaker = async_sessionmaker(autocommit=False, bind=self._engine)

    async def close(self):
        if self._engine is not None:
            await self._engine.dispose()

            self._engine = None
            self._sessionmaker = None

    @contextlib.asynccontextmanager
    async def connect(self) -> AsyncIterator[AsyncConnection]:
        if self._engine is None:
            raise HTTPException(status_code=500, detail="Database could not be initialized.")

        async with self._engine.begin() as connection:
            try:
                yield connection
            except Exception:
                await connection.rollback()
                raise

    @contextlib.asynccontextmanager
    async def session(self) -> AsyncIterator[AsyncSession]:
        if self._sessionmaker is None:
            raise HTTPException(status_code=500, detail="Database could not be initialized.")

        async with self._engine.begin() as connection:
            # await connection.run_sync(ORMBase.metadata.drop_all)  # todo
            await connection.run_sync(ORMBase.metadata.create_all)

        session = self._sessionmaker()
        try:
            yield session
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


sessionmanager = DatabaseSessionManager("sqlite+aiosqlite:///../sqlite/sqlite.db", {})


async def get_db_session():
    async with sessionmanager.session() as session:
        yield session


DBSessionDep = Annotated[AsyncSession, Depends(get_db_session)]
