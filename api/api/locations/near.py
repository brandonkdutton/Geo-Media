from flask import Flask, request, json
from api.db import get_db
from flask_restful import reqparse, abort, Api, Resource
import sqlparse


class Near(Resource):
    def get(self):
        ''' return list of nearby location ids '''

        lat = round(float(request.args['lat']), 10)
        lon = round(float(request.args['lon']), 10)
        db = get_db()
        cursor = db.cursor()

        #query for locations within 25 miles of (lat, lon)
        query = "SELECT id, lat, lng, ( 6371 * acos( cos( radians({0}) ) * cos( radians( lat ) ) * cos( radians( lng ) - radians({1}) ) + sin( radians({0}) ) * sin(radians(lat)) ) ) AS distance FROM loc HAVING distance < 25 ORDER BY distance;".format(lat, lon)

        cursor.execute(query)
        result = cursor.fetchall()

        if result is not None:  
            return {
                'locations': [loc[0] for loc in result]
            }, 200
        else:
            return {
                'error': 'failed to fetch from db'
            }, 400

    def post(self):
        """ adds a new location to the db. returns the new location's id number """

        lat = round(float(request.args['lat']), 10)
        lon = round(float(request.args['lon']), 10)
        db = get_db()
        cursor = db.cursor()

        try:
            cursor.execute("INSERT INTO loc (lat, lng) VALUES (%s,%s)", (lat, lon))
            db.commit()
            cursor.execute("SELECT LAST_INSERT_ID()")

            response = cursor.fetchone()
            if response is not None:
                return {
                    'location': response[0]
                }, 200
            else:
                return {
                    'error': 'failed to fetch id of new location'
                }, 400
        except Exception:
            return {
                'error': 'failed to insert into db'
            }, 400