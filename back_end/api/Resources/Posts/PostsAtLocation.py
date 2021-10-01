from flask import request
from flask_restful import Resource
from .query import query, query_categories, query_replies
from back_end.api.db import get_db
from back_end.api.Resources.Users import JWT
from back_end.api.Resources.Users import fetch_user_data


class PostsAtLocation(Resource):
    """RESTful resource to handle actions upon all the posts at a given location"""

    def get(self, loc_id):
        """Fetches most recent posts given start id, location id, and filter criteria"""

        try:
            limit_id = int(request.args["limit"])
            filters = request.args.get("filter", None).split(",")
        except KeyError:
            return {"message": "query string missing limit argument"}, 400
        except AttributeError:
            return {
                "message": "query string missing filter arg, or it is in an invalid format"
            }, 400

        if limit_id == 0:
            return {"message": "There are no more posts"}, 404

        # get the posts
        result = query(limit_id, filters, loc_id)

        if result is None:
            return {"message": "unable to fetch posts"}, 400
        elif len(result) < 1:
            return {"message": "No posts found"}, 404

        json_result = []
        for i in range(len(result)):
            post_tuple = result[i]
            post_id = post_tuple[0]

            # get categories associated with post
            category_result = query_categories(post_id)
            if category_result is None:
                return {"message": "unable to fetch categories for a post"}

            # get replies associated with each post
            reply_result = query_replies(post_id)
            if reply_result is None:
                return {"message": "unable to fetch replies for a post"}

            json_result.append(
                {
                    "postId": post_id,
                    "userId": post_tuple[1],
                    "userName": post_tuple[2],
                    "postTitle": post_tuple[3],
                    "postContent": post_tuple[4],
                    "locId": post_tuple[5],
                    "createdAt": str(post_tuple[6]),
                    "categories": [{"id": c[0], "name": c[1]} for c in category_result],
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
            )

        return {"minPostId": result[-1][0] - 1, "posts": json_result}, 200

    def post(self, loc_id):
        """Handles new post creation. Must be logged in to post"""
        json = request.get_json(force=True)
        args = request.args

        try:
            jwt_token = args["token"]
            title = json.get("title", None)
            content = json.get("content", None)
            categories = json.get("categories", None)
        except KeyError:
            return {"message": "Missing one or more required arguments"}, 400

        if title is None or content is None or categories is None or loc_id is None:
            return {
                "message": "Missing one or more required arguments/form fields"
            }, 400

        if jwt_token == "null":
            sub = "guest_user"
        else:
            try:
                jwt_payload = JWT.validate(jwt_token)
            except TypeError:
                if jwt_token != "null":
                    return {"message": "malformed jwt token provided"}, 400

            if jwt_payload is None:
                return {"message", "Session is no longer valid. Please re-login."}, 403

            sub = jwt_payload["sub"]

        user_data = fetch_user_data(sub=sub)
        user_id = user_data["userId"]

        db = get_db()
        cursor = db.cursor()

        # insert the UserPost
        cursor.execute(
            "insert into UserPosts (userId, locId, postTitle, postContent) values (%s, %s, %s, %s)",
            (user_id, loc_id, title, content),
        )
        db.commit()

        # get id of new post
        cursor.execute("select LAST_INSERT_ID();")
        new_post_id = cursor.fetchone()[0]

        # insert categories into PostCategories
        args = [(new_post_id, c) for c in categories]
        cursor.executemany(
            "insert into PostCategories (postId, categoryId) values (%s, %s)", args
        )
        db.commit()

        return {"newPostId": new_post_id}, 200
