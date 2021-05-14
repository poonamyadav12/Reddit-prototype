const Posts = require("../models/PostsModel");
const Communities = require("../models/CommunityModel");
const Users = require("../models/UsersModel");
const ObjectId = require("mongoose").Types.ObjectId;

const createPost = async (req, callback) => {
  // TODO :- Check here whether the user is a member of the community or not

  let rawPost = null;

  if (req.body.type === "text") {
    rawPost = {
      type: "text",
      description: req.body.description,
    };
  } else if (req.body.type === "image") {
    // Getting all the paths of images in a single array
    const imagePathArray = [];
    await req.files.postImage.forEach((image) => {
      imagePathArray.push(image.location);
    });

    rawPost = {
      type: "image",
      images: imagePathArray,
    };
  } else if (req.body.type === "link") {
    rawPost = {
      type: "link",
      description: req.body.description,
      link: req.body.link,
    };
  }

  rawPost.community = req.body.community_id;
  rawPost.createdBy = req.user._id;
  rawPost.comments = [];
  rawPost.numberOfComments = 0;
  rawPost.title = req.body.title;
  const post = await new Posts(rawPost).save();
  callback(null, {
    post: {
      _id: post._id,
      votes: post.votes,
      numberOfComments: post.numberOfComments,
      images: post.images,
      type: post.type,
      title: post.title,
      description: post.description,
      link: post.link,
      community_id: post.community,
      createdByUserName: req.user.name,
      createdByUser_id: post.createdBy,
      comments: [],
      createdAt: post.createdAt,
    },
    success: true,
  });
};

const createComment = async (req, callback) => {
  // TODO :- Check whether user is a member of the community or not

  // Find the post
  const rawPost = await Posts.findById(req.body.post_id);
  if (rawPost != null && rawPost.community.equals(req.body.community_id)) {
    let rawComment = null;
    if (!req.body.parent_id) {
      rawComment = {
        description: req.body.description,
      };
      rawPost.numberOfComments += 1;
    } else {
      // Find parent comment from post
      const parentComment = rawPost.comments.filter((comment) => {
        if (ObjectId(comment._id).equals(ObjectId(req.body.parent_id))) {
          return true;
        }
      });

      // If we don't find parent comment successfully
      if (!parentComment) {
        callback(null, {
          errorMessage: ["Select a valid Parent Comment."],
          success: false,
        });
        return;
      } else {
        rawComment = {
          description: req.body.description,
          depth: parentComment[0].depth + 1,
          parent_id: req.body.parent_id,
        };
        rawPost.numberOfComments += 1;
      }
    }

    // Saving the comment and post
    rawComment.createdBy = req.user._id;
    console.log("raw comments ", rawComment);
    rawPost.comments.push(rawComment);
    const post = await rawPost.save();

    // Accessing last added comment
    const comment = post.comments[post.comments.length - 1];

    callback(null, {
      comment: {
        _id: comment._id,
        post_id: req.body.post_id,
        community_id: req.body.community_id,
        parent_id: comment.parent_id,
        comment: comment.description,
        commentedByUser_id: req.user._id,
        commentedByUserName: req.user.name,
        createdAt: comment.createdAt,
      },
      success: true,
    });
    return;
  } else {
    callback(null, {
      errorMessage: ["Select a valid Post or Comment."],
      success: false,
    });
    return;
  }
};

// TODO:- Delete all the child comments if a parent comment is
// deleted & Delete all the upvotes and downvotes of the deleted
// user which should also reflect on the post and comments. Also
// the number of comments variable should be updated
const deletePostsAndCommentsOfAUserForMultipleCommunities = async (
  req,
  callback
) => {
  // Check whether the user is a creator for all the communities
  const communities = await Communities.find({
    _id: { $in: req.body.communities },
    creator: req.user._id,
  });

  if (communities.length != req.body.communities.length) {
    callback(null, {
      errorMessage: ["Select a valid community."],
      success: false,
    });
    return;
  }

  // Perform operation for each community
  await req.body.communities.forEach(async (community_id) => {
    // Delete Posts
    await Posts.deleteMany({
      community: community_id,
      createdBy: req.body.user_id,
    });
    // Delete Comments
    await Posts.updateMany(
      { community: community_id },
      { $pull: { comments: { createdBy: req.body.user_id } } },
      { multi: true }
    );
  });

  // Remove the user from all the communities
  await Communities.updateMany(
    { _id: { $in: req.body.communities } },
    { $pull: { members: { _id: req.body.user_id } } },
    { multi: true }
  );

  // Disable the memberships from user side
  // await Users.updateOne(
  //   { _id: req.body.user_id },
  //   { $pull: { memberships: { $elemMatch: { $in: req.body.communities } } } }
  // );
  const user = await Users.findOne({ _id: req.body.user_id });
  console.log(user);
  console.log(user.memberships);
  console.log(req.body.communities);
  user.memberships = user.memberships.filter((id) => {
    return req.body.communities.findIndex((_id) => _id == id) == -1
      ? true
      : false;
  });
  await user.save();

  callback(null, {
    message: "Deletion operation performed successfully",
    success: true,
  });
};

module.exports = {
  createPost,
  createComment,
  deletePostsAndCommentsOfAUserForMultipleCommunities,
};
