from flask import Flask, request
from api.db import get_db
from flask_restful import reqparse, abort, Api, Resource


class All(Resource):

    def get(self):
        """ Returns list of id's of all the locations that exist within the DB """

        error = None
        db = get_db()
        cursor = db.cursor()

        cursor.execute("SELECT id, lat, lng from loc")
        response = cursor.fetchall()

        if response is not None:
            error = 'Success'
            parsed_response = [{
                'id': x[0],
                'coordinates': [float(x[1]), float(x[2])]
            } for x in response]
        else:
            parsed_response = []
            error = 'DB querry error'

        return {
            'locations': parsed_response,
            'error': error
        }, 200
