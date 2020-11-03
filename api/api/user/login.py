from flask import Flask, request, json, current_app
from api.db import get_db
from flask_restful import reqparse, abort, Api, Resource
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime


class Login(Resource):

    def post(self):
        json_data = request.get_json(force=True)
        username = json_data['username']
        password = json_data['password']
        error = None
        login_token = None

        if not username:
            error = 'Missing username'
        elif not password:
            error = 'Missing password'
        else:
            db = get_db()
            cursor = db.cursor()

            cursor.execute('SELECT id, password FROM user WHERE username=(%s)', (username))
            user_data = cursor.fetchone()
            stored_password = user_data[1]

            if stored_password is None:
                error = 'Incorrect username'
            elif not check_password_hash(stored_password, password):
                error = 'Incorrect password'
            else:
                user_id = user_data[0]
                try:
                    payload = {
                        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=0, seconds=600),
                        'iat': datetime.datetime.utcnow(),
                        'user_id': user_id
                    }
                    login_token = str(jwt.encode(
                        payload,
                        current_app.config['SECRET_KEY'],
                        algorithm='HS256'
                    ))
                    error = 'Login Successfull'
                except Exception as e:
                    error = str(e)
        return {
            'login_token': login_token,
            'error': error
        }, 200
        
