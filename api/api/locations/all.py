from flask import Flask, request
from api.db import get_db
from flask_restful import Resource


class All(Resource):
    ''' Handles all api requests pertaining to all locations '''
    
    def get(self):
        ''' Returns a list of objects each containing the id and coordinates of an existing location '''
        db = get_db()
        cursor = db.cursor()

        cursor.execute('SELECT id, lat, lng from loc')
        response = cursor.fetchall()

        if response is None:
            return {'error': 'failed to fetch from db'}, 400
        else:
            parsed_response = [{
                'id': x[0], 
                'coordinates': [float(x[1]), float(x[2])]
            } for x in response]

            return {
              'locations': parsed_response
            }, 200  
