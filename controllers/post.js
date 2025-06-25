const { default: mongoose } = require('mongoose');
const { postSchema, commentSchema, userSchema } = require('../database/models');
const { logging } = require('../modules/app');
const { default: axios } = require('axios');
const users = mongoose.model('users', userSchema);
const posts = mongoose.model('posts', postSchema);
const comments = mongoose.model('comments', commentSchema);
const createPost = async (req, res) => {
  try {
    if (req.method == 'GET') {
      return res.status(200).json({
        message:
          'Required input : title and description, must be logged in. Optional: image',
      });
    }
    const { title, description, image } = req.body;
    if (!title || !description) {
      return res.status(400).json({
        message: 'No title or description',
      });
    }
    if (image) {
      try {
        await axios.get(image);
      } catch (err) {
        return res.status(400).json({
          message: 'Image does not exist or is unreachable.',
        });
      }
    }

    const createdby = req.session.user._id;
    const newPost = await posts.create({
      title: title,
      description: description,
      image: image,
      createdby: createdby,
    });
    const user = await users.findById(req.session.user._id);
    user.postcount += 1;
    user.save();
    return res.status(201).json({
      message: 'New Post created successfully',
      newPost,
    });
  } catch (err) {
    logging(err);
  }
};
const deletePost = async (req, res) => {
  try {
    const postID = req.query.id;
    let post = await posts.findById(postID);
    if (!post) {
      return res.status(400).json({
        message: 'No such posts exist',
      });
    }
    if (post.createdby != req.session.user._id) {
      return res.status(400).json({
        message: 'You are not authorized to do this',
      });
    }
    post = await posts.findOneAndDelete({ _id: postID });
  } catch (err) {
    logging(err);
    return res.status(500).json({
      message: 'Internal Server Error',
    });
  }
};
const likePost = async (req, res) => {
  try {
    const postID = req.params.id;
    let post = await posts.findById(postID);
    if (!post) return res.status(400).json({ message: 'Post dont exist' });
    let i = post.likedby.indexOf(req.session.user._id);
    if (i == -1) {
      post.likedby.push(req.session.user._id);
    } else {
      post.likedby.splice(i, 1);
    }
    i = post.dislikedby.indexOf(req.session.user._id);
    if (i != -1) {
      post.dislikedby.splice(i, 1);
    }
    await post.save();
    return res.status(201).json({
      message: 'Liked successfully',
      Like: post.likedby.length,
    });
  } catch (err) {
    logging(err);
    return res.status(500).json({
      message: 'Internal Server Error',
    });
  }
};
const dislikePost = async (req, res) => {
  try {
    const postID = req.params.id;
    let post = await posts.findById(postID);
    if (!post) return res.status(400).json({ message: 'Post dont exist' });

    let i = post.dislikedby.indexOf(req.session.user._id);
    if (i == -1) {
      post.dislikedby.push(req.session.user._id);
    } else {
      post.dislikedby.splice(i, 1);
    }
    i = post.likedby.indexOf(req.session.user._id);
    if (i != -1) {
      post.likedby.splice(i, 1);
    }
    await post.save();
    return res.status(201).json({
      message: 'Liked successfully',
      Dislike: post.dislikedby.length,
    });
  } catch (err) {
    logging(err);
    return res.status(500).json({
      message: 'Internal Server Error',
    });
  }
};

//

const feed = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const allPosts = await posts
      .find()
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('createdby', 'name');
    const postIds = allPosts.map((el) => el._id);
    const commentCounts = await comments.aggregate([
      { $match: { commenton: { $in: postIds } } },
      { $group: { _id: '$commenton', count: { $sum: 1 } } },
    ]);
    const commentCountMap = {};
    commentCounts.forEach((c) => {
      commentCountMap[c._id.toString()] = c.count;
    });
    const postData = allPosts.map((el) => ({
      id: el._id,
      author: el.createdby.name,
      date: el.date,
      title: el.title,
      description: el.description,
      likes: el.likedby.length,
      dislikes: el.dislikedby.length,
      comments: commentCountMap[el._id.toString()] || 0,
      image: el.image,
    }));
    return res.status(200).json(postData);
  } catch (err) {
    logging(err);
    return res.status(500).json({
      message: 'Internal Server Error',
    });
  }
};
const singlePost = async (req, res) => {
  try {
    const postID = req.params.id;
    const post = await posts.findById(postID).populate('createdby', 'name');
    const commentData = await comments
      .find({ commenton: postID })
      .populate('commentby', 'name');
    if (!post) {
      return res.status(404).json({
        message: 'Post dont exist',
      });
    }
    console.log(post);

    const postComments = commentData.map((el) => ({
      name: el.commentby.name,
      comment: el.comment,
    }));
    return res.status(200).json({
      image: post.image,
      title: post.title,
      description: post.description,
      likes: post.likedby.length || 0,
      dislikes: post.dislikedby.length || 0,
      author: post.createdby.name,
      date: post.date,
      postComments,
    });
  } catch (err) {
    logging(err);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};
const comment = async (req, res) => {
  try {
    if (req.method == 'GET') {
      const postID = req.params.id;
      const comment = await comments
        .find({ commenton: postID })
        .populate('commentby');
      const allComment = comment.map((el) => ({
        name: el.commentby.name,
        comment: el.comment,
      }));
      return res.status(200).json(allComment);
    }
    const { comment } = req.body;
    const commentby = req.session.user._id;
    const commenton = req.params.id;
    const postStatus = await posts.findById(commenton);
    if (!comment || comment.trim().length < 1) {
      return res.status(400).json({ message: 'Comment cannot be empty' });
    }

    if (!postStatus)
      return res.json({
        message: 'Post dont exist',
      });
    const createComment = await comments.create({
      comment: comment,
      commentby: commentby,
      commenton: commenton,
    });
    return res.status(201).json({
      message: 'Comment created successfully',
      createComment,
    });
  } catch (err) {
    logging(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
module.exports = {
  createPost,
  deletePost,
  likePost,
  dislikePost,
  feed,
  singlePost,
  comment,
};
