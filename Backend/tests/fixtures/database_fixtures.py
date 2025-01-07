import os
import shutil
import sqlite3

import pytest


@pytest.fixture
def sql_lite_cursor():
    return prepare_sql_lite_file("files/sqlite_empty.db")


@pytest.fixture
def sql_lite_integration_cursor():
    return prepare_sql_lite_file("files/sqlite_integration.db")


@pytest.fixture
def default_integration_test_group():
    return "b75c7a75-a5d8-40f8-8d15-231d1267982d"


def prepare_sql_lite_file(source_file: str):
    sql_lite_base_path = "../sqlite_test"

    os.makedirs(sql_lite_base_path, exist_ok=True)

    file_count = len([name for name in os.listdir(sql_lite_base_path)
                      if os.path.isfile(os.path.join(sql_lite_base_path, name))])

    sql_lite_db_path = f"{sql_lite_base_path}/sqlite_{file_count}.db"

    os.environ["DB_PATH"] = sql_lite_db_path

    shutil.copy(source_file, sql_lite_db_path)

    db_connection = sqlite3.connect(sql_lite_db_path)
    db_cursor = db_connection.cursor()
    return db_cursor
