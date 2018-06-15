# SP Friend Management Interview Test
## Technologies Used
### Docker 
Docker was chosen because of how portable it is to deploy it anywhere and also because it was easier to deploy and test the application instead of hosting it on a cloud server. When done, the same docker containers can easily be ported over to a cloud server like AWS.

### Neo4J
Neo4J was chosen over a relation db like MySQL because it was easy to map relations between two entity and querying for this relation using the Cypher Query Lanaguage.

### NodeJS
#### ExpressJS
I am more familiar with ExpressJS and because it is one of the more popular framework out there so any issues encountered can be easily found on stackoverflow
### Mocha
### Chai

### Swagger 
Swagger was chosen because i like how the UI is being presented to the user

## Start up Docker

```sh
chmod +x ./start.sh
./start.sh
```

## Stop Docker

```sh
chmod +x ./stop.sh
./stop.sh
```

## Down Docker

```sh
chmod +x ./down.sh
./down.sh
```

## Express JS
Go to http://localhost:3000 in the browser

## Neo4j Login
Go to http://localhost:17474/browser/ in the browser

Host : bolt://localhost:17687
Username : neo4j
Password : neo4jsp

## API

| API                  | Description                                                                 |
|----------------------|-----------------------------------------------------------------------------|
| /api-docs            | swagger docs on detailed api request and response                           |
| /addConnection       | create a friend connection between two email addresses                      |
| /getFriendList       | retrieve the friends list for an email address                              |
| /getCommonFriendList | retrieve the common friends list between two email addresses                |
| /addSubscription     | subscribe to updates from an email address                                  |
| /blockConnection     | block updates from an email address                                         |
| /getUpdateEmailList  | retrieve all email addresses that can receive updates from an email address |

## To-Do
1) Validate emails passed in for valid email strings (validation functions available)
2) Allow /addConnections to have more than 2 emails passed in
3) Moving of mocha test for each api calls into their own files