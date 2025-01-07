from fastapi.testclient import TestClient


# T201
def test_get_group(test_client: TestClient,
                   sql_lite_integration_cursor,
                   default_integration_test_group: str):
    response = test_client.get(f"/group/{default_integration_test_group}")

    assert response.status_code == 200

    response_json = response.json()
    assert response_json["closed"] == False
    assert response_json["title"] == "Freundesgruppe"
    assert len(response_json["users"]) == 3
    assert response_json["uuid"] == default_integration_test_group


# T202
def test_create_group(test_client: TestClient,
                      sql_lite_integration_cursor):
    response = test_client.post("/group",
                                headers={"x-user-name": "Marie"},
                                json={
                                    "title": "Arbeitskollegen",
                                    "users": [
                                        {
                                            "name": "Marie",
                                            "paypal_me": ""
                                        },
                                        {
                                            "name": "Sebi",
                                            "paypal_me": "https://paypal.me/sebi"
                                        }
                                    ]
                                })

    assert response.status_code == 200

    sql_lite_integration_cursor.execute('SELECT * FROM "group"')
    groups = sql_lite_integration_cursor.fetchall()

    sql_lite_integration_cursor.execute('SELECT * FROM "user"')
    users = sql_lite_integration_cursor.fetchall()

    assert len(groups) == 2
    assert len(users) == 5


# T203
def test_close_group(test_client: TestClient,
                     sql_lite_integration_cursor,
                     default_integration_test_group: str):
    response = test_client.put(f"/group/{default_integration_test_group}/close",
                               headers={"x-user-name": "Tom"})

    assert response.status_code == 200

    sql_lite_integration_cursor.execute('SELECT * FROM "group"')
    groups = sql_lite_integration_cursor.fetchall()
    assert groups[0][3] == True


# T204
def test_get_group_history(test_client: TestClient,
                           sql_lite_integration_cursor,
                           default_integration_test_group: str):
    response = test_client.get(f"/group/{default_integration_test_group}/history")

    assert response.status_code == 200

    response_json = response.json()
    assert len(response_json) == 4
    assert response_json[0]["type"] == "PAYMENT"
    assert response_json[1]["type"] == "ACCOUTING"
    assert response_json[2]["type"] == "PAYMENT"
    assert response_json[3]["type"] == "CREATED"
