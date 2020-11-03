import pytest

@pytest.mark.parametrize(('args','code'),(
    ('', 400),
    ('?lat=123.446&lon=453.456', 200)
))
def test_post(client, args, code):
    """ Tests that a location can be added successfully """

    uri = 'http://localhost:5000/api/location/near' + args
    response = client.post(uri)

    assert response.status_code == code

    if code == 200:
        data = response.get_json()
        assert data['loc_id'] > 0
        assert 'Success' in data['error']


@pytest.mark.parametrize(('args','code','found'),(
    ('', 400, []),
    ('?lat=34.433747&lon=-119.769143', 200, [1,2])
))
def test_get(client, args, code, found):
    """ Tests that nearest locations can be fetched successfully """

    uri = 'http://localhost:5000/api/location/near' + args
    response = client.get(uri)

    assert response.status_code == code

    if code == 200:
        parsed_response = response.get_json()
        ids = [loc for loc in parsed_response['near_locations']]
        
        assert ids == found


def test_all(client):
    """ Tests that all the locations can be fetched """

    uri = "http://localhost:5000/api/location/all"
    response = client.get(uri)
    json_response = response.get_json()

    assert response.status_code == 200
    assert json_response['error'] == 'Success'
    assert len(json_response['locations']) == 5
        