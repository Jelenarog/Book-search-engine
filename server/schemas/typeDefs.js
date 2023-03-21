const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID
    username: String
    email: String
    bookCount: Int
    savedBooks: [bookSchema]
  }

  type bookSchema {
    _id: ID
    authors: String
    description: String
    title: String
    image: String
    link: String
  }

  type Auth {
    token: ID!
    user: User
  }


  type Query {
    me: [User]
  }
    # Define which mutations the client is allowed to make
    type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    # saveBook()
    # removeBook(id: ID!, title: String!): User 
  }
`;

module.exports = typeDefs;
