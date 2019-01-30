import { gql } from "apollo-boost";

export const productFragments = {
  product: gql`
    fragment CompleteProduct on Product {
      _id
      name
      imageUrl
      category
      description
      price
      createdDate
      likes
      username
    }
  `,
  like: gql`
    fragment LikeProduct on Product {
      _id
      likes
    }
  `
};
