import json
import time
import urllib.request
from jose import jwk, jwt
from jose.utils import base64url_decode

""" Code from AWS cognito documentation """

region = "us-east-2"
userpool_id = "us-east-2_p0JGhnTVa"
app_client_id = "5i1b4ce8ctiqb57kplgvr128id"
keys_url = "https://cognito-idp.{}.amazonaws.com/{}/.well-known/jwks.json".format(
    region, userpool_id
)

with urllib.request.urlopen(keys_url) as f:
    response = f.read()
keys = json.loads(response.decode("utf-8"))["keys"]


def decode_cognito_jwt(token):
    headers = jwt.get_unverified_headers(token)
    kid = headers["kid"]

    key_index = -1
    for i in range(len(keys)):
        if kid == keys[i]["kid"]:
            key_index = i
            break
    if key_index == -1:
        print("Public key not found in jwks.json")
        return None

    public_key = jwk.construct(keys[key_index])
    message, encoded_signature = str(token).rsplit(".", 1)
    decoded_signature = base64url_decode(encoded_signature.encode("utf-8"))

    if not public_key.verify(message.encode("utf8"), decoded_signature):
        return None
    claims = jwt.get_unverified_claims(token)
    if time.time() > claims["exp"]:
        return None
    token = claims.get("aud", None) or claims.get("client_id", None)
    if token != app_client_id:
        return None
    return claims


class JWT:
    @staticmethod
    def validate(jwt_token):
        result = decode_cognito_jwt(jwt_token)
        return result
