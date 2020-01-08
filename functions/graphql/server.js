//graphql setup

const express = require("express");
const { ApolloServer, gql } = require('apollo-server-express');

//const schema = require("./schema");
const schema = gql`
  type Query {
    "A simple type for getting started!"
    hello: String
  }
`;
//const resolvers = require("./resolvers");

const resolvers = {
  Query: {
    hello: () => 'world'
  }
};


function gqlServer() {
  const app = express();

  const apolloServer = new ApolloServer({
    typeDefs: schema,
    resolvers,
    // Enable graphiql gui
    introspection: true,
    playground: true
  });

  apolloServer.applyMiddleware({app, path: '/', cors: true});

  return app;
}

exports.gqlServer = gqlServer;

// var graphqlHTTP = require('express-graphql');
// var { buildSchema } = require('graphql');

// // Construct a schema, using GraphQL schema language
// var schema = buildSchema(`
//   type Query {
//     hello: String
//   }
// `);

// // The root provides a resolver function for each API endpoint
// var root = {
//   hello: () => {
//     return 'Hello world!';
//   },
// };

// var app = express();
// app.use(
//   '/graphql',
//   graphqlHTTP({
//     schema: schema,
//     rootValue: root,
//     graphiql: true,
//   }),
// );
// app.listen(4000, () => {
//   console.log('Running a GraphQL API server at localhost:4000/graphql');
// });
