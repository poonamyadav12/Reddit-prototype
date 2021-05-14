import Post from "../models/PostsModel";

const bcrypt = require("bcrypt");
const configuration = require("../config/config");
const UserModel = require("../models/UsersModel");
const MySQLUserModel = require('../mySQLModel/UsersModel')();
const CommunityModel = require("../models/CommunityModel");
const { uniqueNamesGenerator, names } = require("unique-names-generator");
const aleaRNGFactory = require("number-generator/lib/aleaRNGFactory");
const { uInt32 } = aleaRNGFactory(10);
const ObjectId = require("mongodb").ObjectID;
import {
  populateVotesAndCommentsOfPosts,
  getCommunityByUserIdV2,
} from "./community_api";
const redis = require("redis");
const client = redis.createClient({ detect_buffers: true });

const config = {
  dictionaries: [names],
};

export async function registerUser(message, callback) {
  let response = {};
  let err = {};
  console.log("Inside register user post Request");
  let user = message.body.user;
  console.log("User Creation ", JSON.stringify(user));
  try {
    const storedUser = await getUserById(user.email);

    if (storedUser) {
      err.status = 400;
      err.data = "UserId already exists";
      return callback(err, null);
    } else {
      user = await insertUser(user);
      const mySQLUser = await storeUserInMySQL(user);
      console.log(mySQLUser);
    }
  } catch (error) {
    console.log(error);
    err.status = 500;
    err.data = {
      code: error.code,
      msg:
        "Unable to create user. Please check application logs for more detail.",
    };
    return callback(err, null);
  }

  response.status = 200;
  response.data = user;
  return callback(null, response);
}

export async function loginUser(message, callback) {
  let response = {};
  let err = {};
  console.log("Inside login user post Request");
  let user = message.body.user;
  console.log("User Login ", JSON.stringify(user));
  const mySQLStoredUser = await getUserFromMySQL(user);
  if (mySQLStoredUser !== null) {
    if (await matchPassword(user.password, mySQLStoredUser.dataValues.password)) {
      console.log('From MySQL');
      response.status = 200;
      user._id = mySQLStoredUser.dataValues.user_id;
      user.name = mySQLStoredUser.dataValues.name;
      response.data = user;
      return callback(null, response);
    } else {
      console.log('From MySQL Password Mismatch');
      err.status = 401;
      err.data = {
        msg: "Password mismatch",
      };
      return callback(err, null);
    }
  } else {
    const storedUser = await getUserById(user.email);
    if (storedUser !== null) {
      if (await matchPassword(user.password, storedUser.password)) {
        console.log('From MongoDB');
        response.status = 200;
        user._id = storedUser._id;
        user.name = storedUser.name;
        response.data = user;
        return callback(null, response);
      } else {
        console.log('From MongoDB Password Mismatch');
        err.status = 401;
        err.data = {
          msg: "Password mismatch",
        };
        return callback(err, null);
      }
    } else {
      err.status = 400;
      err.data = {
        msg: "The account does not exist",
      };
      return callback(err, null);
    }
  }
}

export async function editUser(message, callback) {
  console.log("MESSAGEBODY[][][][][][][][][][][][][][][][");
  console.log(message.body);
  console.log("MESSAGEFile[][][][][][][][][][][][][][][][");
  console.log(message.file);
  let response = {};
  let err = {};
  console.log("Inside edit user post Request");
  let user = message.body;
  console.log("Edit User ", JSON.stringify(user));
  const storedUser = await UserModel.findOne({ _id: user.userId });
  try {
    if (user.name !== undefined) {
      storedUser.name = user.name;
    }
    if (user.password !== undefined) {
      storedUser.password = await hashPassword(user.password);
    }
    if (user.gender !== undefined) {
      storedUser.gender = user.gender;
    }
    if (user.description !== undefined) {
      storedUser.description = user.description;
    }
    if (message.file !== undefined) {
      storedUser.avatar = message.file.location;
      user.uploadedProfileImage = message.file.location;
    }
    if (user.uploadedProfileImage !== undefined) {
      storedUser.avatar = user.uploadedProfileImage;
    }
    if (user.location !== undefined) {
      storedUser.location = user.location;
    }
    if (user.topics !== undefined) {
      const topics = user.topics.split(",");
      storedUser.topics = topics;
      user.topics = topics;
    }
    if (user.email !== undefined) {
      storedUser.email = user.email;
    }
    await storedUser.save();
    response.status = 200;
    response.data = user;
    client.del(user.userId, function (err, reply) {
      console.log("Redis Del", reply);
    });
    return callback(null, response);
  } catch (error) {
    console.log(error);
    err.status = 400;
    err.data = {
      code: error.code,
      msg: "Email ID already exist",
    };
    return callback(err, null);
  }
}

export async function getUserFromMySQL(user) {
  console.log("Inside get user from my sql");
  const mySQLStoredUser = await MySQLUserModel.findOne({
    where: {
      email: user.email
    }
  });
  return mySQLStoredUser;
}

export async function getUserById(userId) {
  console.log("Inside get user by Id", userId);
  const user = await UserModel.findOne({ email: userId });
  console.log("user response  ", JSON.stringify(user));
  return user;
}

export async function getUserByObjId(message, callback) {
  let response = {};
  let error = {};
  console.log("Inside get user by Object ID");
  try {
    const user = await UserModel.findOne({ _id: message.body.userId });
    console.log("user response  ", JSON.stringify(user));
    if (user !== null) {
      response.status = 200;
      response.data = user;
      return callback(null, response);
    } else {
      error.status = 400;
      error.data = { msg: "Invalid Object Id." };
      return callback(error, null);
    }
  } catch (err) {
    error.status = 400;
    error.data = { msg: "Invalid Object Id." };
    return callback(error, null);
  }
}

async function insertUser(user) {
  console.log("Inside insert User");
  user.password = await hashPassword(user.password);
  user.handle = uniqueNamesGenerator(config) + uInt32().toString().slice(0, 3);
  var user = new UserModel(user);
  return await user.save();
}

async function storeUserInMySQL(user) {
  console.log("Inside store User in MySQL");
  const mySQLUser = await MySQLUserModel.create(
    {
      user_id: user._id.toString(),
      email: user.email,
      name: user.name,
      password: user.password,
    },
  );
  return mySQLUser;
}

async function hashPassword(password) {
  const saltRounds = 10;
  const hashedPassword = await new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, function (err, hash) {
      if (err) reject(err);
      resolve(hash);
    });
  });
  return hashedPassword;
}

export async function matchPassword(newPassword, storedEncryptedPassword) {
  // updated
  console.log("Inside match password");
  console.log(
    "password1" + newPassword + " password2 " + storedEncryptedPassword
  );
  const isSame = await bcrypt.compare(newPassword, storedEncryptedPassword); // updated
  console.log("In matchPassword" + isSame); // updated
  return isSame;
}

export const getUsersOfMyCommunity = async (req, callback) => {
  const pageSize =
    req.query.pageSize || configuration.defaultPageSizeCommunityModeration;
  const pageNumber = req.query.pageNumber;
  const searchKeyword = req.query.searchKeyword;
  const community_id = req.params.community_id;
  const communityJoinStatus = req.query.userType;
  // find the community
  const community = await CommunityModel.findById(community_id);
  if (
    !community ||
    !ObjectId(community.creator).equals(ObjectId(req.user._id))
  ) {
    callback(null, {
      errorMessage: ["Select a valid community"],
      success: false,
    });
  } else {
    // Initialize a  variable to set the paginated response
    let paginatedResponse = null;

    // Find the array of userIds who has been searched by the creator
    const users = community.members
      .filter((membership) => {
        return (
          membership.communityJoinStatus === communityJoinStatus &&
          membership._id != community.creator
        );
      })
      .map((membership) => membership._id);

    const customLabels = {
      totalDocs: "numberOfUsers",
      docs: "users",
      limit: "pageSize",
      page: "pageNumber",
    };

    const paginationOptions = {
      page: pageNumber,
      limit: pageSize,
      customLabels,
      select: {
        name: 1,
        handle: 1,
        avatar: 1,
        email: 1,
        _id: 1,
      },
    };

    if (searchKeyword) {
      // Send Paginated response with search keyword
      paginatedResponse = await UserModel.paginate(
        {
          $and: [
            { _id: { $in: users } },
            { name: { $regex: searchKeyword + ".*" } },
          ],
        },
        paginationOptions
      );
    } else {
      // Send Paginated response without search keyword
      paginatedResponse = await UserModel.paginate(
        {
          _id: { $in: users },
        },
        paginationOptions
      );
    }
    callback(null, { ...paginatedResponse, success: true });
  }
};

export async function getCommunityAndPosts(message, callback) {
  let response = {};
  let err = {};

  let userId = message.userId;
  console.log("Inside get community and posts kafka backend", userId);

  try {
    const result = await getAggregatedPostsAndCommunity(
      userId,
      message.options
    );
    response.status = 200;
    response.data = result;
    return callback(null, response);
  } catch (error) {
    console.log("Error x ", error);
    err.code = error.code;
    err.data =
      "Unable to successfully get the communities posts. Please check the log for more details.";
    return callback(err, null);
  }
}

async function getAggregatedPostsAndCommunity(userId, options) {
  const newOptions = Object.assign(
    {
      pageIndex: 1,
      pageSize: 2,
      sortBy: "createdAt",
      sortOrder: "desc",
      searchKeyword: ".*",
    },
    options
  );
  const communityInfos = await CommunityModel.find({
    members: { $elemMatch: { _id: userId, communityJoinStatus: "JOINED" } },
  });

  console.log("Community user is part of", communityInfos);

  const id = communityInfos.map((g) => ObjectId(g.id));

  const posts = Post.aggregate([
    {
      $match: {
        $and: [
          {
            community: { $in: id },
          },
          {
            $or: [
              {
                title: { $regex: newOptions.searchKeyword },
              },
              {
                description: { $regex: newOptions.searchKeyword },
              },
            ],
          },
        ],
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "createdBy",
        foreignField: "_id",
        as: "createdBy",
      },
    },
    {
      $lookup: {
        from: "communities",
        localField: "community",
        foreignField: "_id",
        as: "community",
      },
    },

    {
      $addFields: {
        createdBy: { $arrayElemAt: ["$createdBy", 0] },
        community: { $arrayElemAt: ["$community", 0] },

      },
    },
    {
      $addFields: {
        numberOfUsers: { $size: "$community.members" },
      },
    },
  ]);

  console.log("New options ", JSON.stringify(newOptions));
  const sortBy = newOptions.sortBy;
  const sortOrder = newOptions.sortOrder;
  const sort = {};
  sort[`${sortBy}`] = sortOrder == "desc" ? -1 : 1;
  const paginatedPosts = await Post.aggregatePaginate(posts, {
    page: newOptions.pageIndex,
    limit: newOptions.pageSize,
    sort,
  });

  console.log("paginated posts ", paginatedPosts);
  const finalPosts = await populateVotesAndCommentsOfPosts(
    paginatedPosts.docs,
    userId,
    0 /* Keeping the order same since sorting is already done above. */
  );
  paginatedPosts.docs = finalPosts;
  return paginatedPosts;
}

export const bulkApproveRequests = async (req, callback) => {
  // Get community
  const community = await CommunityModel.findById(req.body.community_id);

  // Check whether the communityId is valid or not
  if (!community || !community.creator.equals(req.user._id)) {
    callback(null, {
      errorMessage: ["Select a valid commnuity"],
      success: false,
    });
    return;
  }

  // Check for duplicate entries
  if (req.body.users.length !== Array.from(new Set(req.body.users)).length) {
    callback(null, {
      errorMessage: ["Select a valid set of users"],
      success: false,
    });
    return;
  }

  // Check whether the user are present in the desired state where they should be
  if (
    !checkStatusOfSelectedUsers(
      community.members,
      req.body.users,
      configuration.REQUESTED_TO_JOIN_COMMUNITY
    )
  ) {
    callback(null, {
      errorMessage: ["Select valid users"],
      success: false,
    });
    return;
  }

  // Change the status
  for (let index = 0; index < community.members.length; index++) {
    // If the input array includes this userId then update its status
    console.log(req.body.users.includes(String(community.members[index]._id)));
    if (req.body.users.includes(String(community.members[index]._id))) {
      community.members[index].communityJoinStatus =
        configuration.ACCEPTED_REQUEST_TO_JOIN_COMMUNITY;
    }
  }

  // Save the community
  await community.save();

  // Create OR Operator condition array
  const conditions = req.body.users.map((id) => {
    return { _id: id };
  });

  // Bulk update the users
  UserModel.updateMany(
    { $or: conditions },
    { $addToSet: { memberships: community._id } },
    { multi: true }
  ).then(
    callback(null, {
      message: "Successfully Approved all the requests!",
      success: true,
    })
  );
};

// Search all users functionality for chat API
export const searchAllUsers = async (req, callback) => {
  const users = await UserModel.find(
    {
      $and: [
        {
          name: { $regex: new RegExp(req.query.searchKeyword, "i") },
        },
        {
          _id: { $ne: req.user._id },
        },
      ],
    },
    "name email handle avatar"
  );
  callback(null, { success: true, users });
};
// HELPER FUNCTIONS

const checkStatusOfSelectedUsers = (memberships, users, status) => {
  for (let index = 0; index < users.length; index++) {
    let position = memberships.findIndex((membership) => {
      return (
        ObjectId(membership._id).equals(ObjectId(users[index])) &&
        membership.communityJoinStatus === status
      );
    });
    if (position === -1) return false;
  }
  return true;
};

export async function getMyCommunityAnalyticsData(message, callback) {
  console.log("Users ", message);
  const userId = message.body._id;
  console.log("UserID", userId);
  let response = {};
  let err = {};
  try {
    const communityResponseAnlaytics = await getMyCommunityAnalyticsDataPerUser(
      userId
    );
    console.log("Here ", communityResponseAnlaytics);
    response.data = communityResponseAnlaytics;
    response.status = 200;
    return callback(null, response);
  } catch (error) {
    err.status = 500;
    err.data = {
      code: err.code,
      msg:
        "Unable to successfully get the community analytics data! Please check the application logs for more details.",
    };
  }
}

async function getMyCommunityAnalyticsDataPerUser(userId) {
  let communities = await getCommunityByUserIdV2(userId);
  //console.log("Communities Info",communities);
  return communities;
}
