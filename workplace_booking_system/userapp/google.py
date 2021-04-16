from typing import Dict

from google.auth.transport import requests
from google.oauth2 import id_token


class Google:
    """Google class to fetch the user info and return it"""

    @staticmethod
    def validate(auth_token: str) -> Dict:
        """
        validate method Queries the Google oAUTH2 api to fetch the user info
        """
        idinfo = id_token.verify_oauth2_token(auth_token, requests.Request())
        if 'accounts.google.com' in idinfo.get('iss', ''):
            return idinfo
        return {}
