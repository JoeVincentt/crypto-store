const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");
const fs = require("fs");

const mongoose = require("mongoose");
// const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");

//Mongoose Models
const Recipe = require("./models/Recipe");
const User = require("./models/User");

const typeDefs = gql`
  ${fs.readFileSync(__dirname.concat("/schema.graphql"), "utf8")}
`;
const { resolvers } = require("./resolvers");

const app = express();
const path = "/graphql";

//Use MIDDLEWARE
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true
};
app.use(path, cors(corsOptions));

//Set uop JWT authentication middleware
app.use(path, async (req, res, next) => {
  const token = req.headers["authorization"];
  if (token !== "null") {
    try {
      const currentUser = await jwt.verify(token, process.env.SECRET);
      req.currentUser = currentUser;
      console.log(currentUser);
    } catch (error) {
      console.log("Token not found");
    }
  }
  next();
});

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({
    currentUser: req.currentUser,
    Recipe,
    User
  })
});
server.applyMiddleware({ app, path });

const PORT = process.env.PORT || 4000;

mongoose
  .connect(
    process.env.MONGO_URI,
    { useNewUrlParser: true }
  )
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err))
  .then(() =>
    app.listen({ port: PORT }, () =>
      console.log(
        `🚀 Server ready at http://localhost:4000${server.graphqlPath}`
      )
    )
  );
