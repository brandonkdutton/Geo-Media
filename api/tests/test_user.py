import pytest
import jwt
import datetime
from flask import json, current_app

@pytest.mark.parametrize(('username', 'password', 'code'),(
    ('testUser1','P@ssW0rd1!abc123',200),
    ('test','sd32js$!Saf$#21sf', 403),
    ('','dassdaf@#$sadsfS', 400),
    ('test12333','', 400)
))
def test_register(app, client, username, password, code):
    """ Tests that api/user/register works as expected """
    response = client.post(
        'api/user/register',
        json={'username': username, 'password': password}
    )

    assert code == response.status_code


@pytest.mark.parametrize(('username', 'password', 'code'),(
    ('test','test',200),
    ('','dassdaf@#$sadsfS',400),
    ('test12344','',400)
))
def test_login(app, client, username, password, code):
    """ Tests that api/user/login generates correct errors and returns a login token only when the login is successfull """
    response = client.post(
        'api/user/login',
        json={'username': username, 'password': password}
    )

    assert code == response.status_code


@pytest.mark.parametrize(('jwt_param', 'code', 'optional_user_id'),(
    ("b'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2MDgxNTYwMTgsImlhdCI6MTYwODE1NTQxOCwidXNlcl9pZCI6MX0.9JtbgaWsV-CR5FIPYHWhWDviZRfO0j3NTZxWpmXXTkM'",403, None),
    (None,400, None),
    ('Generate',200, 1),
    ('Generate',400, 123)
))
def test_user_data(app, client, jwt_param, code, optional_user_id):
    """ Tests that api/user/data generates correct errors and returns a user data if a valid jwt token is provided """

    if jwt_param == 'Generate':
        with app.app_context():
            payload = {
                'exp': datetime.datetime.utcnow() + datetime.timedelta(days=0, seconds=86400),
                'iat': datetime.datetime.utcnow(),
                'user_id': optional_user_id
            }

            jwt_param = str(jwt.encode(
                payload,
                current_app.config['SECRET_KEY'],
                algorithm='HS256',
            ))

    response = client.post(
        'api/user/data',
        json={'jwt_token': jwt_param}
    )

    assert code == response.status_code