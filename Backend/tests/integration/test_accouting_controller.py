from fastapi.testclient import TestClient


# T206
def test_get_accounting_preview(test_client: TestClient,
                                sql_lite_integration_cursor,
                                default_integration_test_group: str):
    response = test_client.get(f"/group/{default_integration_test_group}/accounting/preview")

    assert response.status_code == 200
    response_json = response.json()

    assert response_json[0] == {
        "amount": 5.0,
        "payment_from": "Karl",
        "payment_to": "Tom"
    }
    assert response_json[1] == {
        "amount": 5.0,
        "payment_from": "Gabi",
        "payment_to": "Tom"
    }


# T207
def test_create_accounting(test_client: TestClient,
                           sql_lite_integration_cursor,
                           default_integration_test_group: str):
    response = test_client.post(f"/group/{default_integration_test_group}/accounting",
                                headers={"x-user-name": "Tom"})

    assert response.status_code == 200

    response_json = response.json()

    assert response_json[0] == {
        "amount": 5.0,
        "payment_from": "Karl",
        "payment_to": "Tom"
    }
    assert response_json[1] == {
        "amount": 5.0,
        "payment_from": "Gabi",
        "payment_to": "Tom"
    }

    sql_lite_integration_cursor.execute('SELECT * FROM "accounting"')
    accountings = sql_lite_integration_cursor.fetchall()

    sql_lite_integration_cursor.execute('SELECT * FROM "transaction"')
    transactions = sql_lite_integration_cursor.fetchall()

    sql_lite_integration_cursor.execute('SELECT * FROM "payment"')
    payments = sql_lite_integration_cursor.fetchall()

    assert len(accountings) == 2
    assert len(transactions) == 4

    assert payments[1][6] == 2  # Payment 2 is balanced by Accounting 2
