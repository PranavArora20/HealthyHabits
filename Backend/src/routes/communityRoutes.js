const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  createGroup,
  joinGroup,
  listGroups,
  createPost,
  listGroupPosts,
  likePost,
  commentOnPost,
} = require("../controllers/communityController");

const communityRouter = express.Router();

communityRouter.get("/groups", authMiddleware, listGroups);
communityRouter.post("/groups", authMiddleware, createGroup);
communityRouter.post("/groups/:id/join", authMiddleware, joinGroup);
communityRouter.get("/groups/:id/posts", authMiddleware, listGroupPosts);
communityRouter.post("/posts", authMiddleware, createPost);
communityRouter.post("/posts/:id/like", authMiddleware, likePost);
communityRouter.post("/posts/:id/comment", authMiddleware, commentOnPost);

module.exports = communityRouter;
