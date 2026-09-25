# NodeJsDevTinderApp

# Creating APIs for DEVTINDER
## authRoter
POST - /signup
POST - /login
POST - /logout

## profileRouter
GET - /profile/view
PATCH - /profile/edit
PATCH - /profile/password

## connectionRequestRouter

POST - /request/send/Intrested/:userId
POSt - /request/send/Ignored/:userId
//Instead above
POST - /request/send/status/:toUserId

POST - /request/review/accepted/:requestId
POSt - /request/review/rejected/:requestId

//Instead above 
POST - /request/review/status/:requestId

## userRouter

GET - /user/connections
GET - /user/requests
GET - /user/feed

Status : Ignore. Intrested, Accepted, Rejected
