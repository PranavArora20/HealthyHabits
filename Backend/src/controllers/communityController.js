const GroupModel = require("../models/groupModel");
const PostModel = require("../models/postModel");

const createGroup = async (req, res) => {
  try {
    const { name, description, isPublic } = req.body;
    if (!name) return res.status(400).json({ message: "name required" });
    const group = await GroupModel.create({
      name,
      description,
      isPublic,
      owner: req.user.userId,
      members: [req.user.userId],
    });
    return res.status(201).json(group);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const joinGroup = async (req, res) => {
  try {
    const group = await GroupModel.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { members: req.user.userId } },
      { new: true }
    );
    if (!group) return res.status(404).json({ message: "Not found" });
    return res.json(group);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const listGroups = async (req, res) => {
  try {
    const groups = await GroupModel.find({ isPublic: true }).sort({ createdAt: -1 });
    return res.json(groups);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const createPost = async (req, res) => {
  try {
    const { groupId, text } = req.body;
    if (!groupId || !text) return res.status(400).json({ message: "groupId and text required" });
    const post = await PostModel.create({ group: groupId, user: req.user.userId, text });
    return res.status(201).json(post);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const listGroupPosts = async (req, res) => {
  try {
    const posts = await PostModel.find({ group: req.params.id })
      .sort({ createdAt: -1 })
      .populate("user", "name")
      .populate("comments.user", "name");
    return res.json(posts);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const likePost = async (req, res) => {
  try {
    const updated = await PostModel.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { likes: req.user.userId } },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Not found" });
    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const commentOnPost = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: "text required" });
    const updated = await PostModel.findByIdAndUpdate(
      req.params.id,
      { $push: { comments: { user: req.user.userId, text } } },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Not found" });
    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = { createGroup, joinGroup, listGroups, createPost, listGroupPosts, likePost, commentOnPost };
