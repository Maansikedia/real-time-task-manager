const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const bodyParser = require('body-parser');
const cors = require('cors');
const { typeDefs, resolvers } = require('./schema');
const { getUserFromToken } = require('./auth');
const { connect } = require('./connection');

async function startServer() {
  const app = express();
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
      // Get the user token from the headers
      const token = req.headers.authorization || '';

      // Try to retrieve a user with the token
      const user = await getUserFromToken(token);

      return { user };
    },
  });
  app.use(bodyParser.json());
  app.use(cors());
  await server.start();
  app.use('/graphql', expressMiddleware(server));
  app.listen(8000, () => console.log('Serevr Started at PORT 8000'));
}

startServer();
connect();
