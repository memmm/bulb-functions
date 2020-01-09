const functions = require("firebase-functions");
//const gqlServer = require("./graphql/server");

const express = require("express");
const { ApolloServer, gql } = require('apollo-server-express');

const {
  getAllPosts,
  postOnePost,
  getPost,
  commentOnPost,
  likePost,
  unlikePost,
  deletePost
} = require("./handlers/posts");
const {
  signup,
  login,
  uploadImage,
  addUserDetails,
  getAuthenticatedUser,
  getUserDetails,
  markNotificationsRead
} = require("./handlers/users");

const schema = gql`
  type Query {
    "A simple type for getting started!"
    getPost(postId: ID): Post
    getPosts: [Post]
    subject: String
  }
  type User {
    createdAt: String
    email: String
    handle: String
    imageUrl: String
    userId: ID
  }
  type Comment {
    body: String
    createdAt: String
    post: Post
    user: User
    userImage: String
  }
  type Like {
    post: Post
    user: User
  }
  type Post {
    postId: ID
    body: String
    commentCount: Int
    likeCount: Int
    userHandle: String
  }
  
`;
//const resolvers = require("./resolvers");

const resolvers = {
  Query: {
    subject: () => {return "T&H"}, 
    getPost: (root, args, context, info) => getPost(args.postId),
    getPosts: () => getAllPosts()
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

exports.api = functions.region("europe-west1").https.onRequest(gqlServer());



const FBAuth = require("./util/fbAuth");

const { db } = require("./util/admin");

// //Posts routes
// app.get("/posts", getAllPosts);
// app.post("/post", FBAuth, postOnePost);
// app.get("/post/:postId", getPost);
// app.delete("/post/:postId", FBAuth, deletePost);
// app.post("/post/:postId/comment", FBAuth, commentOnPost);
// app.get("/post/:postId/like", FBAuth, likePost);
// app.get("/post/:postId/unlike", FBAuth, unlikePost);

// //Users routes
// app.post("/signup", signup);
// app.post("/login", login);
// app.post("/user/image", FBAuth, uploadImage);
// app.post("/user", FBAuth, addUserDetails);
// app.get("/user", FBAuth, getAuthenticatedUser);
// app.get("/user/:handle", getUserDetails);
// app.post("/notifications", FBAuth, markNotificationsRead);

// app.get("/hello", (request, response) => {
//   response.send("Hello alkoholostak!");
// });


exports.createNotificationOnLike = functions
  .region("europe-west1")
  .firestore.document("likes/{id}")
  .onCreate(snapshot => {
    return db
      .doc(`/posts/${snapshot.data().postId}`)
      .get()
      .then(doc => {
        if (
          doc.exists &&
          doc.data().userHandle !== snapshot.data().userHandle
        ) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().userHandle,
            sender: snapshot.data().userHandle,
            type: "like",
            read: false,
            postId: doc.id
          });
        }
      })
      .catch(err => {
        console.error(err);
      });
  });

exports.deleteNotificationOnUnlike = functions
  .region("europe-west1")
  .firestore.document("likes/{id}")
  .onDelete(snapshot => {
    return db
      .doc(`/notifications/${snapshot.id}`)
      .delete()
      .catch(err => {
        console.error(err);
        return;
      });
  });

exports.createNotificationOnComment = functions
  .region("europe-west1")
  .firestore.document("comments/{id}")
  .onCreate(snapshot => {
    return db
      .doc(`/posts/${snapshot.data().postId}`)
      .get()
      .then(doc => {
        if (
          doc.exists &&
          doc.data().userHandle !== snapshot.data().userHandle
        ) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().userHandle,
            sender: snapshot.data().userHandle,
            type: "comment",
            read: false,
            postId: doc.id
          });
        }
      })
      .catch(err => {
        console.error(err);
        return;
      });
  });

exports.onUserImageChange = functions
  .region("europe-west1")
  .firestore.document("/users/{userId}")
  .onUpdate(change => {
    if (change.before.data().imageUrl !== change.after.data().imageUrl) {
      console.log("iamge has changed");
      const batch = db.batch();
      return db
        .collection("posts")
        .where("userHandle", "==", change.before.data().handle)
        .get()
        .then(data => {
          data.forEach(doc => {
            const post = db.doc(`/posts/${doc.id}`);
            batch.update(post, { userImage: change.after.data().imageUrl });
          });
          return batch.commit();
        })
        .catch(err => {
          console.error(err);
          return;
        });
    } else return true;
  });

exports.onPostDelete = functions
  .region("europe-west1")
  .firestore.document("/posts/{postId}")
  .onDelete((snapshot, context) => {
    const postId = cdb.batch();
    return db
      .collection("comments")
      .where("postId", "==", "postId")
      .get()
      .then(data => {
        data.forEach(doc => {
          batch.delete(db.doc(`/comments/${doc.id}`));
        });
        return db.collection("likes").where("postId", "==", "postId").get();
      })
      .then(data => {
        data.forEach(doc => {
          batch.delete(db.doc(`/likes/${doc.id}`));
        });
        return db.collection("notifications").where("postId", "==", "postId").get();
      })
      .then(data => {
        data.forEach(doc => {
          batch.delete(db.doc(`/notifications/${doc.id}`));
        });
        return batch.commit();
      })
      .catch(err => console.error(err));
  });
