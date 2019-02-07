const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");
const fs = require("fs");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");

//Mongoose Models
const Product = require("./models/Product");
const User = require("./models/User");
const Order = require("./models/Order");

//GraphQL Types And Resolvers
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

// Set up JWT authentication middleware
app.use(path, async (req, res, next) => {
  const token = req.headers.authorization || "";
  if (token !== "null") {
    try {
      const currentUser = await jwt.verify(token, process.env.SECRET);
      req.currentUser = currentUser;
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
    User,
    Product,
    Order,
    currentUser: req.currentUser
  })
});

server.applyMiddleware({ app, path });

const PORT = process.env.PORT || 4000;

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err))
  .then(() =>
    app.listen({ port: PORT }, () =>
      console.log(
        `🚀 Server ready at http://localhost:4000${server.graphqlPath}`
      )
    )
  );
