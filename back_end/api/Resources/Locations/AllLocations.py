from flask import request
from flask_restful import Resource
from api.Resources.Users.Auth import JWT
from api.db import get_db


class AllLocations(Resource):
    """RESTful resource for All the locations at once. Handles actions upon individual posts"""

    def get(self):
        """Fetches position and id data from all locations"""
        db = get_db()
        cursor = db.cursor()

        cursor.execute("select locId, lat, lng from Locations;")
        results = cursor.fetchall()

        if results is None:
            return {"error": "Found no locations"}, 404

        data = [
            {"locId": loc[0], "lat": str(loc[1]), "lng": str(loc[2])} for loc in results
        ]
        return {"locations": data}, 200

    def post(self):
        """Creates a new location at a specified lat and lng"""
        args = request.args

        try:
            lat = args["lat"]
            lng = args["lng"]
        except KeyError:
            return {"message": "Missing one or more required arguments"}, 400

        try:
            lat = float(lat)
            lng = float(lng)
        except ValueError:
            return {
                "message": "Arguments: lat and/or lng cannot be converted to float"
            }, 400

        db = get_db()
        cursor = db.cursor()

        cursor.execute("insert into Locations (lat, lng) values(%s, %s)", (lat, lng))
        db.commit()

        cursor.execute("select LAST_INSERT_ID();")
        new_location_id = cursor.fetchone()[0]

        return {"newLocationId": new_location_id}, 200
