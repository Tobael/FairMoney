import contextlib
import os
from typing import AsyncIterator, Annotated

from fastapi import HTTPException, Depends
from sqlalchemy.ext.asyncio import (
    AsyncConnection,
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)

# noinspection PyUnresolvedReferences
from models.orm.accounting import Accounting  # noqa: 401
# noinspection PyUnresolvedReferences
from models.orm.group import Group  # noqa: 401
from models.orm.orm_base import ORMBase
# noinspection PyUnresolvedReferences
from models.orm.payment import Payment  # noqa: 401
# noinspection PyUnresolvedReferences
from models.orm.payment_participants import payment_participants_table  # noqa: 401
# noinspection PyUnresolvedReferences
from models.orm.transaction import Transaction  # noqa: 401
# noinspection PyUnresolvedReferences
from models.orm.user import User  # noqa: 401


class DatabaseSessionManager:
    """
    Manages the database session and connection.

    Attributes:
        _engine (AsyncEngine): The SQLAlchemy async engine.
        _sessionmaker (async_sessionmaker): The SQLAlchemy async session maker.
    """

    def __init__(self, host: str, engine_kwargs: dict[str, any] = {}):
        self._engine = create_async_engine(host, **engine_kwargs)
        self._sessionmaker = async_sessionmaker(autocommit=False, bind=self._engine)

    async def close(self):
        """Closes the database engine and session maker."""
        if self._engine is not None:
            await self._engine.dispose()

            self._engine = None
            self._sessionmaker = None

    @contextlib.asynccontextmanager
    async def connect(self) -> AsyncIterator[AsyncConnection]:
        """
        Provides a context manager for an asynchronous database connection.

        Yields:
            AsyncIterator[AsyncConnection]: The asynchronous database connection.

        Raises:
            HTTPException: If the database engine is not initialized.
        """
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
        """
        Provides a context manager for an asynchronous database session and ensures that tables exist.

        Yields:
            AsyncIterator[AsyncSession]: The asynchronous database session.

        Raises:
            HTTPException: If the session maker is not initialized.
        """
        if self._sessionmaker is None:
            raise HTTPException(status_code=500, detail="Database could not be initialized.")

        async with self._engine.begin() as connection:
            #  await connection.run_sync(ORMBase.metadata.drop_all)  # todo
            await connection.run_sync(ORMBase.metadata.create_all)

        session = self._sessionmaker()
        try:
            yield session
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


sessionmanager = DatabaseSessionManager(f"sqlite+aiosqlite:///{os.getenv("DB_PATH")}", {})


async def get_db_session():
    """
    Dependency function to provide a singleton database session.

    Yields:
        AsyncSession: The asynchronous database session.
    """
    async with sessionmanager.session() as session:
        yield session


DBSessionDep = Annotated[AsyncSession, Depends(get_db_session)]
