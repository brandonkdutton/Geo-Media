from flask import request
from flask_restful import Resource
from api.Resources.Users.Auth import JWT
from api.db import get_db
from .query import query_categories, query_replies


class Post(Resource):
    """RESTful UserPosts resource. Handles actions upon individual posts"""

    def get(self, post_id):
        """Fetches most data for a specific post given its id"""
        db = get_db()
        cursor = db.cursor()

        cursor.execute(
            """
            select UserPosts.postId, UserPosts.userId, userName, postTitle, postContent, locId, createdAt from UserPosts 
                join Users on UserPosts.userId = Users.userId
                where postId = %s
            """,
            post_id,
        )
        result = cursor.fetchone()

        if result is None:
            return {"error": "Unable to find post with the given id"}, 400

        categories = query_categories(post_id)
        if categories is None:
            return {"error": "Unable to fetch categories for the given post"}, 400

        # get replies associated with each post
        reply_result = query_replies(post_id)
        if reply_result is None:
            return {"error": "unable to fetch replies for a post"}, 400

        data = {
            "postId": result[0],
            "userId": result[1],
            "userName": result[2],
            "postTitle": result[3],
            "postContent": result[4],
            "locId": result[5],
            "createdAt": str(result[6]),
            "categories": [{"id": c[0], "name": c[1]} for c in categories],
            "replies": [
                {
                    "replyId": c[0],
                    "userId": c[1],
                    "userName": c[2],
                    "replyContent": c[3],
                    "createdAt": str(c[4]),
                    "postId": post_id,
                }
                for c in reply_result
            ],
        }

        return {"post": data}, 200

    def put(self):
        """Handles updating an individual post"""
        json = request.get_json(force=True)
        title = json["title"]
        post_id = json["postId"]
        content = json["content"]
        new_categories = set(json["categories"])
        jwt_token = json["jwt"]

        jwt_payload = JWT.validate(jwt_token)
        if jwt_payload is None:
            return {"error": "You must be logged in to edit posts"}, 403

        db = get_db()
        cursor = db.cursor()
        cursor.execute("select userId from UserPosts where postId = %s", post_id)
        result = cursor.fetchone()

        if result is None:
            return {"error": "This post does not exist... ?????"}, 404
        elif result[0] != jwt_payload["user_id"]:
            return {
                "error": "You are not the owner of this post. Only the user who created it is allowed to edit it."
            }, 403

        old_categories = {c[0] for c in query_categories(post_id)}

        # delete each removed category
        for c_id in old_categories:
            if c_id not in new_categories:
                cursor.execute(
                    "delete from PostCategories where postId = %s and categoryId = %s",
                    (post_id, c_id),
                )
                db.commit()

        # add each new category
        cats_to_add = [
            (c_id, post_id) for c_id in new_categories if c_id not in old_categories
        ]
        cursor.executemany(
            "insert into PostCategories (categoryId, postId) values (%s, %s)",
            cats_to_add,
        )
        db.commit()

        # update post with new data
        cursor.execute(
            "update UserPosts set postContent = %s, postTitle = %s where postId = %s",
            (content, title, post_id),
        )
        db.commit()

        return 200
