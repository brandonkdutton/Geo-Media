from unittest import mock


@mock.patch("back_end.api.Resources.Users.JWT.validate", autospec=True)
def test_post_new(mock_jwt_validator, client, posts_at_location_data):
    """Tests the creation of a new post at a location"""

    mock_jwt_validator.return_value = {"sub": "123"}

    response = client.post(
        "/api/posts/atLocation/1?token=myFakeJWT",
        json={"title": "testTitle", "content": "testContent", "categories": [1, 3]},
    )

    assert response.status_code == 200
    assert response.json["newPostId"] == 4


def test_normal_get(client, posts_at_location_data):
    """Tests without filter or offset"""
    response = client.get("/api/posts/atLocation/1?limit=-1&filter=")
    assert response.status_code == 200
    assert response.json == {
        "minPostId": 0,  # non-inclusive, so correct to be zero
        "posts": [
            {
                "postId": 3,
                "userId": 1,
                "userName": "user1",
                "postTitle": "title 3",
                "postContent": "content 3",
                "locId": 1,
                "createdAt": "2021-09-30 01:48:29",
                "categories": [
                    {"id": 3, "name": "cat3"},
                ],
                "replies": [],
            },
            {
                "postId": 2,
                "userId": 1,
                "userName": "user1",
                "postTitle": "title 2",
                "postContent": "content 2",
                "locId": 1,
                "createdAt": "2021-09-30 01:48:29",
                "categories": [{"id": 1, "name": "cat1"}],
                "replies": [
                    {
                        "replyId": 3,
                        "userId": 1,
                        "userName": "user1",
                        "replyContent": "rely3",
                        "createdAt": "2021-09-30 01:48:29",
                        "postId": 2,
                    }
                ],
            },
            {
                "postId": 1,
                "userId": 1,
                "userName": "user1",
                "postTitle": "title 1",
                "postContent": "content 1",
                "locId": 1,
                "createdAt": "2021-09-30 01:48:29",
                "categories": [
                    {"id": 1, "name": "cat1"},
                    {"id": 2, "name": "cat2"},
                ],
                "replies": [
                    {
                        "replyId": 1,
                        "userId": 1,
                        "userName": "user1",
                        "replyContent": "rely1",
                        "createdAt": "2021-09-30 01:48:29",
                        "postId": 1,
                    },
                    {
                        "replyId": 2,
                        "userId": 1,
                        "userName": "user1",
                        "replyContent": "rely2",
                        "createdAt": "2021-09-30 01:48:29",
                        "postId": 1,
                    },
                ],
            },
        ],
    }


def test_filtered_one_tag(client, posts_at_location_data):
    """Tests filter by tag "OR" functionality. Currentley there is no "AND" """
    response = client.get("/api/posts/atLocation/1?limit=-1&filter=3")
    assert response.status_code == 200
    assert response.json == {
        "minPostId": 2,
        "posts": [
            {
                "postId": 3,
                "userId": 1,
                "userName": "user1",
                "postTitle": "title 3",
                "postContent": "content 3",
                "locId": 1,
                "createdAt": "2021-09-30 01:48:29",
                "categories": [{"id": 3, "name": "cat3"}],
                "replies": [],
            }
        ],
    }


def test_filtered_multiple_tags(client, posts_at_location_data):
    """Tests filter by tag "OR" functionality. Currentley there is no "AND" """
    response = client.get("/api/posts/atLocation/1?limit=-1&filter=1,2")
    assert response.status_code == 200
    assert response.json == {
        "minPostId": 0,
        "posts": [
            {
                "postId": 2,
                "userId": 1,
                "userName": "user1",
                "postTitle": "title 2",
                "postContent": "content 2",
                "locId": 1,
                "createdAt": "2021-09-30 01:48:29",
                "categories": [{"id": 1, "name": "cat1"}],
                "replies": [
                    {
                        "replyId": 3,
                        "userId": 1,
                        "userName": "user1",
                        "replyContent": "rely3",
                        "createdAt": "2021-09-30 01:48:29",
                        "postId": 2,
                    }
                ],
            },
            {
                "postId": 1,
                "userId": 1,
                "userName": "user1",
                "postTitle": "title 1",
                "postContent": "content 1",
                "locId": 1,
                "createdAt": "2021-09-30 01:48:29",
                "categories": [
                    {"id": 1, "name": "cat1"},
                    {"id": 2, "name": "cat2"},
                ],
                "replies": [
                    {
                        "replyId": 1,
                        "userId": 1,
                        "userName": "user1",
                        "replyContent": "rely1",
                        "createdAt": "2021-09-30 01:48:29",
                        "postId": 1,
                    },
                    {
                        "replyId": 2,
                        "userId": 1,
                        "userName": "user1",
                        "replyContent": "rely2",
                        "createdAt": "2021-09-30 01:48:29",
                        "postId": 1,
                    },
                ],
            },
        ],
    }


def test_offset(client, posts_at_location_data):
    """Tests that picks up where offset left off."""
    response = client.get("/api/posts/atLocation/1?limit=1&filter=")
    assert response.status_code == 200
    assert response.json == {
        "minPostId": 0,
        "posts": [
            {
                "postId": 1,
                "userId": 1,
                "userName": "user1",
                "postTitle": "title 1",
                "postContent": "content 1",
                "locId": 1,
                "createdAt": "2021-09-30 01:48:29",
                "categories": [
                    {"id": 1, "name": "cat1"},
                    {"id": 2, "name": "cat2"},
                ],
                "replies": [
                    {
                        "replyId": 1,
                        "userId": 1,
                        "userName": "user1",
                        "replyContent": "rely1",
                        "createdAt": "2021-09-30 01:48:29",
                        "postId": 1,
                    },
                    {
                        "replyId": 2,
                        "userId": 1,
                        "userName": "user1",
                        "replyContent": "rely2",
                        "createdAt": "2021-09-30 01:48:29",
                        "postId": 1,
                    },
                ],
            },
        ],
    }


def test_offset_with_filter(client, posts_at_location_data):
    """Tests that picks up where offset left off."""
    response = client.get("/api/posts/atLocation/1?limit=1&filter=2")
    assert response.status_code == 200
    assert response.json == {
        "minPostId": 0,
        "posts": [
            {
                "postId": 1,
                "userId": 1,
                "userName": "user1",
                "postTitle": "title 1",
                "postContent": "content 1",
                "locId": 1,
                "createdAt": "2021-09-30 01:48:29",
                "categories": [
                    {"id": 1, "name": "cat1"},
                    {"id": 2, "name": "cat2"},
                ],
                "replies": [
                    {
                        "replyId": 1,
                        "userId": 1,
                        "userName": "user1",
                        "replyContent": "rely1",
                        "createdAt": "2021-09-30 01:48:29",
                        "postId": 1,
                    },
                    {
                        "replyId": 2,
                        "userId": 1,
                        "userName": "user1",
                        "replyContent": "rely2",
                        "createdAt": "2021-09-30 01:48:29",
                        "postId": 1,
                    },
                ],
            },
        ],
    }
