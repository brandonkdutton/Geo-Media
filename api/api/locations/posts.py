from flask import Flask, request
import json
from api.db import get_db
from flask_restful import reqparse, abort, Api, Resource
import sqlparse
from collections import defaultdict
from .post_obj import PostObj


class Posts(Resource):
    def get(self):
        """Gets all posts for a location by its location id. Returns the post data formated
        in json such that the posts can be recursiveley rendered by the front end"""

        loc_id = int(request.args["loc_id"])

        db = get_db()
        cursor = db.cursor()
        cursor.execute(
            "SELECT post_id, loc_id, parent_id, user_id, username, created_at, content FROM post JOIN user ON user.id=post.user_id WHERE loc_id=%s ORDER BY post_id ASC",
            (loc_id),
        )
        posts = cursor.fetchall()

        if posts is not None:
            post_container = PostObj(posts)
            formated_posts = post_container.to_json()
            return {'posts': formated_posts}, 200
        else:
            return {'error': 'failed to fetch posts from db'}, 400

    def post(self):
        """ Adds a post to a location specified by an id and returns a the id of the new post"""
        json_data = request.get_json()

        loc_id = request.args["loc_id"]
        user_id = json_data["user_id"]
        parent_id = json_data["parent_id"]
        content = json_data["content"]

        db = get_db()
        cursor = db.cursor()

        if content == '':
            return {'error': 'no post content provided'}, 400

        try:
            cursor.execute(
                "INSERT INTO post (loc_id, user_id, parent_id, content) VALUES (%s,%s,%s,%s)",
                (loc_id, user_id, parent_id, content),
            )
            db.commit()

            cursor.execute("SELECT LAST_INSERT_ID()")
            new_post_id = cursor.fetchone()[0]

            if new_post_id is not None:
                return {'post_id': new_post_id}, 200
            else:
                return {'error': 'unable to fetch new post id'}, 400

        except Exception:
            return {'error': 'error inserting post into db'}, 400
