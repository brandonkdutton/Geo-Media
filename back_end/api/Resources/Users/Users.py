from flask import request
from api.db import get_db
from flask_restful import Resource
from werkzeug.security import generate_password_hash


class User(Resource):
    def get(self):
        """ Returns the 500 most recentley users """
        db = get_db()
        cursor = db.cursor()
        cursor.execute(
            "select userId, userName from Users order by userName asc limit 500;"
        )
        result = cursor.fetchall()

        if result is None:
            return {"error": "Failed to fetch users"}, 400
        else:
            json_users = [
                {"id": uname_tuple[0], "name": uname_tuple[1]} for uname_tuple in result
            ]
            return {"users": json_users}, 200

    def post(self):
        """ Adds a user to the database """

        json_data = request.get_json(force=True)
        username = json_data["username"]
        password = json_data["password"]

        db = get_db()
        cursor = db.cursor()

        if not username:
            return {"error": "Username is required."}, 400
        if not password:
            return {"error": "Password is required."}, 400

        cursor.execute("select userId from Users where userName = (%s)", (username))
        if cursor.fetchone() is not None:
            return {"error": f"user {username} is already registered."}, 403

        hash_password = generate_password_hash(password)
        cursor.execute(
            "insert into Users (userName, password) values (%s, %s);",
            (username, hash_password),
        )
        db.commit()

        return 200

    def put(self):
        pass
