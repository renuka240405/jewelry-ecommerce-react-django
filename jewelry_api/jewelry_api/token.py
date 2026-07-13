import requests

url = "https://jewelry-ecommerce-react-django-2.onrender.com/api/users/login/"

data = {
    "username": "testuser",
    "password": "test12345"
}

response = requests.post(url, json=data)

print(response.json())