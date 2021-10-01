def test_get_all_locations(client, location_data):
    """Tests get functionality of all locations resource"""
    response = client.get("/api/locations/allLocations")
    assert response.status_code == 200
    assert response.json == {
        "locations": [
            {
                "locId": 1,
                "lat": "100.00000000000000000000",
                "lng": "-100.00000000000000000000",
            },
            {
                "locId": 2,
                "lat": "110.00000000000000000000",
                "lng": "-110.00000000000000000000",
            },
            {
                "locId": 3,
                "lat": "120.00000000000000000000",
                "lng": "-120.00000000000000000000",
            },
        ]
    }


def test_create_location(client):
    """Tests creation of a new location"""
    response = client.post("/api/locations/allLocations?lat=111.11&lng=22.22")
    assert response.status_code == 200
    assert response.json == {"newLocationId": 1}
