# Geo-Media-Refactor-V2

## What's this?

A location-based message board allowing users to share, comment, and document the current situation anywhere in the world.

## Live app:

<a href="https://geomedia.brandon-dutton.com">geomedia.brandon-dutton.com</a>

## Code highlights:

<a href="/front-end/src/redux/thunks/">Redux thunks</a>

<a href="/front-end/src/redux/slices">Redux Slices with entity adapter</a>

<a href="/front-end/src/pages/home/components/postDrawer">Custom components using Material-Ui</a>

<a href="/back_end/tests/test_posts_at_location.py">Unit test using mocks and monkey patching</a>

#### Complicated SQL queries

- <a href="back_end/api/Resources/Categories/Categories_At_Location.py">Multi-level sub queries</a>
- <a href="/back_end/api/Resources/Posts/query.py">Multi-level joins</a>

<a href="/back_end/api/schema.sql">SQL schema</a>

<a href="/back_end/conftest.py">Pytest fixtures</a>

<a href="/back_end/api/Resources">RESTfull resources</a>

<a href="/back_end/tests">Other unit tests</a>

## Stack:

#### Front end:

- Typescript
- React
- Redux
- Material-ui

#### Back end:

- Python
- Flask-RESTfull
- AWS Cognito
- MySQL
- AWS Cognito

#### Server:

- Nginx with reverse proxy to wsgi server
- EC2 instance
