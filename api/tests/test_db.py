import pytest
from api.db import get_db


def test_init_db_command(runner):
    """ Tests that the init-db command works without crashing """

    result = runner.invoke(args=['init-db'])
    assert 'Initialized' in result.output


def test_get_db(app):
    "Tests that the same db is returned every time"

    with app.app_context():
        db = get_db()
        assert db is get_db()
