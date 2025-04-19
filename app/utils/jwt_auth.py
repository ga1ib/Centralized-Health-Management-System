import jwt
import datetime
import os

SECRET_KEY = os.getenv("SECRET_KEY")

def generate_jwt(user_info):
    """
    Generate JWT token with user information
    user_info should contain email, role, and name
    """
    payload = {
        **user_info,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(days=1)
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
    if isinstance(token, bytes):
        token = token.decode("utf-8")
    return token

def decode_jwt(token):
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None