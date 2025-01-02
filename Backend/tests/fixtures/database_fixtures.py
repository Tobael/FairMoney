import os
import shutil
import sqlite3

import pytest

from shared.db_query_service import DatabaseService
from shared.db_session_manager import get_db_session


@pytest.fixture
def sql_lite_cursor():
    empty_file_path = "files/sqlite_empty.db"
    sql_lite_db_path = "../sqlite_test/sqlite_asd2.db"

    os.environ["DB_PATH"] = "../sqlite_test/sqlite_asd2.db"

    os.makedirs(os.path.dirname(sql_lite_db_path), exist_ok=True)
    shutil.copy(empty_file_path, sql_lite_db_path)

    db_connection = sqlite3.connect(sql_lite_db_path)
    db_cursor = db_connection.cursor()
    yield db_cursor


@pytest.fixture
async def database_service(sql_lite_cursor):
    yield DatabaseService(db_session=await get_db_session())
