import pytest
import sqlparse
from api import create_app
from api.db import get_db, init_db
from werkzeug.security import generate_password_hash
from test_post_data import test_post_data as post_data


@pytest.fixture
def app():

    app = create_app({
        'TESTING': True,
        'SECRET_KEY': 'password',
        'DATABASE': {
            'host': '127.0.0.1',
            'port': 3306,
            'user': 'root',
            'password': 'testpassword',
            'db': 'sys'
        },
    })

    # create local db and insert test data
    with app.app_context():
        init_db()
        db = get_db()
        cursor = db.cursor()

        #insert test user data
        for username in ['test','user']:
            hash_password = generate_password_hash(username)
            cursor.execute("INSERT into user (username, password) VALUES (%s,%s)", (username, hash_password))
        db.commit()
        
        #insert test position data
        corods=[('34.437358', '-119.762188'),('34.420344', '-119.825468'),('33.822334', '-117.782780'),('34.154131', '-117.246501'),('34.044078', '-118.261032')]
        for coord in corods:
            cursor.execute("INSERT INTO loc (lat, lng) VALUES (%s,%s)", coord)
        db.commit()

        #insert test post data
        test_post_data = post_data()
        for p in test_post_data:
            cursor.execute(
                "INSERT INTO post (loc_id, user_id, parent_id, content) VALUES (%s,%s,%s,%s)", 
                (p['loc_id'], p['user_id'], p['parent_id'], p['content'])
            )
        db.commit()

    yield app


@pytest.fixture
def client(app):
    return app.test_client()


@pytest.fixture
def runner(app):
    return app.test_cli_runner()