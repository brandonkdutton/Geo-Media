import os
from pathlib import Path
from flask import Flask
import flask_restful
from flask_restful import Api, Resource
from flask_cors import CORS
from importlib.machinery import SourceFileLoader
import config

def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)

    api = Api(app)
    cors = CORS(app, resources={r"/api/*": {"origins": "http://localhost:*"}})

    #test_config = None
    if test_config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_object(config)
    else:
        # load the test config if passed in
        app.config.from_mapping(test_config)
    
    from . import db
    db.init_app(app)

    from . import user
    from . import locations
    api.add_resource(user.Register, '/api/user/register')
    api.add_resource(user.Login, '/api/user/login')
    api.add_resource(locations.Near, '/api/location/near')
    api.add_resource(locations.Posts, '/api/location/post')
    api.add_resource(locations.All, '/api/location/all')



    
    #app.add_url_rule('/', endpoint='index')

    return app
