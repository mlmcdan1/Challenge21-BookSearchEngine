const express = require("express");
const path = require("path");
const routes = require("./routes");
const db = require("./config/connection");
const { ApolloServer } = require("apollo-server-express");

// import TypeDefs and Resolvers
const { typeDefs, resolvers } = require("./schemas");

const PORT = process.env.PORT || 3001;

//todo REST API routes, turn to APOLLO server

// create new instance of Apollo Server
const startApolloServer = async (typeDefs, resolvers) => {
  const app = express();
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  // app.use(routes);
  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../client/build")));
  }
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build/index.html"));
  });
  db.once("open", () => {
    app.listen(PORT, () =>
      console.log(`🌍 Now listening on localhost:${PORT}`)
    );
  });

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });
  await server.start();
  // integrate apollo server
  server.applyMiddleware({ app });
  // Apollo server On GQL API
  console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath} `);
};

// call Async function to start Apollo server
startApolloServer(typeDefs, resolvers);