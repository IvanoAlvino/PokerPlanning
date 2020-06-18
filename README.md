# NavvisPokerPlanning

REST API
==========

1. Create a room -> return the id of the room. POST request with username and room name in body,returns the room ID. Who creates the room is the moderator
```
POST /api/room
{
	username: string
	roomName: string
}
returns roomId
```

2. People connect to it, and enter their name. A POST api is sent to create a user. In his body there is the name and the room id
```
POST /api/user
{name: string, roomId: string}
```

3. GET a room. In the request we pass the room id. Returns room name and users and userName
```
GET /api/room
{
	roomName:
	username: 
	users: {

	}
}
```

4. POST vote. In the request there is the estimates, and room id. User is not needed since it is in the session cookie.
```
POST /api/votes
{
	estimate: number
	roomId: string
}
```

5. POST finish vote. the request will contain the room id. 
All votes are returned in the response -> a list of objects
```
POST /api/finishVoting
{
	roomId: string
}
returns
[
{username: string, estimate: number}
]
```

5. GET updates. In the request we send the room id, in the response there is a list of objects: each object contains username, voted (y/n) and last vote.
```
GET /api/updates?roomId=string
[
{username: string, voted: boolean, previousVote: number}
]
```
