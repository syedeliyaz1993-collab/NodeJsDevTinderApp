# Namaste Node.js - DevTinder Backend

## Project Overview

This project is a Node.js backend for a DevTinder application. It currently uses:

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- Validator
- Bcrypt
- Nodemon

The application starts an Express server only after MongoDB connects successfully.

## 1. Project Setup

### Initialize the Node.js project

Created a Node.js project with `package.json` and CommonJS modules.

The project uses:

```json
"type": "commonjs"
```

### Install dependencies

Installed the main dependencies:

```powershell
npm install express mongoose validator bcrypt
```

The development command is:

```powershell
npm start
```

This runs:

```text
nodemon src/app.js
```

## 2. Express Application Setup

Created the Express application in `src/app.js`:

```js
const express = require("express");
const app = express();
```

Enabled JSON request parsing:

```js
app.use(express.json());
```

This allows the API to read JSON request bodies sent from Postman.

## 3. MongoDB Atlas Connection

Created the database connection in `src/config/database.js` using Mongoose.

The connection uses the MongoDB Atlas SRV URL and the `devTinder` database.

The application connects to the database before starting the HTTP server:

```js
connectDB()
    .then(() => {
        app.listen(3000);
    })
    .catch((err) => {
        process.exit(1);
    });
```

### DNS issue solved

The MongoDB Atlas connection initially failed with:

```text
querySrv ECONNREFUSED _mongodb._tcp.namastenode.ljqizb0.mongodb.net
```

The SRV record was checked with `nslookup`. Windows DNS was configured to use public DNS servers, and Node.js was configured to use:

```js
dns.setServers(["1.1.1.1", "8.8.8.8"]);
```

After this, the application connected successfully and started on port `3000`.

### Important connection behavior

A failed database connection must reject the Promise. If the error is caught inside `database.js` and not rethrown, `app.js` may incorrectly print a successful connection message and start the server.

## 4. User Schema and Model

Created the user model in `src/models/user.js` with Mongoose.

Current fields:

- `firstName`: required, 3 to 30 characters
- `lastName`: string
- `emailId`: required, unique, lowercase, trimmed, valid email format
- `password`: required
- `age`: minimum value of 18
- `gender`: `male`, `female`, or `other`
- `skills`: array of strings
- `createdAt` and `updatedAt`: automatically generated timestamps

The `validator` package is used to validate email addresses.

## 5. Signup Validation

Created `src/utils/validation.js` for signup validation.

The signup validation checks:

1. First name and last name are present.
2. First name is between 3 and 30 characters.
3. Email address is valid.
4. Password is strong and includes the required character types.

Example valid payload:

```json
{
    "firstName": "Syed",
    "lastName": "Eliyaz",
    "emailId": "abc@123.com",
    "password": "Mydestiny@123",
    "age": 32,
    "gender": "male"
}
```

The gender value must be lowercase because the schema currently accepts only:

```text
male, female, other
```

## 6. Password Hashing

Added `bcrypt` to protect passwords before saving them.

The signup flow:

1. Read signup data from `req.body`.
2. Validate the request.
3. Hash the plain-text password with bcrypt.
4. Create a `User` document with the password hash.
5. Save the user to MongoDB.
6. Return a success response.

The plain-text password should not be stored in MongoDB.

## 7. Signup API

### Endpoint

```text
POST /signUp
```

### Request header

```text
Content-Type: application/json
```

### Successful response

```text
User signed up successfully
```

Validation or database errors are returned with HTTP status `400`.

## 8. Login API

### Endpoint

```text
POST /login
```

The login flow:

1. Read `emailId` and `password` from the request body.
2. Find the user by email address.
3. Compare the submitted password with the stored bcrypt hash.
4. Return a success message when the password matches.
5. Return an error when the user does not exist or the password is incorrect.

### Login payload

```json
{
    "emailId": "abc@123.com",
    "password": "Mydestiny@123"
}
```

## 9. User APIs

### Find users by email

```text
GET /users
```

Reads `emailId` from the request body and returns matching users.

### Get all users

```text
GET /feed
```

Returns all users from MongoDB.

### Delete a user

```text
DELETE /deleteUser
```

Reads `userId` from the request body and deletes the matching user.

## 10. Middleware Practice

A middleware file was created at `src/middlewares/Auth.js`.

It contains example `adminAuth` and `userAuth` middleware functions that demonstrate:

- Reading a token
- Checking authentication
- Calling `next()` for an authenticated request
- Returning HTTP `401 Unauthorized` for an unauthenticated request

These middleware functions are currently examples with hardcoded tokens and should be replaced with real authentication later.

## 11. Folder Usage

### Config

Database connection configuration: `const connectDB = require("./config/database");`

### Middlewares

Authentication middleware usage: `app.use("/admin", adminAuth);`

### Models

User model usage: `const User = require("./models/user");`

### Utils

Signup validation usage: `validateSignUpData(req);`

## 12. How to Run the Application

From the project directory:

```powershell
cd C:\Syed\Projects\DevTinder_BackEnd
npm start
```

Or run directly:

```powershell
node src/app.js
```

Expected output:

```text
Database connected successfully
Server is running on port 3000
```

## 13. Security Follow-up

The MongoDB username and password were previously written directly in source code. Before sharing or deploying this project:

1. Rotate the exposed MongoDB database password in MongoDB Atlas.
2. Store database credentials in environment variables.
3. Add `.env` to `.gitignore`.
4. Do not print the complete MongoDB URI.
5. Hash passwords before saving them.
6. Add real authentication and authorization instead of hardcoded tokens.

## 14. Next Topics to Implement

- Move MongoDB configuration to a `.env` file.
- Add JWT authentication for login.
- Protect routes with authentication middleware.
- Add request validation for login and user updates.
- Add centralized error-handling middleware.
- Add duplicate-email error handling.
- Avoid using a request body with `GET /users`; use a route parameter or query parameter.
- Add tests for signup, login, feed, and delete operations.
- Organize routes, controllers, and services into separate files.
