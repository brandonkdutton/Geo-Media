from flask import Flask
from flask_restful import Api
from flask_cors import CORS
from back_end import config
from . import db


def create_app(test_config=None):
    app = Flask(__name__, instance_relative_config=True)

    api = Api(app)

    cord = CORS(app, resources={r"/api/*": {"origins": "*"}})

    if test_config is None:
        app.config.from_object(config)
    else:
        app.config.from_mapping(test_config)

    db.init_app(app)

    from .Resources import Users, Categories, Posts, Replies, Locations

    # setup the RESTful resources
    api.add_resource(Users.User, "/api/user/")
    api.add_resource(Users.Session, "/api/user/session")
    api.add_resource(Categories.Categories, "/api/categories")
    api.add_resource(Posts.Post, "/api/post/<int:post_id>")
    api.add_resource(
        Posts.PostsAtLocation, "/api/posts/atLocation/<int(signed=True):loc_id>"
    )
    api.add_resource(Replies.Reply, "/api/reply/<int:reply_id>")
    api.add_resource(Replies.ReplyAtPost, "/api/reply/atPost/<int:post_id>")
    api.add_resource(Locations.AllLocations, "/api/locations/allLocations")

    return app
