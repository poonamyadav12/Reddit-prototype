import { checkAuth } from "../utils/passport";
import { uploadS3 } from "../Utils/imageupload";

const express = require("express");
const kafka = require("../kafka/client");
const ObjectId = require("mongoose").Types.ObjectId;

const { kafka_default_response_handler } = require("../kafka/handler.js");
const {
  communitySchema,
  updateCommunitySchema,
} = require("../dataSchema/communitySchema");
const getPostsSchema = require("../dataSchema/getPostsSchema");
const getMyCommunitiesSchema = require("../dataSchema/getMyCommunitiesSchema");
const getUsersOfMyCommunitySchema = require("../dataSchema/getUsersOfMyCommunitySchema");
const communityVoteSchema = require("../dataSchema/communityVoteSchema");
const bulkApproveRequestsSchema = require("../dataSchema/bulkApproveRequestsSchema");
const getInviteStatusSchema = require("../dataSchema/getInvitesStatusSchema");
const getMyCommunitiesOfAUserSchema = require("../dataSchema/getMyCommunitiesOfAUserSchema");
const deleteUserFromMultipleCommunitiesSchema = require("../dataSchema/deleteUserFromMultipleCommunitiesSchema");
require("dotenv").config();

const router = express.Router();

const createCommunity = async (req, res) => {
  console.log("Inside create community post Request");
  console.log("Body", req.body);
  console.log("Files", req.files);
  if (!req.files.communityAvatar) {
    res
      .status(400)
      .send({ errorMessage: ["Community avatar must be specified."] });
    return;
  }

  if (!req.files.communityCover) {
    res
      .status(400)
      .send({ errorMessage: ["Community cover must be specified."] });
    return;
  }
  if (!req.body.community) {
    console.log("ove here");

    res.status(400).send({ errorMessage: ["Community must be specified."] });
    return;
  }

  const { error, value } = communitySchema.validate(
    JSON.parse(req.body.community)
  );

  if (error) {
    res.status(400).send(error.details);
    return;
  }
  value.communityAvatar = req.files.communityAvatar.map((f) => f.location);
  console.log(
    "req.files.communityCover.length ",
    req.files.communityCover.length
  );

  if (req.files.communityCover.length) {
    console.log("req.files.communityCover ", req.files.communityCover);
    value.communityCover = req.files.communityCover[0].location;
  }

  kafka.make_request(
    "reddit-community-topic",
    { path: "community-create", body: { community: value } },
    (err, results) => kafka_default_response_handler(res, err, results)
  );
};

const updateCommunity = async (req, res) => {
  console.log("Inside update community post Request");
  console.log("Request ", req.body);
  if (!req.body.community) {
    res.status(400).send({ errorMessage: ["Community must be specified."] });
    return;
  }

  const { error, value } = updateCommunitySchema.validate(
    JSON.parse(req.body.community)
  );

  if (error) {
    res.status(400).send(error.details);
    return;
  }

  if (req.files.communityAvatar && req.files.communityAvatar.length) {
    value.communityAvatar = req.files.communityAvatar.map((f) => f.location);
  }

  if (req.files.communityCover && req.files.communityCover.length) {
    value.communityCover = req.files.communityCover[0].location;
  }

  kafka.make_request(
    "reddit-community-topic",
    { path: "community-update", body: { community: value } },
    (err, results) => kafka_default_response_handler(res, err, results)
  );
};

// Route to get All posts in a paginated manner
const getAllPosts = async (req, res) => {
  const result = await getPostsSchema.validate(req.query);
  if (result.error) {
    res.status(400).send({ errorMessage: [result.error.details[0].message] });
    return;
  }
  // Check whether communityId is valid or not
  else if (!ObjectId.isValid(req.query.community_id)) {
    res.status(400).send({ errorMessage: ["Select a valid community."] });
    return;
  } else {
    kafka.make_request(
      "reddit-community-topic",
      {
        path: "get-posts",
        user: req.user,
        query: req.query,
      },
      (error, results) => {
        console.log(results);
        if (!results) {
          res.status(500).send({
            errorMessage: ["Failed to receive response from Kafka backend"],
          });
        }
        if (!results.res.success) {
          res.status(500).send({ ...results.res });
        } else {
          res.status(200).send({ ...results.res });
        }
      }
    );
  }
};

// Route to get all the communities created by the user in a paginated manner
const getMyCommunities = async (req, res) => {
  const result = await getMyCommunitiesSchema.validate(req.query);
  if (result.error) {
    res.status(400).send({ errorMessage: [result.error.details[0].message] });
    return;
  }
  kafka.make_request(
    "reddit-community-topic",
    {
      path: "get-created-communities",
      user: req.user,
      query: req.query,
    },
    (error, results) => {
      if (!results) {
        res.status(500).send({
          errorMessage: ["Failed to receive response from Kafka backend"],
        });
      }
      if (!results.res.success) {
        res.status(500).send({ ...results.res });
      } else {
        res.status(200).send({ ...results.res });
      }
    }
  );
};

// Route to fetch details of all the users who want to join the community
const getUsersOfMyCommunity = async (req, res) => {
  if (!ObjectId.isValid(req.params.community_id)) {
    res.status(400).send({
      errorMessage: ["Please select a valid community"],
    });
  } else {
    const result = await getUsersOfMyCommunitySchema.validate(req.query);
    if (result.error) {
      res.status(400).send({ errorMessage: [result.error.details[0].message] });
      return;
    }

    kafka.make_request(
      "reddit-user-topic",
      {
        path: "get-mycommunity-users",
        user: req.user,
        query: req.query,
        params: req.params,
      },
      (error, results) => {
        if (!results) {
          res.status(500).send({
            errorMessage: ["Failed to receive response from Kafka backend"],
          });
        }
        if (!results.res.success) {
          res.status(500).send({ ...results.res });
        } else {
          res.status(200).send({ ...results.res });
        }
      }
    );
  }
};

// Route for the user to request join the community
const requestToJoinCommunity = async (req, res) => {
  if (!ObjectId.isValid(req.body.community_id)) {
    res.status(400).send({
      errorMessage: ["Please select a valid community"],
    });
  } else {
    kafka.make_request(
      "reddit-community-topic",
      { path: "join-community", body: req.body, user: req.user },
      (error, results) => {
        if (!results) {
          res.status(500).send({
            errorMessage: ["Failed to receive response from Kafka backend"],
          });
        }
        if (!results.res.success) {
          res.status(500).send({ ...results.res });
        } else {
          res.status(200).send({ ...results.res });
        }
      }
    );
  }
};

// Route to approve multiple community join requests
const bulkApproveCommunityJoinRequests = async (req, res) => {
  const result = await bulkApproveRequestsSchema.validate(req.body);
  if (result.error) {
    res.status(400).send({ errorMessage: [result.error.details[0].message] });
    return;
  }
  kafka.make_request(
    "reddit-user-topic",
    { path: "bulk-approve-request", body: req.body, user: req.user },
    (error, results) => {
      if (!results) {
        res.status(500).send({
          errorMessage: ["Failed to receive response from Kafka backend"],
        });
      }
      if (!results.res.success) {
        res.status(500).send({ ...results.res });
      } else {
        res.status(200).send({ ...results.res });
      }
    }
  );
};

// Route to invite multiple users to join community
const bulkInviteUsersToCommunity = async (req, res) => {
  // Using the same JOI Schema as bulk approve request as both have the same format
  const result = await bulkApproveRequestsSchema.validate(req.body);
  if (result.error) {
    res.status(400).send({ errorMessage: [result.error.details[0].message] });
    return;
  }
  kafka.make_request(
    "reddit-invitation-topic",
    { path: "bulk-invite", body: req.body, user: req.user },
    (error, results) => {
      if (!results) {
        res.status(500).send({
          errorMessage: ["Failed to receive response from Kafka backend"],
        });
      }
      if (!results.res.success) {
        res.status(500).send({ ...results.res });
      } else {
        res.status(200).send({ ...results.res });
      }
    }
  );
};

// Route to fetch the status of invites sent by the community owner for a specific community
const getInviteStatusOfUsersOfMyCommunity = async (req, res) => {
  if (!ObjectId.isValid(req.params.community_id)) {
    res.status(400).send({
      errorMessage: ["Please select a valid community"],
    });
  } else {
    const result = await getInviteStatusSchema.validate(req.query);
    if (result.error) {
      res.status(400).send({ errorMessage: [result.error.details[0].message] });
      return;
    }
    kafka.make_request(
      "reddit-invitation-topic",
      {
        path: "get-invite-status",
        user: req.user,
        query: req.query,
        params: req.params,
      },
      (error, results) => {
        if (!results) {
          res.status(500).send({
            errorMessage: ["Failed to receive response from Kafka backend"],
          });
        }
        if (!results.res.success) {
          res.status(500).send({ ...results.res });
        } else {
          res.status(200).send({ ...results.res });
        }
      }
    );
  }
};

// Route to fetch the communities of which a user is a member of loggedIn user's created communities
const getMyCommunitiesOfAUser = async (req, res) => {
  const result = await getMyCommunitiesOfAUserSchema.validate(req.query);
  if (result.error) {
    res.status(400).send({ errorMessage: [result.error.details[0].message] });
    return;
  } else {
    kafka.make_request(
      "reddit-community-topic",
      {
        path: "get-mycommunities-of-user",
        user: req.user,
        query: req.query,
      },
      (error, results) => {
        if (!results) {
          res.status(500).send({
            errorMessage: ["Failed to receive response from Kafka backend"],
          });
        }
        if (!results.res.success) {
          res.status(500).send({ ...results.res });
        } else {
          res.status(200).send({ ...results.res });
        }
      }
    );
  }
};

// Route to delete a user from multiple communities
const deleteUserFromMultipleCommunities = async (req, res) => {
  const result = await deleteUserFromMultipleCommunitiesSchema.validate(
    req.body
  );
  if (result.error) {
    res.status(400).send({ errorMessage: [result.error.details[0].message] });
    return;
  }
  if (req.body.user == req.user._id) {
    res
      .status(400)
      .send({ errorMessage: "Cannot remove yourself from comunity!" });
    return;
  }
  kafka.make_request(
    "reddit-post-topic",
    {
      path: "delete-user-from-communities",
      user: req.user,
      body: req.body,
    },
    (error, results) => {
      if (!results) {
        res.status(500).send({
          errorMessage: ["Failed to receive response from Kafka backend"],
        });
      }
      if (!results.res.success) {
        res.status(500).send({ ...results.res });
      } else {
        res.status(200).send({ ...results.res });
      }
    }
  );
};

export async function getCommunityDetails(req, res) {
  console.log("inside get community details", req.query.communityId);
  let communityId = req.query.communityId;
  if (!communityId) {
    res
      .status(400)
      .send({
        code: "INVALID_PARAM",
        msg: "Invalid communityId ID",
      })
      .end();
  }

  kafka.make_request(
    "reddit-community-topic",
    { path: "community-details", communityId },
    (err, results) => kafka_default_response_handler(res, err, results)
  );
}

export async function deleteCommunity(req, res) {
  console.log("inside get community details", req.query.communityId);
  let communityId = req.query.communityId;
  if (!communityId) {
    res
      .status(400)
      .send({
        code: "INVALID_PARAM",
        msg: "Invalid communityId ID",
      })
      .end();
  }

  kafka.make_request(
    "reddit-community-topic",
    { path: "community-delete", communityId },
    (err, results) => kafka_default_response_handler(res, err, results)
  );
}

export async function upVoteCommunity(req, res) {
  console.log("inside up vote community", req.body);
  // const result = await communityVoteSchema.validate(req.body);
  // if (result.error) {
  //   res.status(400).send({ errorMessage: [result.error.details[0].message] });
  //   return;
  // }
  const { error, value } = communityVoteSchema.validate(req.body);

  if (error) {
    res.status(400).send(error.details);
    return;
  }
  value.userId = req.user._id;
  kafka.make_request(
    "reddit-community-topic",
    { path: "community-upvote", value },
    (err, results) => kafka_default_response_handler(res, err, results)
  );
}

export async function downVoteCommunity(req, res) {
  console.log("inside down vote community", req.body);
  const { error, value } = communityVoteSchema.validate(req.body);

  if (error) {
    res.status(400).send(error.details);
    return;
  }
  value.userId = req.user._id;
  kafka.make_request(
    "reddit-community-topic",
    { path: "community-downvote", value },
    (err, results) => kafka_default_response_handler(res, err, results)
  );
}

export async function searchCommunity(req, res) {
  console.log("inside community search", req.query);
  const value = req.user._id;
  console.log("SEARCH COMMUNITY", req.user);
  kafka.make_request(
    "reddit-community-topic",
    {
      path: "community-search",
      value,
      options: {
        pageIndex: req.query.pageIndex || 1,
        pageSize: req.query.pageSize || 50,
        sortBy: req.query.sortBy || "createdAt",
        sortOrder: req.query.sortOrder || "desc",
        searchKeyword: req.query.searchKeyword
          ? `${req.query.searchKeyword}.*`
          : ".*",
      },
    },
    (err, results) => kafka_default_response_handler(res, err, results)
  );
}

router.post(
  "/create",
  uploadS3.fields([
    {
      name: "communityAvatar",
      maxCount: 100,
    },
    {
      name: "communityCover",
      maxCount: 1,
    },
  ]),
  createCommunity
);

router.post(
  "/update",
  uploadS3.fields([
    {
      name: "communityAvatar",
      maxCount: 100,
    },
    {
      name: "communityCover",
      maxCount: 1,
    },
  ]),
  updateCommunity
);
router.post("/join", checkAuth, requestToJoinCommunity);
router.post("/upvote", checkAuth, upVoteCommunity);
router.post("/downvote", checkAuth, downVoteCommunity);
router.get("/search", checkAuth, searchCommunity);
router.get("/get", checkAuth, getCommunityDetails);
router.get("/mycommunities", checkAuth, getMyCommunities);
router.get(
  "/mycommunities/users/:community_id",
  checkAuth,
  getUsersOfMyCommunity
);
router.post(
  "/mycommunities/users/approve",
  checkAuth,
  bulkApproveCommunityJoinRequests
);
router.get(
  "/mycommunities/users/invites/:community_id",
  checkAuth,
  getInviteStatusOfUsersOfMyCommunity
);
router.get(
  "/mycommunities/user/communities",
  checkAuth,
  getMyCommunitiesOfAUser
);
//router.get("/mycommunities/:id", checkAuth, getMyCommunities);
router.get("/posts", checkAuth, getAllPosts);
router.delete("/delete", deleteCommunity);
router.post(
  "/mycommunities/users/invite",
  checkAuth,
  bulkInviteUsersToCommunity
);
router.post("/delete/user", checkAuth, deleteUserFromMultipleCommunities);
module.exports = router;
