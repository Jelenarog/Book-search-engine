import { gql } from '@apollo/client';

export const GET_ME = gql`
  # create a GraphQL query to be executed by Apollo Client
  query me {
    user {
      _id
      username
      email
      bookCount
      savedBooks
    }
  }
`;