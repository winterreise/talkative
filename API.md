# API Definition

## Authentication

### Check authentication

`GET /api/v1/checkauthentication`

#### Response

Status: 200 OK

```json
{
  "status":  "success",
  "data": "Success"
}
```

Status: 401 UNAUTHORIZED

```json
{
  "status":  "fail",
  "data": "Unauthorized"
}
```

### Google

Authentication: `GET /auth/google`

Callback URL: `GET /auth/google/callback`

### Facebook

Authentication: `GET /auth/facebook`

Callback URL: `GET /auth/facebook/callback`

### Twitter

Authentication: `GET /auth/twitter`

Callback URL: `GET /auth/twitter/callback`

## Bursts


### All Bursts

`GET /api/v1/bursts/`

### Sent Bursts for user

`GET /api/v1/bursts/:userId/sent/`

### Unsent Bursts for user

`GET /api/v1/bursts/:userId/unsent/`

### Show Burst

`GET /api/v1/bursts/:userId/`


## Prompts


### All Bursts

`GET /api/v1/bursts/`

### News Prompts

`GET /api/v1/prompts/news/`

### Entertinament Prompts

`GET /api/v1/prompts/entertainment/`

### Facts Prompts

`GET /api/v1/prompts/facts/`

### Show prompt

`GET /api/v1/prompts/:id`


## Users


### All Users

`GET /api/v1/users/`

### Active Users

`GET /api/v1/users/active`

### Inactive Users

`GET /api/v1/users/inactive`

### Update User

`POST /api/v1/users/:id`

#### Parameters: phone: string, frequency: integer, active: 'true' or 'false', factsweight: integer, entertainmentweight:integer, newsweight: integer

#### Response

Status: 200 OK

```json
{
"status": "success",
"data": {
  "id": 3,
  "phone": "416-555-1234 ",
  "frequency": 5,
  "active": false,
  "factsweight": 50,
  "entertainmentweight": 25,
  "newsweight": 25
  }
}
```

Status: 404 Not Found

```json
{
"status": "fail",
"data": "Could not find a user with that id."
}
```


Status: 422 Unprocessable Entity

```json
{
"status": "fail",
"data": "Incorrect data was posted for the user."
}
```


### Show User

`GET /api/v1/users/:id`

#### Response

Status: 200 OK

```json
{
"status": "success",
"data": {
  "id": 3,
  "phone": "416-555-1234 ",
  "frequency": 5,
  "active": false,
  "factsweight": 50,
  "entertainmentweight": 25,
  "newsweight": 25
  }
}
```

Status: 404 Not Found

```json
{
"status": "fail",
"data": "Could not find a user with that id."
}
```
