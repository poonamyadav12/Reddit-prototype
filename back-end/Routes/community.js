import { checkAuth } from "../Utils/passport";
import { uploadS3 } from "../Utils/imageupload";

const express = require("express");
const { auth } = require("../utils/passport");
const Joi = require("joi");
const kafka = require("../kafka/client");
const ObjectId = require("mongoose").Types.ObjectId;

const { kafka_default_response_handler } = require("../kafka/handler.js");
const {
  communitySchema,
  updateCommunitySchema,
} = require("../dataSchema/communitySchema");
const getPostsSchema = require("../dataSchema/getPostsSchema");
const getMyCommunitiesSchema = require("../dataSchema/getMyCommunitiesSchema");
require("dotenv").config();

const router = express.Router();

const createCommunity = async (req, res) => {
  console.log("Inside create community post Request");

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
  console.log("Request ", req.body.community);
  const { error, value } = Joi.object()
    .keys({ community: updateCommunitySchema.required() })
    .validate(req.body);

  if (error) {
    res.status(400).send(error.details);
    return;
  }
  kafka.make_request(
    "reddit-community-topic",
    { path: "community-update", body: value },
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
};

export async function getCommunityDetails(req, res) {
  console.log("inside get community details", req.query.communityId);
  let communityId = req.query.communityId;
  if (!communityId) {
    res
      .status(400)
      .send(
        {
          code: 'INVALID_PARAM',
          msg: 'Invalid communityId ID'
        }
      )
      .end();
  }

  kafka.make_request(
    "reddit-community-topic",
    { path: "community-details", communityId },
    (err, results) => kafka_default_response_handler(res, err, results)
  );
}

export async function deleteCommunity(req, res){
  console.log("inside get community details", req.query.communityId);
  let communityId = req.query.communityId;
  if (!communityId) {
    res
      .status(400)
      .send(
        {
          code: 'INVALID_PARAM',
          msg: 'Invalid communityId ID'
        }
      )
      .end();
  }

  kafka.make_request(
    "reddit-community-topic",
    { path: "community-delete", communityId },
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

router.post("/update", updateCommunity);
router.get("/get", getCommunityDetails);
router.get("/mycommunities", checkAuth, getMyCommunities);
router.get("/posts", checkAuth, getAllPosts);
router.delete("/delete", deleteCommunity);
module.exports = router;
