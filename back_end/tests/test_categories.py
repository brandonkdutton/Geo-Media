from back_end.api.db import get_db


def test_get_categories_no_offset(client, category_data):
    """Tests get functionality of categories resource"""
    response = client.get("/api/categories?offset=0")
    assert response.status_code == 200
    assert response.json == {
        "categories": [
            {"id": 1, "name": "cat1"},
            {"id": 2, "name": "cat2"},
            {"id": 3, "name": "cat3"},
            {"id": 4, "name": "cat4"},
        ],
        "endOffsetId": 4,
    }


def test_get_categories_with_offset(client, category_data):
    """Tests get functionality of categories resource"""
    response = client.get("/api/categories?offset=2")
    assert response.status_code == 200
    assert response.json == {
        "categories": [
            {"id": 3, "name": "cat3"},
            {"id": 4, "name": "cat4"},
        ],
        "endOffsetId": 4,
    }


def test_create_new_category(client):
    """Tests create category functionality"""
    response = client.post("/api/categories?name=newCatName")
    assert response.status_code == 200
    assert response.json == {"id": 1, "name": "newCatName"}


def test_create_existing_category(app, client, category_data):
    """If category name already exists, will return existing instead of creating a new"""
    response = client.post("/api/categories?name=cat3")
    assert response.status_code == 200
    assert response.json == {"id": 3, "name": "cat3"}

    # test that no new entry was added
    with app.app_context():
        db = get_db()
        cursor = db.cursor()

        cursor.execute("select * from Categories")
        result = cursor.fetchall()

        assert len(result) == 4
