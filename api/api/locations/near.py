from flask import Flask, request, json
from api.db import get_db
from flask_restful import reqparse, abort, Api, Resource
import sqlparse


class Near(Resource):
    def get(self):
        """ return nearby location data if one exists, otherwise returns an error message """

        lat = round(float(request.args['lat']), 10)
        lon = round(float(request.args['lon']), 10)
        db = get_db()
        cursor = db.cursor()

        #query for locations within 25 miles of (lat, lon)
        query = "SELECT id, lat, lng, ( 6371 * acos( cos( radians({0}) ) * cos( radians( lat ) ) * cos( radians( lng ) - radians({1}) ) + sin( radians({0}) ) * sin(radians(lat)) ) ) AS distance FROM loc HAVING distance < 25 ORDER BY distance;".format(lat, lon)

        statements = sqlparse.split(query)
        for statement in statements:
            cursor.execute(statement)

        found = cursor.fetchall()

        if found:  
            parsed_response = [loc[0] for loc in found]
            error = 'Success'
        else:
            parsed_response = []
            error = 'No location found'

        return {
            'near_locations': parsed_response,
            'error': error
        }, 200


    def post(self):
        """ adds a new location to the db. returns the new location's id number """

        lat = round(float(request.args['lat']), 10)
        lon = round(float(request.args['lon']), 10)
        db = get_db()
        cursor = db.cursor()

        cursor.execute("INSERT INTO loc (lat, lng) VALUES (%s,%s)", (lat, lon))
        db.commit()
        cursor.execute("SELECT LAST_INSERT_ID()")

        error = None
        response = cursor.fetchone()

        if response is not None:
            loc_id = response[0]
            error = 'Success'
        else:
            loc_id = None
            error = 'Fail'

        return {
            'loc_id': loc_id,
            'error': error
        }, 200


'''
curl "http://localhost:5000/api/location/near?lat=12.456&lon=65.432"
'''