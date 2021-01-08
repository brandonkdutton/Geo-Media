# Geo-Media
A Location based message board to encourage you to go new places. Full stack, responsive, mobile friendly. 

Whenever you visit somewhere new you can create the first post for that area. People who visit that area can then comment or make their own posts. You can view posts from anywhere, but can only post to locations within 25 miles of where you are at the time.

This is a work in progress.

Live version of the app: https://geomedia.brandondutton.com/

To run react app in development mode:
1. Navigate to /React-App directory for all the following steps.
2. Run "npm install".
3. Run "npm start".

To run api in development mode:
1. Navigate to /api directory for all of the following steps.
2. Run "pip install requirements.txt"
3. Enter your database connection info into config.py
4. Enter your secret key into field in config.py
3. Run "export FLASK_APP=api"
4. Run "flask init-db"
5. Run "flask run"

To install on a web server use any standard configuration for a react app with a flask api. Nginx configuration and ubuntu service files are provided in /server-configs directory


