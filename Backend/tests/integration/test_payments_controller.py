from fastapi.testclient import TestClient


# T205
def test_create_payment(test_client: TestClient,
                        sql_lite_integration_cursor,
                        default_integration_test_group: str):
    response = test_client.post(f"/group/{default_integration_test_group}/payment",
                                headers={"x-user-name": "Tom"},
                                json={
                                    "description": "Nochmal Essen",
                                    "paid_by": "Tom",
                                    "participants": [
                                        "Gabi", "Tom"
                                    ],
                                    "amount": 25
                                })
    assert response.status_code == 200

    sql_lite_integration_cursor.execute('SELECT * FROM "payment"')
    payments = sql_lite_integration_cursor.fetchall()

    sql_lite_integration_cursor.execute('SELECT * FROM "payment_participants"')
    payment_participants = sql_lite_integration_cursor.fetchall()

    assert len(payments) == 3
    assert len(payment_participants) == 7
