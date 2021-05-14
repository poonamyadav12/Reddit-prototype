import { createError } from "../helper/error";
import config from "../config/config";
import { createIndexes } from "../models/PostsModel";
const CommunityModel = require("../models/CommunityModel");
const PostsModel = require("../models/PostsModel");
const mongoose = require("mongoose");
const UsersModel = require("../models/UsersModel");
const PostsVotesModel = require("../models/PostsVotesModel");
const CommentsVotesModel = require("../models/CommentsVotesModel");
const CommunityVotesModel = require("../models/CommunityVotesModel");
const ObjectId = require("mongodb").ObjectID;
const redis = require("redis");
const client = redis.createClient({ detect_buffers: true });
const util = require("util");
client.get = util.promisify(client.get);

export async function createCommunity(message, callback) {
  let response = {};
  console.log("Inside create user post Request");
  let community = message.body.community;
  console.log("Community Creation ", JSON.stringify(community));
  try {
    community = await insertCommunity(community);
    const user = await updateCreatorsCommunityList(
      community.creator,
      community._id
    );
  } catch (error) {
    console.log("error in creting community", JSON.stringify(error));

    let err = createError(
      500,
      "Unable to create community. Please check application logs for more detail."
    );
    console.log("Error code ", error.code);

    if (error.code == 11000) {
      err = createError(
        400,
        "Community name already exists. Please enter unique name."
      );
    }
    return callback(err, null);
  }

  response.status = 200;
  response.data = community;
  return callback(null, response);
}

export async function updateExistingCommunity(message, callback) {
  let response = {};
  let err = {};
  console.log("Inside update community post Request api");
  let community = message.body.community;
  console.log("Community Updation ", JSON.stringify(community));
  try {
    const storedCommunity = await getCommunityByObjectID(community._id);

    if (!storedCommunity) {
      err = createError(
        400,
        "Community ID invalid. Please provide correct community ID to update"
      );
      return callback(err, null);
    } else {
      community = await updateCommunity(community);
    }
  } catch (error) {
    console.log("error in update", error);
    err.status = 500;
    err.data = {
      code: err.code,
      msg:
        "Unable to successfully update the community! Please check the application logs for more details.",
    };
    return callback(err, null);
  }
  response.status = 200;
  response.data = community;
  console.log("response for update ", community);
  return callback(null, response);
}

async function getCommunityByObjectID(communityId) {
  const community = CommunityModel.findOne({ _id: communityId });
  return community;
}

async function updateCommunity(community) {
  console.log("Inside update community");
  const value = await CommunityModel.findOneAndUpdate(
    { _id: ObjectId(community._id) },
    { ...community },
    { new: true }
  );
  await value.save();
  return value;
}

// Function to fetch communities of whom the user is a part of by userId
export async function getAllCommunityForUser(message, callback) {
  let response = {};
  let error = {};
  const userId = message.userId;

  console.log("Inside get all community list Request");
  try {
    const communities = await getCommunityByUserId(userId);

    console.log("communitiesX ", JSON.stringify(communities));
    return callback(null, { status: 200, data: communities });
  } catch (err) {
    console.log(err);
    error.status = 500;
    error.data = {
      code: err.code,
      msg:
        "Unable to successfully get all the Communities! Please check the application logs for more details.",
    };
    return callback(error, null);
  }
}

// Function to fetch communities of whom the user is a part of by userId
export async function getCommunityByUserId(userId) {
  console.log("Inside get Community By User ID XX ", userId);
  const result = await CommunityModel.find({
    members: { $elemMatch: { _id: userId } },
  })
    .populate("members._id")
    .populate("creator")
    .populate("posts");
  console.log("ResultsX ", JSON.stringify(result));
  return result;
}

export async function getCommunityByUserIdV2(userId) {
  const communityInfos = await CommunityModel.aggregate([
    {
      $match: {
        creator: ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: "communityvotes",
        localField: "_id",
        foreignField: "communityId",
        as: "communityvotes",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "creator",
        foreignField: "_id",
        as: "creator",
      },
    },
    {
      $lookup: {
        from: "posts",
        localField: "_id",
        foreignField: "community",
        as: "posts",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "posts.createdBy",
        foreignField: "_id",
        as: "creatorOfPosts",
      },
    },
    {
      $addFields: {
        numberOfVotes: {
          $cond: {
            if: { $isArray: "$communityvotes" },
            then: { $sum: "$communityvotes.vote" },
            else: 0,
          },
        },

        numberOfPosts: {
          $cond: {
            if: { $isArray: "$posts" },
            then: { $size: "$posts" },
            else: 0,
          },
        },
        numberOfUsers: { $size: "$members" },
        posts: {
          $map: {
            input: "$posts",
            as: "p",
            in: {
              $mergeObjects: [
                "$$p",
                {
                  createdBy: {
                    $first: {
                      $filter: {
                        input: "$creatorOfPosts",
                        cond: { $eq: ["$$this._id", "$$p.createdBy"] },
                      },
                    },
                  },
                },
              ],
            },
          },
        },
      },
    },
  ]);
  return communityInfos;
}

// Function to get all the community details
export async function getCommunityDetails(message, callback) {
  let response = {};
  let error = {};
  console.log("inside get community details", message.communityId);
  let communityId = message.communityId;
  console.log("Inside get communityId details Request");
  try {
    const communityDetail = await getCommunityById(communityId);
    if (!communityDetail) {
      error.status = 400;
      error.data = {
        code: "400",
        msg:
          "Invalid Community Id",
      };
      return callback(error, null);
    }
    response.status = 200;
    response.data = communityDetail;
    return callback(response, null);
  } catch (err) {
    console.log(err);
    error.status = 500;
    error.data = {
      code: err.code,
      msg:
        "Unable to successfully get the Community! Please check the application logs for more details.",
    };
    return callback(error, null);
  }
}

// Get all posts with nested comements
export const getAllPosts = async (req, callback) => {
  const pageSize = req.query.pageSize || config.defaultPageSizePosts;
  const pageNumber = req.query.pageNumber;

  const customLabels = {
    totalDocs: "numberOfPosts",
    docs: "posts",
    limit: "pageSize",
    page: "pageNumber",
  };

  const options = {
    page: pageNumber,
    limit: pageSize,
    customLabels,
  };

  const orderByDateIdentifier =
    !req.query.orderByDate || req.query.orderByDate == 1 ? -1 : 1;

  let postsAggregateQuery = null;
  if (!req.query.orderByPopularity || req.query.orderByPopularity == 0) {
    postsAggregateQuery = PostsModel.aggregate([
      { $match: { community: ObjectId(req.query.community_id) } },
      {
        $lookup: {
          from: "users",
          localField: "createdBy",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          "user.topics": 0,
          "user.password": 0,
        },
      },
      { $sort: { createdAt: orderByDateIdentifier } },
    ]);
  } else {
    const orderByPopularityIdentifier =
      req.query.orderByPopularity == 1 ? -1 : 1;
    postsAggregateQuery = PostsModel.aggregate([
      { $match: { community: ObjectId(req.query.community_id) } },
      {
        $lookup: {
          from: "users",
          localField: "createdBy",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          "user.topics": 0,
          "user.password": 0,
        },
      },
      {
        $sort: {
          votes: orderByPopularityIdentifier,
          createdAt: orderByDateIdentifier,
        },
      },
    ]);
  }

  const posts = await PostsModel.aggregatePaginate(
    postsAggregateQuery,
    options
  );

  const finalPosts = await populateVotesAndCommentsOfPosts(
    posts.posts,
    req.user._id,
    orderByDateIdentifier
  );
  callback(null, {
    posts: finalPosts,
    totalPosts: posts.numberOfPosts,
    pageSize: posts.pageSize,
    pageNumber: posts.pageNumber,
    totalPages: posts.totalPages,
    hasNextPage: posts.hasNextPage,
    hasPrevPage: posts.hasPrevPage,
    nextPage: posts.nextPage,
    prevPage: posts.prevPage,
    success: true,
  });
};

// Return a paginated response of all the communities created by the user
export const getAllCreatedCommunitiesByUserId = async (req, callback) => {
  const pageSize =
    req.query.pageSize || config.defaultPageSizeCommunityModeration;
  const pageNumber = req.query.pageNumber;
  const searchKeyword = req.query.searchKeyword;
  let totalPages = 0;
  let countPages = null;
  let loggedInUser;

  // Order by descending order
  const orderByDateInDescending = -1;
  if (searchKeyword) {
    // Count the total number of pages
    countPages = await CommunityModel.aggregate([
      {
        $match: {
          $and: [
            { creator: mongoose.Types.ObjectId(req.user._id) },
            { communityName: { $regex: searchKeyword + ".*" } },
          ],
        },
      },
      {
        $count: "totalDocuments",
      },
    ]);

    // Populate the communnities created by user
    loggedInUser = await UsersModel.findById(
      req.user._id,
      "createdCommunities"
    ).populate({
      path: "createdCommunities",
      select: "communityName communityAvatar members",
      options: {
        sort: {
          createdAt: orderByDateInDescending,
        },
        skip: (pageNumber - 1) * pageSize,
        limit: pageSize,
      },
      match: {
        communityName: { $regex: searchKeyword + ".*" },
      },
    });
  } else {
    countPages = await CommunityModel.aggregate([
      {
        $match: { creator: mongoose.Types.ObjectId(req.user._id) },
      },
      {
        $count: "totalDocuments",
      },
    ]);
    loggedInUser = await UsersModel.findById(
      req.user._id,
      "createdCommunities"
    ).populate({
      path: "createdCommunities",
      select: "communityName communityAvatar members",
      options: {
        sort: {
          createdAt: orderByDateInDescending,
        },
        skip: (pageNumber - 1) * pageSize,
        limit: pageSize,
      },
    });
  }
  if (countPages && countPages.length != 0)
    totalPages = Math.ceil(countPages[0].totalDocuments / pageSize);

  // Populate the complete list wit required data (totalRequests)
  const finalCommunitiesList = [];

  for (let index = 0; index < loggedInUser.createdCommunities.length; index++) {
    finalCommunitiesList.push({
      _id: loggedInUser.createdCommunities[index]._id,
      communityName: loggedInUser.createdCommunities[index].communityName,
      totalRequests: loggedInUser.createdCommunities[index].members.filter(
        (membership) => {
          return (
            membership.communityJoinStatus ===
            config.REQUESTED_TO_JOIN_COMMUNITY
          );
        }
      ).length,
      communityAvatar:
        loggedInUser.createdCommunities[index].communityAvatar.length > 0
          ? loggedInUser.createdCommunities[index].communityAvatar[0]
          : null,
    });
  }

  callback(null, {
    communities: finalCommunitiesList,
    totalPages,
    success: true,
  });
};

// A request is generated which when the community owner accepts the
// user which requested  initially becomes the member of the community
export const requestToJoinCommunity = async (req, callback) => {
  // Find the community object
  const community = await CommunityModel.findById(req.body.community_id);

  // If commnity does not exist
  if (!community) {
    callback(null, {
      errorMessage: ["Select a valid community."],
      success: false,
    });
    return;
  }
  // Find user's Id who is requesting join in the members array
  const index = community.members.findIndex((membership) => {
    console.log(membership);
    console.log(ObjectId(membership._id) === ObjectId(req.user._id));
    return ObjectId(membership._id).equals(ObjectId(req.user._id));
  });
  // Check whether the user has joined the community
  if (
    index !== -1 &&
    community.members[index].communityJoinStatus ===
      config.ACCEPTED_REQUEST_TO_JOIN_COMMUNITY
  ) {
    callback(null, {
      errorMessage: ["You are already a member of this community."],
      success: false,
    });
    return;
  }
  // Check whether the user has alredy been invited to join the community or not
  else if (
    index !== -1 &&
    community.members[index].communityJoinStatus ===
      config.INVITED_TO_JOIN_COMMUNITY
  ) {
    callback(null, {
      errorMessage: [
        "You have been already invited to join the community. Please accept that invitation to join the community.",
      ],
      success: false,
    });
    return;
  }
  // Check whether the user has already requested to join the community
  else if (
    index !== -1 &&
    community.members[index].communityJoinStatus ===
      config.REQUESTED_TO_JOIN_COMMUNITY
  ) {
    callback(null, {
      errorMessage: ["You have already requested to join this community."],
      success: false,
    });
    return;
  } else {
    // Generate the request
    community.members.push({
      _id: ObjectId(req.user._id),
      communityJoinStatus: config.REQUESTED_TO_JOIN_COMMUNITY,
    });
    await community.save();
    callback(null, {
      message:
        "Requested successfully to join " + community.communityName + ".",
      success: true,
    });
  }
};

export const getCommunityStatus = async (req, callback) => {
  const community = await CommunityModel.findOne({
    _id: req.params.community_id,
    members: { $elemMatch: { _id: ObjectId(req.user._id) } },
  });
  if (!community) {
    callback(null, { status: "NONE", success: true });
    return;
  } else {
    const index = community.members.findIndex((member) => {
      return member._id == req.user._id;
    });
    callback(null, {
      status: community.members[index].communityJoinStatus,
      success: true,
    });
    return;
  }
};

// HELPER FUNCTIONS

// Create a new community
async function insertCommunity(community) {
  console.log("Inside insert Community");
  var community = new CommunityModel(community);
  return await community.save();
}

// Get community details by community_id
async function getCommunityById(communityId) {
  const community = await CommunityModel.findOne({ _id: communityId })
    .populate("members._id")
    .populate("creator")
    .populate("Posts");

  console.log("Community ID ", communityId);
  console.log("Community ", community);
  if (!community) {
    return null;
  }
  const communityVotes = await CommunityVotesModel.find({ communityId });
  console.log("CommunityVotes ", communityVotes);
  const votes = communityVotes.map((cv) => cv.vote).reduce((a, b) => a + b, 0);
  console.log("votes ", votes);

  let finalCommunity = JSON.parse(JSON.stringify(community));
  finalCommunity.communityVotes = communityVotes;
  finalCommunity.votes = votes;
  console.log("finalCommunity ", finalCommunity);
  return finalCommunity;
}

//For my communities page
export async function getCommunitiesByUserId(userId, options) {
  console.log("userId ", userId);
  const newOptions = Object.assign(
    {
      pageIndex: 1,
      pageSize: 2,
      sortBy: "createdAt",
      sortOrder: "desc",
    },
    options
  );
  console.log("New options ", JSON.stringify(newOptions));
  const sortBy = newOptions.sortBy;
  const sortOrder = newOptions.sortOrder;
  const sort = {};
  sort[`${sortBy}`] = sortOrder == "desc" ? -1 : 1;
  const communityInfos = CommunityModel.aggregate([
    {
      $match: { creator: ObjectId(userId) },
    },
    {
      $addFields: {
        numberOfPosts: {
          $cond: {
            if: { $isArray: "$posts" },
            then: { $size: "$posts" },
            else: 0,
          },
        },
        numberOfUsers: { $size: "$members" },
      },
    },
  ]);

  console.log("community Infos ", communityInfos);
  const paginatedCommunity = await CommunityModel.aggregatePaginate(
    communityInfos,
    {
      page: newOptions.pageIndex,
      limit: newOptions.pageSize,
      sort,
    }
  );
  return paginatedCommunity;
}

export async function deleteCommunity(message, callback) {
  let response = {};
  let error = {};

  console.log("Inside delete Community ", message.communityId);
  let communityId = message.communityId;
  try {
    await CommunityModel.remove({ _id: communityId });
    response.status = 200;
    response.data = "Deleted Successfully";
    return callback(null, response);
  } catch (err) {
    error.status = 500;
    error.data = {
      code: err.code,
      msg:
        "Unable to delete the community ID successfully. Please check the logs for more details.",
    };
    return callback(error, null);
  }
}

export async function getCommunityListCreatedByUser(message, callback) {
  let userId = message.userId;
  let response = {};
  let error = {};
  if (!userId) {
    error.status = 500;
    error.data = {
      code: "INVALID_PARAM",
      msg: "Invalid User ID",
    };
    return callback(error, null);
  }
  try {
    const communities = await getCommunitiesByUserId(userId, message.options);
    console.log("Communities By User ID " + JSON.stringify(communities));
    response.status = 200;
    response.data = communities;
    return callback(null, response);
  } catch (err) {
    console.log(err);
    error.status = 500;
    error.data = {
      code: err.code,
      msg:
        "Unable to successfully get the Activities! Please check the application logs for more details.",
    };
    return callback(error, null);
  }
}

// Update users createdCommunities Array
async function updateCreatorsCommunityList(userId, communityId) {
  // Find the user
  const user = await UsersModel.findById(userId);
  if (user) {
    // Update the user's createdCommuity array if you find it successfully
    user.createdCommunities.push(communityId);
    user.memberships.push(communityId);
    return await user.save();
  } else {
    return null;
  }
}

// Populate the votes of posts and nested comments along with their votes
export const populateVotesAndCommentsOfPosts = async (
  posts,
  user_id,
  orderByDateIdentifier
) => {
  const finalPosts = [];
  for (let index = 0; index < posts.length; index++) {
    let voteStatus = 0;
    const postVote = await PostsVotesModel.findOne({
      post_id: posts[index]._id,
      createdBy: user_id,
    });
    if (postVote != null) {
      voteStatus = postVote.vote;
    }
    posts[index].comments = await organizeComments(
      posts[index].comments,
      user_id,
      posts[index]._id,
      orderByDateIdentifier
    );
    posts[index].voteStatus = voteStatus;
    finalPosts.push({
      ...posts[index],
    });
  }
  return finalPosts;
};

// Populate only the votes of parent comment
const populateVoteOfParentComment = async (post_id, comment_id, user_id) => {
  const commentVote = await CommentsVotesModel.findOne({
    comment_id,
    post_id,
    createdBy: user_id,
  });
  let voteStatus = 0;
  if (commentVote != null) {
    voteStatus = commentVote.voteStatus;
  }
  return voteStatus;
};

// Function which organizes the comments in a nested fashion. This is the starting
// point to the recursive solution of nested comments
const organizeComments = async (
  commentsArray,
  user_id,
  post_id,
  orderByDateIdentifier
) => {
  let threads = {};
  let comment = null;
  for (let index = 0; index < commentsArray.length; index++) {
    comment = commentsArray[index];
    comment["children"] = {};
    if (commentsArray[index].depth == 0) {
      comment.voteStatus = await populateVoteOfParentComment(
        post_id,
        commentsArray[index]._id,
        user_id
      );
      comment.user = await populateUser(comment.createdBy);
      threads[comment._id] = comment;
      continue;
    }
    await organizeChildComments(comment, threads);
  }
  threads = getSortedCommentsArray(threads, orderByDateIdentifier);
  return threads;
};

// Recursive function used to organize comments in the nested manner.
const organizeChildComments = async (comment, threads) => {
  for (let thread in threads) {
    const currentParent = threads[thread];
    if (ObjectId(thread).equals(ObjectId(comment.parent_id))) {
      comment.user = await populateUser(comment.createdBy);
      currentParent.children[comment._id] = comment;
      return;
    }
    if (currentParent.children) {
      organizeChildComments(comment, currentParent.children);
    }
  }
};

// Function which sorts the parent comment on the basis of popularity. If there is a tie
// It is broken by createdAt value
const getSortedCommentsArray = (commentsObject, orderByDateIdentifier) => {
  const sortCommentsByVotesAndDate = (a, b) => {
    // Sort by most popular
    if (a.votes > b.votes) {
      return -1;
    } else if (b.votes > a.votes) {
      return 1;
    } else {
      // Sort the ties using date
      const d1 = new Date(a.createdAt);
      const d2 = new Date(b.createdAt);
      if (d1 > d2) {
        return orderByDateIdentifier;
      } else if (d1 < d2) {
        return orderByDateIdentifier;
      } else {
        return 0;
      }
    }
  };
  const sortedCommentsArray = Object.values(commentsObject).sort(
    sortCommentsByVotesAndDate
  );
  return sortedCommentsArray;
};

// Populates the user data for each and every comment
const populateUser = async (user_id) => {
  const user = await client.get(String(user_id));
  if (user) return JSON.parse(user);
  else {
    const user = await UsersModel.findById(user_id, "name email handle avatar");
    client.set(String(user_id), JSON.stringify(user));
  }
};

const UPVOTE = 1;
const DOWNVOTE = -1;

export async function communityUpVote(message, callback) {
  console.log("messg X", message);
  message.value.type = UPVOTE;
  return communityVote(message.value, callback);
}

export async function communityDownVote(message, callback) {
  message.value.type = DOWNVOTE;
  return communityVote(message.value, callback);
}

async function communityVote(message, callback) {
  const type = message.type;
  const communityId = message.communityId;
  console.log("communityId ", communityId);
  const userId = message.userId;
  const vote = await CommunityVotesModel.findOne({
    communityId: communityId,
    createdBy: userId,
  });
  let newVote = 0;
  let response = {};
  if (!vote) {
    console.log("Vote does not exist");
    newVote = type;
  } else {
    const prevVote = vote.vote;
    console.log("Prev Vote ", prevVote);
    if (!(prevVote ^ type)) {
      console.log("Delete Vote ", prevVote);
      // Delete the vote
      await CommunityVotesModel.deleteOne({
        communityId: communityId,
        createdBy: userId,
      });
      const community = await getCommunityById(communityId);
      if (!community) {
        error.status = 400;
        error.data = {
          code: "400",
          msg:
            "Invalid Community Id",
        };
        return callback(error, null);
      }
      response.status = 200;
      response.data = community;
      return callback(null, response);
    } else {
      newVote = prevVote + type * 2;
      console.log("New Vote ", newVote);
    }
  }

  await CommunityVotesModel.updateOne(
    { communityId: communityId, createdBy: userId },
    { $set: { vote: newVote } },
    { upsert: true } // Make this update into an upsert
  );
  const community = await getCommunityById(communityId);
  if (!community) {
    error.status = 400;
    error.data = {
      code: "400",
      msg:
        "Invalid Community Id",
    };
    return callback(error, null);
  }
  response.status = 200;
  response.data = community;
  console.log("CommunityX ", community);
  return callback(null, response);
}

export async function communitySearch(message, callback) {
  let options = message.options;
  let response = {};
  let error = {};
  try {
    const communityInfos = await getCommunityBySearchQuery(options);
    response.status = 200;
    response.data = communityInfos;
    return callback(null, response);
  } catch (err) {
    console.log("Error search X", err);
    error.data = {
      code: err.code,
      msg:
        "Unable to successfully get the Communities! Please check the application logs for more details.",
    };
    return callback(error, null);
  }
}

export const getMyCommunitiesOfAUser = async (req, callback) => {
  const user_id = req.query.user_id;
  const pageNumber = req.query.pageNumber;
  const pageSize =
    req.query.pageSize || config.defaultPageSizeCommunityModeration;
  const searchKeyword = req.query.searchKeyword
    ? req.query.searchKeyword + ".*"
    : ".*";
  const customLabels = {
    totalDocs: "numberOfCommunities",
    docs: "communities",
    limit: "pageSize",
    page: "pageNumber",
  };
  const options = {
    page: pageNumber,
    limit: pageSize,
    customLabels,
  };

  const communitiesAggregateQuery = CommunityModel.aggregate([
    {
      $match: {
        $and: [
          { creator: ObjectId(req.user._id) },
          { communityName: { $regex: searchKeyword } },
          {
            members: {
              _id: ObjectId(user_id),
              communityJoinStatus: config.ACCEPTED_REQUEST_TO_JOIN_COMMUNITY,
            },
          },
        ],
      },
    },
    {
      $project: {
        communityName: 1,
        communityAvatar: 1,
        description: 1,
        createdAt: 1,
        updatedAt: 1,
      },
    },
  ]);

  const communities = await CommunityModel.aggregatePaginate(
    communitiesAggregateQuery,
    options
  );

  callback(null, { communities, success: true });
  return;
};

async function getCommunityBySearchQuery(options) {
  const newOptions = Object.assign(
    {
      pageIndex: 1,
      pageSize: 50,
      sortBy: "createdAt",
      sortOrder: "desc",
      searchKeyword: ".*",
    },
    options
  );
  console.log("New options ", JSON.stringify(newOptions));
  const sortBy = newOptions.sortBy;
  const sortOrder = newOptions.sortOrder;
  const sort = {};
  sort[`${sortBy}`] = sortOrder == "desc" ? -1 : 1;
  const communityInfos = CommunityModel.aggregate([
    {
      $match: {
        $or: [
          {
            communityName: { $regex: newOptions.searchKeyword },
          },
          {
            description: { $regex: newOptions.searchKeyword },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "communityvotes",
        localField: "_id",
        foreignField: "communityId",
        as: "communityvotes",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "creator",
        foreignField: "_id",
        as: "creator",
      },
    },
    {
      $addFields: {
        numberOfVotes: {
          $cond: {
            if: { $isArray: "$communityvotes" },
            then: { $sum: "$communityvotes.vote" },
            else: 0,
          },
        },
        numberOfPosts: {
          $cond: {
            if: { $isArray: "$posts" },
            then: { $size: "$posts" },
            else: 0,
          },
        },
        numberOfUsers: { $size: "$members" },
      },
    },
  ]);

  console.log("community Infos ", communityInfos);
  const paginatedCommunity = await CommunityModel.aggregatePaginate(
    communityInfos,
    {
      page: newOptions.pageIndex,
      limit: newOptions.pageSize,
      sort,
    }
  );
  return paginatedCommunity;
}