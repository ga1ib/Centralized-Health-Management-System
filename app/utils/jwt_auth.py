import jwt
import datetime
import os

SECRET_KEY = os.getenv("SECRET_KEY")

def generate_jwt(email):
    payload = {
        "email": email,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(days=1)
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
    # Ensure token is a string (PyJWT 1.x returns bytes)
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