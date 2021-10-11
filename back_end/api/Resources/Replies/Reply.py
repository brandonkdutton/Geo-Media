from flask import request
from flask_restful import Resource
from api.Resources.Users import JWT, fetch_user_data
from api.db import get_db


class Reply(Resource):
    """RESTful Reply resource"""

    def get(self, reply_id):
        """Returns reply data given a reply id"""

        db = get_db()
        cursor = db.cursor()

        cursor.execute(
            """
            select replyId, UserReplies.userId, userName, replyContent, createdAt, postId from UserReplies 
                join Users on UserReplies.userId = Users.userId
                where replyId = %s
            """,
            reply_id,
        )
        result = cursor.fetchone()

        if result is None:
            return {"error": "error fetching reply data"}, 400

        data = {
            "replyId": result[0],
            "userId": result[1],
            "userName": result[2],
            "replyContent": result[3],
            "createdAt": str(result[4]),
            "postId": result[5],
        }

        return {"reply": data}, 200

    def put(self):
        """Updates a reply"""
        json = request.get_json(force=True)
        content = json["content"]
        jwt_token = json["jwt"]
        reply_id = json["replyId"]

        jwt_payload = JWT.validate(jwt_token)
        if jwt_payload is None:
            return {"error": "You must be logged in to edit a reply"}, 403

        db = get_db()
        cursor = db.cursor()
        cursor.execute("select userId from UserReplies where replyId = %s", reply_id)
        result = cursor.fetchone()

        if result is None:
            return {"error": "This reply does not exist... ????"}, 404
        elif result[0] != jwt_payload["user_id"]:
            return {
                "error": "You are not the owner of this reply. Only the user who created it is allowed to edit it."
            }, 403

        cursor.execute(
            "update UserReplies set replyContent = %s where replyId = %s",
            (content, reply_id),
        )
        db.commit()

        return 200

    def delete(self):
        """Deletes a reply"""
        json = request.get_json(force=True)
        reply_id = json["replyId"]
        jwt_token = json["jwt"]

        jwt_payload = JWT.validate(jwt_token)
        if jwt_payload is None:
            return {"error": "You must be logged in to delete a reply"}, 403

        db = get_db()
        cursor = db.cursor()
        cursor.execute("select userId from UserReplies where replyId = %s", reply_id)
        result = cursor.fetchone()

        if result is None:
            return {"error": "This post does not exist... ????"}, 404
        elif result[0] != jwt_payload["user_id"]:
            return {
                "error": "You are not the owner of this reply. Only the user who created it is allowed to delete it."
            }, 403

        cursor.execute("delete from UserReplies where replyId = %s", reply_id)
        db.commit()

        return 200
