// import { buildSchemaFromTypeDefinitions } from "apollo-server-express";

// const {
//     getAllPosts,
//     postOnePost,
//     getPost,
//     commentOnPost,
//     likePost,
//     unlikePost,
//     deletePost
//   } = require("./handlers/posts");
//   const {
//     signup,
//     login,
//     uploadImage,
//     addUserDetails,
//     getAuthenticatedUser,
//     getUserDetails,
//     markNotificationsRead
//   } = require("./handlers/users");
//   const FBAuth = require("./util/fbAuth");

// const resolverFunctions = {
//     Query: {
//       posts: function (root, args, context, info) {
//           return posts;
//       },
//       post: (root, args, context, info) => posts.find(e => e.id === args.id)
//     },
//     Post: {
//         id: parent => parent.id,
//         body: parent => parent.body,
//         createdAt: parent => parent.createdAt,
//         comments: parent => parent.comments,
//         likeCount: parent => parent.likeCount
//     }
//   };
  
const resolverFunctions = {
  Query: {
    hello: () => 'world'
  }
};

  exports.default = resolverFunctions;