import http.client
import json
from . constances import ENDPOINT_USER
import requests


def connect(email: str, password: str):
    headers = {'Content-Type': 'application/json'}
    payload = {
        "username": email,
        "password": password
    }
    try:
        conn = http.client.HTTPSConnection(ENDPOINT_USER)
        payload = json.dumps(payload)
        
        conn.request("POST", "/api/token/", payload, headers)
        res = conn.getresponse()
        e = res.read()
        try:
            data = json.loads(e.decode('utf8').replace("'", '"'))
        except:
            data = json.loads(e)
    except:
        response = requests.request("POST", ENDPOINT_USER + 'api/token/', headers=headers, data=payload)
        data = response.text
    return data


def getUser(authorization: str):
    conn = http.client.HTTPSConnection(ENDPOINT_USER)
    payload = ''
    headers = {
        "Authorization": 'Bearer ' + authorization
    }
    conn.request("GET", "users/account/", payload, headers)
    response = conn.getresponse()
    data = json.loads(response.read())
    return data
