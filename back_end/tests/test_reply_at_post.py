from unittest import mock


@mock.patch("back_end.api.Resources.Users.JWT.validate", autospec=True)
def test_create_reply_at_post(mock_jwt_validator, client, posts_at_location_data):
    """Tests creation of a reply to a post"""

    mock_jwt_validator.return_value = {"sub": "123"}

    response = client.post(
        "/api/reply/atPost/1?token=myFakeJWT",
        json={"content": "newReplyContent"},
    )

    assert response.status_code == 200
    assert response.json == {"newReplyId": 4}
