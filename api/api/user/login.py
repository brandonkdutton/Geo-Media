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
        login_token = None
        user_id = None

        if not username:
            return {'error': 'Missing username'}, 400
        if not password:
            return {'error': 'Missing password'}, 400

        db = get_db()
        cursor = db.cursor()

        cursor.execute('SELECT id, username, password FROM user WHERE username=(%s)', (username))
        user_data = cursor.fetchone()

        if user_data is None:
            return {'error': 'Incorrect username or password'}, 403

        stored_password = user_data[2]

        if not check_password_hash(stored_password, password):
            return {'error': 'Incorrect username or password'}, 403

        user_id = user_data[0]
        username = user_data[1]
        try:
            payload = {
                'exp': datetime.datetime.utcnow() + datetime.timedelta(days=0, seconds=86400),
                'iat': datetime.datetime.utcnow(),
                'user_id': user_id
            }
            login_token = str(jwt.encode(
                payload,
                current_app.config['SECRET_KEY'],
                algorithm='HS256'
            ))

            return {
                'jwt': login_token,
            }, 200

        except Exception as e:
            return {'error': str(e)}, 500
        
