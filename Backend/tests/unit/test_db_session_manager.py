import pytest

from shared.db_session_manager import get_db_session


# T109
@pytest.mark.asyncio
async def test_get_db_session(sql_lite_cursor):
    db_session_manager = await get_db_session()
    assert db_session_manager is not None

    sql_lite_cursor.execute('SELECT * FROM sqlite_master')
    tables = sql_lite_cursor.fetchall()
    table_names = [t[1] for t in tables]
    table_names.sort()
    assert table_names == ['accounting',
                           'group',
                           'payment',
                           'payment_participants',
                           'transaction',
                           'user']
