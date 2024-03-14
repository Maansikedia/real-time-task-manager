# Express GraphQL Server

This is a realtime task manager GraphQL server built with Express and Apollo Server.

## File Structure

- `index.js`: This is the main server file.
- `schema.js`: This file contains the GraphQL schema and resolvers.
- `connection.js`: This file handles database connections.
- `auth.js`: This file manages user authentication and authorization.
- `package.json`: The `package.json` file contains information about the project's dependencies and scripts.
- `model- 1. task.js : This file contains task schema
          2. user.js : This file contains user schema


## Setup

1. Install dependencies: Run `yarn add express @apollo/server bcryptjs body-parser cors dotenv graphql graphql-subscriptions jsonwebtoken mongoose nodemon` 

2. load your env credentials for mongoose connection and secret-key while authenticating

3. Start the server: Run `node index.js` in the project directory.

## Features

- The server uses Apollo Server for handling GraphQL requests.
- The server uses Express as the web server.
- The server uses Body Parser for parsing incoming request bodies in a middleware before your handlers.
- The server uses bcryptjs for password hashing.
- The server uses jsonwebtoken for generating JWT tokens.
- The server uses dotenv for loading environment variables.
- The server uses graphql-subscriptions for GraphQL subscriptions.
- The server uses mongoose for MongoDB object modeling.

## Usage

The server starts on port 8000. You can send GraphQL requests to [http://localhost:8000/graphql](http://localhost:8000/graphql).

## GraphQL Schema

The `schema.js` file contains the GraphQL schema definition and resolvers. It includes type definitions for `Task` and `User`, queries for fetching users and tasks, mutations for user registration, user login, and task management (create, update, delete), and subscriptions for task creation, update, and deletion.