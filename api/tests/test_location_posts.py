import pytest
from flask import json

def test_get(client):
    """ Tests that new posts can be added to a location """

    uri = 'http://localhost:5000/api/location/post?loc_id=1'
    response = client.post(
        uri,
        json={
            'user_id': 1,
            'parent_id': 1, 
            'content': 'some test post content'
        }
    )
    json_response = response.get_json()

    assert response.status_code == 200
    assert json_response['error'] == 'Success'
    assert json_response['post_id'] == 1
    

def test_get(client):
    """ Tests that posts can be retreived from the db from a location id """

    uri = 'http://localhost:5000/api/location/post?loc_id=1'
    response = client.get(uri)
    
    json_response = response.json
    dump = json.dumps(json_response)
    
    assert response.status_code == 200