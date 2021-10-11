from flask import request
from flask_restful import Resource
from api.db import get_db


class Categories_At_Location(Resource):
    """Resource for categories at a specific location"""

    def get(self, loc_id):

        if loc_id < 1:
            return {"categories": []}, 200

        db = get_db()
        cursor = db.cursor()

        # select categories that are used at a location
        cursor.execute(
            """
            select Categories.categoryId, Categories.categoryName from Categories
                where Categories.categoryId in (select PostCategories.categoryId from PostCategories
                    where PostCategories.postId in (select UserPosts.postId from UserPosts
                        where UserPosts.locId = %s
                    )
                )
        """,
            (loc_id),
        )

        result = cursor.fetchall()
        if result is None:
            return {"categories": []}, 200

        json_categories = [{"id": c[0], "name": c[1]} for c in result]
        end_offset = max((x["id"] for x in json_categories))

        return {
            "categories": json_categories,
            "endOffsetId": end_offset,
        }, 200
