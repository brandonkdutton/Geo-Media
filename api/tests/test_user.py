import pytest
from flask import json

@pytest.mark.parametrize(('username', 'password', 'message'),(
    ('testUser1','P@ssW0rd1!abc123','success'),
    ('test','sd32js$!Saf$#21sf', 'already registered'),
    ('','dassdaf@#$sadsfS','required'),
    ('test12333','','required')
))
def test_register(app, client, username, password, message):
    """ Tests that api/user/register works as expected """
    response = client.post(
        'api/user/register',
        json={'username': username, 'password': password}
    ).get_json()

    assert message in response['error']


@pytest.mark.parametrize(('username', 'password', 'message'),(
    ('test','test','Login Successfull'),
    ('','dassdaf@#$sadsfS','Missing username'),
    ('test12344','','Missing password')
))
def test_login(app, client, username, password, message):
    """ Tests that api/user/login generates correct errors and returns a login token only when the login is successfull """
    response = client.post(
        'api/user/login',
        json={'username': username, 'password': password}
    ).get_json()

    error = response['error']
    assert message in error

    if error == 'Login Successfull':
        assert response['login_token'] is not None
    else:
        assert response['login_token'] is None