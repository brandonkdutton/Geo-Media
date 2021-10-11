from api.db import get_db

def fetch_user_data(user_id=None, sub=None):
    """Fetches user data from db given a user id or a sub"""
    db = get_db()
    cursor = db.cursor()

    if sub is not None:
        cursor.execute(
            "select * from Users where cognitoSub = %s",
            (sub),
        )
    elif user_id is not None:
        cursor.execute(
            "select * from Users where userId = %s",
            (user_id),
        )
    else:
        return None

    try:
        user_id, cognito_sub, username, email, email_verified = cursor.fetchone()
    except TypeError:
        return None

    return {
        "userId": user_id,
        "cognitoSub": cognito_sub,
        "username": username,
        "email": email,
        "emailVerified": email_verified,
    }