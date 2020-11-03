import jwt
import pytest
import datetime
from api.user import jwt_auth
from flask import current_app


def test_login_token_auth(app):
    """ Test that a jwt login token can be decoded and validated """

    payload = {
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=0, seconds=600),
        'iat': datetime.datetime.utcnow(),
        'user_id': 123
    }

    with app.app_context():
        login_token = str(jwt.encode(
            payload,
            current_app.config['SECRET_KEY'],
            algorithm='HS256',
        ))

        decoded_token = jwt_auth(login_token)

    assert payload == decoded_token
