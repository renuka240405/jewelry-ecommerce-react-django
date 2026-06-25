import requests

url = "http://127.0.0.1:8000/api/users/login/"

data = {
    "username": "testuser",
    "password": "test12345"
}

response = requests.post(url, json=data)

print(response.json())