from flask import request
from back_end.api.db import get_db
from .Auth import decode_cognito_jwt
from flask_restful import Resource
from .query import fetch_user_data


class Session(Resource):
    """RESTful Session resource. Handles user sessions"""

    def get(self):
        """Gets user info from an established session via Cognito jwt token"""
        jwt_token = request.args.get("token", None)

        try:
            decoded_payload = decode_cognito_jwt(jwt_token)
        except TypeError:
            return 400

        if decoded_payload is None:
            return {"message", "Session is no longer valid"}, 401

        token_data = {
            key: decoded_payload[key]
            for key in ["sub", "email_verified", "cognito:username", "email"]
        }

        db_user_data = fetch_user_data(sub=token_data["sub"])

        db = get_db()
        cursor = db.cursor()

        if db_user_data is None:
            cursor.execute(
                "insert into Users (cognitoSub, username, email, emailVerified) values (%s, %s, %s, %s);",
                (
                    token_data["sub"],
                    token_data["cognito:username"],
                    token_data["email"],
                    token_data["email_verified"],
                ),
            )
            db.commit()
            cursor.execute("select LAST_INSERT_ID()")
            new_id = cursor.fetchone()[0]
            new_user = fetch_user_data(user_id=new_id)
            return {"user": new_user}, 200

        if (
            db_user_data["username"] != token_data["cognito:username"]
            or db_user_data["email"] != token_data["email"]
            or db_user_data["emailVerified"] != token_data["email_verified"]
        ):
            cursor.execute(
                "update Users set username = %s, email = %s, emailVerified = %d where userId  = %s",
                (
                    token_data["cognito:username"],
                    token_data["email"],
                    token_data["email_verified"],
                    db_user_data["userId"],
                ),
            )
            db.commit()

            updated_db_data = fetch_user_data(user_id=db_user_data["userId"])
            return {"user": updated_db_data}, 200

        return {
            "user": db_user_data,
        }, 200
