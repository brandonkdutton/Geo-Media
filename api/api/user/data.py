from flask import Flask, request, json
from api.db import get_db
from flask_restful import reqparse, abort, Api, Resource
from werkzeug.security import generate_password_hash
from .auth import jwt_auth

class User_Data(Resource):

    def post(self):
        """ Fetches user data from the database """

        json_data = request.get_json(force=True)
        jwt_token = json_data['jwt_token']

        db = get_db()
        cursor = db.cursor()

        if jwt_token is None:
            return {'error': 'missing jwt token'}, 400

        auth_result = jwt_auth(jwt_token)

        if auth_result is None:
            return {'error': 'invalid jwt token'}, 403

        cursor.execute('SELECT id, username FROM user WHERE id = %s', (auth_result['user_id']))
        user_data = cursor.fetchone()
        if user_data is None:
            return {'error': 'user id decoded from jwt does not exist in the database'}, 400
        else:
            return {
                'id': user_data[0],
                'username': user_data[1]
            }, 200