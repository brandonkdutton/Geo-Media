from flask import Flask, request, json
from api.db import get_db
from flask_restful import reqparse, abort, Api, Resource
from werkzeug.security import generate_password_hash


class Register(Resource):

    # curl http://localhost:5000/api/user/register -d "id=1" -X GET
    def get(self):
        id = request.form['id']
        db = get_db()
        cursor = db.cursor()

        if not id:
            return 'No id was provided', 404

        cursor.execute('SELECT * from user WHERE id = (%s)', (id))
        user_data = cursor.fetchone()

        if not user_data:
            return 'No db entry found for user id: {}'.format(id), 404
        
        keys = ['id', 'username', 'password_hash']
        return_data = dict(zip(keys, user_data))

        return return_data, 200


    def post(self):
        """ Adds a new user to the database """

        json_data = request.get_json(force=True)
        username = json_data['username']
        password = json_data['password']

        db = get_db()
        cursor = db.cursor()
        error = None

        if not username:
            error = 'Username is required.'
        elif not password:
            error = 'Password is required.'
        else:
            cursor.execute('SELECT id FROM user WHERE username = (%s)', (username))
            if cursor.fetchone() is not None:
                error = 'user {} is already registered.'.format(username)
                
        if error is None:
            hash_password = generate_password_hash(password)
            cursor.execute('INSERT INTO user (username,password) VALUES (%s,%s)', (username, hash_password))
            db.commit()
            error = 'Regestration successfull.'

        return {
            'error': error
        }, 200