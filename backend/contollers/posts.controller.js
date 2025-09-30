import Profile from "../models/profile.model.js";
import User from "../models/user.model.js";
import Post from "../models/posts.model.js";

import Comment from "../models/comments.model.js";
import bcrypt from "bcrypt";
// controllers/posts.controller.js

// active check is a monitoring endpoint
export const activeCheck = async (req, res) => {
  return res.status(200).json({ message: "RUNNING" });
};

export const createPost = async (req, res) => {
  // Logic to create a post
  const { token } = req.body;
  try {
    const user = await User.findOne({where: { token }});
    if(!user) {
      return res.status(404).json({message: "User not found"});
    }
    const post = new Post({
      userId: user.id,
      body: req.body.body,
      media: req.file != undefined ? req.file.filename : "",
      fileType: req.file != undefined ? req.file.mimetype.split("/")[1] : "",
    })

    await post.save();

    return res.status(200).json({message: "Post created"});
    
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}


export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.findAll({
      include: [
        {
          model: User,
          as : "user",
          attributes: ["name", "email", "username", "profilePicture"]
        }
      ],
    });
    return res.json({posts})
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


export const deletePost = async (req, res) => {
  const {token, postId} = req.body;

  try {
    const user = await User.findOne({where: { token }});

    if(!user) {
      return res.status(404).json({message: "User not found"});
    }
    const post = await Post.findOne({where: {id: postId}});
    if(!post) {
      return res.status(404).json({message: "Post not found"});
    }
    if(post.userId !== user.id) {
      return res.status(401).json({message: "Unauthorized"});
    }
    await post.destroy();

    return res.json({message: "Post deleted"});
    
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }


}

export const commentPost = async (req, res) => {
  const { token, postId, commentBody } = req.body;
  try {
    const user = await User.findOne({ where: { token } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const post = await Post.findOne({ where: { id: postId } });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    await Comment.create({
      userId: user.id,
      postId: post.id,
      body: commentBody,
    });
    return res.json({ message: "Comment added" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}


export const get_comments_by_post = async (req, res) => {
  const { postId } = req.query;
  try {
    const post = await Post.findOne({ where: { id: postId }, include: [{ model: Comment, as: "comments" ,
      include: [{ model: User, as: "user", attributes: ["name", "email", "username", "profilePicture"] }]
    }] });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });

    }

    const comments = await Comment.findAll({ where: { postId }, include: [{ model: User, as: "user", attributes: ["id","username", "name","profilePicture"] }], order: [['createdAt', 'DESC']] });

    return res.json({postId,comments} );
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}


export const delete_comment_of_user = async (req, res) => {
  const { token, commentId } = req.body;
  try {
    const user = await User.findOne({ where: { token }, attributes: ["id"] });
    if(!user) {
      return res.status(404).json({message: "User not found"});
    }
    const comment = await Comment.findOne({ where: { id: commentId} });
    if(!comment) {
      return res.status(404).json({message: "Comment not found"});
    }
    if(comment.userId !== user.id) {
      return res.status(401).json({message: "Unauthorized"});
    }
    await comment.destroy();
    return res.json({message: "Comment deleted"});
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}


export const increment_likes = async (req, res) => {
  const { postId } = req.body;
  try {
    const post = await Post.findOne({ where: { id: postId } });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    post.likes  = post.likes + 1;
    await post.save();
    return res.json({ message: "Like added", likes: post.likes });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}