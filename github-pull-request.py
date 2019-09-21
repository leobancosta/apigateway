import requests
import json

APITOKEN = '907f9181310dc99716cc6cf6e1abb054e5f2db88'
githubURL = 'https://api.github.com/repos/leobancosta/apigateway/pulls'

headParam = {'Authorization': 'token ' + auth_token}
dataParam = {"title": "CI Pull Request","body": "Jenkins Pull Request","head": "development","base": "master","maintainer_can_modify":true,"draft":false}

response = requests.post(githubURL, json=dataParam, headers=headParam)

respData = json.dumps(response.json(), indent=4)
print respData
os.environ['pull_number'] = respData['number']
os.environ['head_sha'] = respData['head']['sha']}
