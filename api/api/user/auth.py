from flask import current_app
from api.db import get_db
import functools
import jwt

def jwt_auth(auth_token):

    if isinstance(auth_token, str):
        auth_token=bytes(auth_token[2:-1], 'utf-8')

    try:
        payload = jwt.decode(auth_token, current_app.config.get('SECRET_KEY'), algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        return None # Expired Token
    except jwt.InvalidTokenError:
        return None # Invalid Token
