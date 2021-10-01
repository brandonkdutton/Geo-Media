from typing import Generator
import pytest
import json
from .api import create_app
from .api.db import get_db, init_db


def _json_to_queries(file: str) -> Generator:
    """yields one sql insert query per table for data in a given json file"""
    with open(file, "r") as f:
        data_to_add = json.load(f)

        for table in data_to_add:
            columns = ",".join(data_to_add[table][0].keys())
            holders = ("%s" for _ in data_to_add[table][0].values())

            format = ",".join(holders)
            query = f"insert into {table} ({columns}) values ({format})"
            data = [tuple(x.values()) for x in data_to_add[table]]

            yield query, data


@pytest.fixture
def app():
    app = create_app(
        {
            "TESTING": True,
            "SECRET_KEY": "password",
            "DATABASE": {
                "host": "127.0.0.1",
                "port": 3306,
                "user": "root",
                "password": "root",
                "db": "geo_test_db",
            },
        }
    )

    # reset db between tests
    with app.app_context():
        init_db()

    yield app


@pytest.fixture
def client(app):
    return app.test_client()


@pytest.fixture
def runner(app):
    return app.test_cli_runner()


@pytest.fixture
def location_data(app):
    with app.app_context():
        db = get_db()
        cursor = db.cursor()

        file = "back_end/tests/mock_data/locations.json"
        for query, data in _json_to_queries(file):
            cursor.executemany(query, data)
        db.commit()


@pytest.fixture
def category_data(app):
    with app.app_context():
        db = get_db()
        cursor = db.cursor()

        file = "back_end/tests/mock_data/category.json"
        for query, data in _json_to_queries(file):
            cursor.executemany(query, data)
        db.commit()


@pytest.fixture
def posts_at_location_data(app):
    with app.app_context():
        db = get_db()
        cursor = db.cursor()

        file = "back_end/tests/mock_data/post_at_location.json"
        for query, data in _json_to_queries(file):
            cursor.executemany(query, data)
        db.commit()
