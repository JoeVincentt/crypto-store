import { gql } from "apollo-boost";

import { productFragments } from "./fragments";

//Products queries
export const GET_ALL_PRODUCTS = gql`
  query {
    getAllProducts {
      _id
      imageUrl
      name
      category
      price
      description
      likes
    }
  }
`;

export const GET_PRODUCT = gql`
  query($prodId: ID!) {
    getProduct(_id: $prodId) {
      ...CompleteProduct
    }
  }
  ${productFragments.product}
`;

export const SEARCH_PRODUCT = gql`
  query($searchTerm: String) {
    searchProduct(searchTerm: $searchTerm) {
      _id
      name
      imageUrl
      price
      likes
    }
  }
`;

//Order Mutation

export const CREATE_ORDER = gql`
  mutation($prodId: ID!, $userId: ID!, $quantity: Int!) {
    createOrder(prodId: $prodId, userId: $userId, quantity: $quantity) {
      _id
    }
  }
`;
export const DELETE_ORDER = gql`
  mutation($userId: ID!, $orderId: ID!) {
    deleteOrder(userId: $userId, orderId: $orderId) {
      _id
    }
  }
`;
export const UPDATE_ORDER_QUANTITY = gql`
  mutation($orderId: ID!, $quantity: Int!) {
    updateOrderQuantity(orderId: $orderId, quantity: $quantity) {
      _id
    }
  }
`;

//Products Mutations
export const ADD_PRODUCT = gql`
  mutation(
    $name: String!
    $imageUrl: String!
    $description: String!
    $category: String!
    $price: Int!
    $username: String!
  ) {
    addProduct(
      name: $name
      imageUrl: $imageUrl
      description: $description
      category: $category
      price: $price
      username: $username
    ) {
      ...CompleteProduct
    }
  }
  ${productFragments.product}
`;

export const DELETE_USER_PRODUCT = gql`
  mutation($_id: ID!) {
    deleteUserProduct(_id: $_id) {
      _id
    }
  }
`;

export const UPDATE_USER_PRODUCT = gql`
  mutation(
    $_id: ID!
    $name: String!
    $imageUrl: String!
    $description: String!
    $category: String!
    $price: Int!
  ) {
    updateUserProduct(
      _id: $_id
      name: $name
      imageUrl: $imageUrl
      description: $description
      category: $category
      price: $price
    ) {
      _id
      name
      likes
      category
      imageUrl
      description
      price
    }
  }
`;

export const LIKE_PRODUCT = gql`
  mutation($_id: ID!, $username: String!) {
    likeProduct(_id: $_id, username: $username) {
      ...LikeProduct
    }
  }
  ${productFragments.like}
`;

export const UNLIKE_PRODUCT = gql`
  mutation($_id: ID!, $username: String!) {
    unlikeProduct(_id: $_id, username: $username) {
      ...LikeProduct
    }
  }
  ${productFragments.like}
`;

// User Queries
export const GET_CURRENT_USER = gql`
  query {
    getCurrentUser {
      _id
      username
      joinDate
      email
      favorites {
        _id
        name
      }
      cart {
        _id
        product {
          _id
        }
        user {
          _id
        }
        quantity
      }
      cartTotal
      wallet
    }
  }
`;

export const GET_USER_PRODUCTS = gql`
  query($username: String!) {
    getUserProducts(username: $username) {
      _id
      name
      likes
      imageUrl
      category
      description
      price
    }
  }
`;

export const GET_USER = gql`
  query($userId: ID!) {
    getUser(_id: $userId) {
      username
    }
  }
`;

// User Mutations

export const SIGNIN_USER = gql`
  mutation($email: String!, $password: String!) {
    signinUser(email: $email, password: $password) {
      token
    }
  }
`;

export const SIGNUP_USER = gql`
  mutation(
    $username: String!
    $email: String!
    $password: String!
    $passwordConfirmation: String!
  ) {
    signupUser(
      username: $username
      email: $email
      password: $password
      passwordConfirmation: $passwordConfirmation
    ) {
      token
    }
  }
`;
