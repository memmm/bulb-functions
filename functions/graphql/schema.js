const {gql} = require('apollo-server-express');

// const schema = gql`
//   type User {
//     id: ID
//     userHandle: String
//     email: String
//     password: String
//     image: Image
//     website: String
//     bio: String
//   }

//   type Post {
//     id: ID
//     comments: [Comment]
//     likes: Int
//   }

//   type Comment {
//     id: ID
//     body: String
//   }

//   type Query {
//     getPost: Post
//     getPosts: [Post]
//     getComments: [Comment]
//     getUser: [User]
//   }

//   type Mutation {
//     addPost(body: String, userHandle: String): Post
//     addUserDetails(bio: String, website: String): User
//     deletePost: {
//         type: Post,
//         description: 'Delete an post with id and return the post id that was deleted.',
//         args: {
//           id: { type: new GraphQLNonNull(GraphQLInt) }
//         },
//         resolve: (value, { id }) => {
//           return PostServices.delete(id);
//         }
//       }
//   }
// `;

const schema = gql`
  type Query {
    "A simple type for getting started!"
    hello: String
  }
`;

exports.default = schema;