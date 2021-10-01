from flask import request
from flask_restful import Resource
import pymysql
from back_end.api.db import get_db


class Categories(Resource):
    """RESTful Categories resource"""

    def get(self):
        """Returns 200 most recently created categories after an offset id"""

        try:
            offset = request.args["offset"]
        except KeyError:
            return {"message": "missing one or more required arguments"}, 400

        db = get_db()
        cursor = db.cursor()
        cursor.execute(
            """
            select categoryId, categoryName from Categories
            where categoryId > %s
            limit 200;
        """,
            (offset),
        )
        result = cursor.fetchall()

        if result is None:
            return {"error": "Unable to fetch categories"}, 400

        json_categories = [
            {"id": cat_tuple[0], "name": cat_tuple[1]} for cat_tuple in result
        ]

        end_offset = max((x["id"] for x in json_categories))
        return {
            "categories": json_categories,
            "endOffsetId": end_offset,
        }, 200

    def post(self):
        """Creates a new category"""
        args = request.args

        try:
            category_name = args["name"]
        except KeyError:
            return {"message": "missing one or more required arguments"}, 400

        db = get_db()
        cursor = db.cursor()

        cursor.execute(
            "select categoryId, categoryName from Categories where categoryName = %s",
            (category_name),
        )
        result = cursor.fetchone()

        if result is not None:
            return {"id": result[0], "name": result[1]}, 200

        cursor.execute(
            "insert into Categories (categoryName) values (%s);", (category_name)
        )
        db.commit()

        cursor.execute("select LAST_INSERT_ID();")
        new_category_id = cursor.fetchone()[0]

        return {"id": new_category_id, "name": category_name}, 200

    def put(self):
        """Updates the name of a category"""
        json_data = request.get_json(force=True)
        category_id = json_data["id"]
        new_name = json_data["name"]

        db = get_db()
        cursor = db.cursor()

        cursor.execute(
            "update Categories set categoryName=%s where categoryId = %s;",
            (new_name, category_id),
        )
        db.commit()

        return 200
