from flask import request
from flask_restful import Resource
from back_end.api.Resources.Users import JWT, fetch_user_data
from back_end.api.db import get_db


class ReplyAtPost(Resource):
    """ RESTful Reply resource """

    def post(self, post_id):
        """ Adds a reply to a post """
        json = request.get_json(force=True)
        args = request.args

        try: 
            content = json["content"]
            jwt_token = args["token"]
        except KeyError:
            return {"message": "Missing one or more required arguments"}, 400
        
        if jwt_token == "null":
            sub = "guest_user"
        else:
            jwt_payload = JWT.validate(jwt_token)
            if jwt_payload is None:
                return {"message": "Session is no longer valid. Please re-login."}, 403
                
            sub=jwt_payload["sub"]

        user_data = fetch_user_data(sub=sub)
        user_id = user_data["userId"]

        db = get_db()
        cursor = db.cursor()

        cursor.execute(
            "insert into UserReplies (userId, postId, replyContent) values (%s, %s, %s)",
            (user_id, post_id, content),
        )
        db.commit()

        cursor.execute("select LAST_INSERT_ID();")
        new_reply_id = cursor.fetchone()[0]

        return {"newReplyId": new_reply_id}, 200