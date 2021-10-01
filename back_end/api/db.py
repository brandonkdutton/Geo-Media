from flask import current_app, g
from flask.cli import with_appcontext
import click
import pymysql
import sqlparse


def init_app(app):
    app.teardown_appcontext(close_db)
    app.cli.add_command(init_db_command)


def get_db():
    if "db" not in g:
        db_data = current_app.config["DATABASE"]
        g.db = pymysql.connect(
            host=db_data["host"],
            port=db_data["port"],
            user=db_data["user"],
            password=db_data["password"],
            db=db_data["db"],
        )
    return g.db


def close_db(e=None):
    db = g.pop("db", None)
    if db is not None:
        db.close()


def init_db():
    db = get_db()
    cursor = db.cursor()

    with current_app.open_resource("schema.sql") as f:
        raw_sql = f.read().decode("utf8")
        db = get_db()

        statements = sqlparse.split(raw_sql)
        for statement in statements:
            cursor.execute(statement)


@click.command("init-db")
@with_appcontext
def init_db_command():
    init_db()
    click.echo(f"Initialized the datbase")
    click.echo(f"Added fake data")
