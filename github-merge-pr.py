import requests
import json
import sys

APITOKEN = '907f9181310dc99716cc6cf6e1abb054e5f2db88'
githubURL = 'https://api.github.com/repos/leobancosta/apigateway/pulls/'+sys.argv[1:]+'/merge'

headParam = {'Authorization': 'token ' + APITOKEN}
dataParam = {"commit_title": "CI Pull Request","commit_message": "Jenkins Pull Request","sha": sys.argv[2:],"base": "merge_method","merge":true}

response = requests.post(githubURL, json=dataParam, headers=headParam)
print(response.json())