const express = require("express");
import { isValidObjectId } from "mongoose";
import { uploadS3 } from "../Utils/imageupload";
import { checkAuth } from "../utils/passport";
const jwt = require("jsonwebtoken");
var Joi = require("joi");
var { userschema } = require("../dataSchema/userschema");
const updateInviteSchema = require("../dataSchema/updateInvitationSchema");
const kafka = require("../kafka/client");
var {
  kafka_response_handler,
  kafka_default_response_handler,
} = require("../kafka/handler.js");
require("dotenv").config();
const ObjectId = require("mongoose").Types.ObjectId;
const router = express.Router();

const registerUser = async (req, res) => {
  console.log("Inside register user post Request");
  console.log("Request ", req.body);
  const { error, value } = Joi.object()
    .keys({ user: userschema.required() })
    .validate(req.body);

  if (error) {
    console.log(error);
    res.status(400).send(error.details);
    return;
  }
  kafka.make_request(
    "reddit-user-topic",
    { path: "user_signup", body: value },
    (err, results) =>
      kafka_response_handler(res, err, results, (result) => {
        const user = result.data;
        const payload = { _id: user._id, username: user.email };
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: 1008000,
        });
        return res.status(result.status).send({ user, token });
      })
  );
};

const loginUser = async (req, res) => {
  console.log("Inside login user post Request");
  console.log("Request ", req.body);
  kafka.make_request(
    "reddit-user-topic",
    { path: "user_login", body: req.body },
    (err, results) =>
      kafka_response_handler(res, err, results, (result) => {
        const user = result.data;
        const payload = { _id: user._id, username: user.email };
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: 1008000,
        });
        return res.status(result.status).send({ user, token });
      })
  );
};

const getAllCommunitiesForUser = async (req, res) => {
  console.log("Inside get All communities post Request");
  console.log("Request ", req.body);
  let userId = req.query.userId;
  console.log("user ID X", userId);
  if (!userId) {
    res
      .status(400)
      .send({
        code: "INVALID_PARAM",
        msg: "Invalid User ID",
      })
      .end();
  }
  kafka.make_request(
    "reddit-community-topic",
    { path: "community-all-for-user", userId },
    (err, results) => kafka_default_response_handler(res, err, results)
  );
};
const editUser = async (req, res) => {
  console.log("Inside edit user post Request");
  console.log("Request ", req.body);
  console.log("Image", req.file);
  kafka.make_request(
    "reddit-user-topic",
    { path: "edit_user", body: req.body, file: req.file },
    (err, results) =>
      kafka_response_handler(res, err, results, (result) => {
        const user = result.data;
        return res.status(result.status).send({ user });
      })
  );
};

const getUser = async (req, res) => {
  console.log("Inside get user get Request");
  console.log("Request ", req.query);
  kafka.make_request(
    "reddit-user-topic",
    { path: "get_user", body: req.query },
    (err, results) =>
      kafka_response_handler(res, err, results, (result) => {
        const user = result.data;
        return res.status(result.status).send({ user });
      })
  );
};

export async function getCommunityListCreatedByUser(req, res) {
  console.log("inside get community created by user", req.query.userId);
  let userId = req.query.userId;
  if (!userId) {
    res
      .status(400)
      .send({
        code: "INVALID_PARAM",
        msg: "Invalid userId ID",
      })
      .end();
  }

  kafka.make_request(
    "reddit-community-topic",
    {
      path: "communityList-createdByUser",
      userId,
      options: {
        pageIndex: req.query.pageIndex || 1,
        pageSize: req.query.pageSize || 2,
        sortBy: req.query.sortBy || "createdAt",
        sortOrder: req.query.sortOrder || "desc",
      },
    },
    (err, results) => kafka_default_response_handler(res, err, results)
  );
}

export async function getCommunityAndPosts(req, res) {
  console.log("inside get community and Posts created by user", req.user._id);
  let userId = req.user._id;
  if (!userId) {
    res
      .status(400)
      .send({
        code: "INVALID_PARAM",
        msg: "Invalid userId ID",
      })
      .end();
  }
  kafka.make_request(
    "reddit-user-topic",
    {
      path: "get-community-post-createdByUser",
      userId,
      options: {
        pageIndex: req.query.pageIndex || 1,
        pageSize: req.query.pageSize || 2,
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
const searchAllUsers = async (req, res) => {
  if (req.query.searchKeyword && req.query.searchKeyword.length !== 0) {
    kafka.make_request(
      "reddit-user-topic",
      { path: "search-user", user: req.user, query: req.query },
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
  } else {
    res
      .status(400)
      .send({ errorMessage: ["Please enter a valid search keyword"] });
  }
};

// Route to fetch notifications
const getNotifications = async (req, res) => {
  kafka.make_request(
    "reddit-invitation-topic",
    { path: "get-notifications", user: req.user },
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

const updateInviteStatus = async (req, res) => {
  const result = await updateInviteSchema.validate(req.body);
  if (result.error) {
    res.status(400).send({ errorMessage: [result.error.details[0].message] });
    return;
  }
  kafka.make_request(
    "reddit-invitation-topic",
    { path: "update-invite-status", user: req.user, body: req.body },
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
const getUserProfile = async (req, res) => {
  console.log("Inside get user profile get Request");
  console.log("Request ", req.query);
  kafka.make_request(
    "reddit-user-topic",
    { path: "get_user_profile", body: req.query },
    (err, results) =>
      kafka_response_handler(res, err, results, (result) => {
        const user = result.data;
        return res.status(result.status).send({ user });
      })
  );
};
const getMyCommunityAnalyticsData = async (req, res) => {
  console.log("Inside get my Community Analytics Request");
  console.log("Request ", req.user);
  kafka.make_request(
    "reddit-user-topic",
    { path: "get_user_community-analytics", body: req.user },
    (err, results) => kafka_default_response_handler(res, err, results)
  );
};

// Get Community Status
const getCommunityStatus = async (req, res) => {
  if (!isValidObjectId(req.params.community_id)) {
    res.status(400).send({ errorMessage: ["Select a valid community"] });
    return;
  } else {
    kafka.make_request(
      "reddit-community-topic",
      { path: "get-community-status", user: req.user, params: req.params },
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

router.post("/signup", registerUser);
router.get("/communities", getAllCommunitiesForUser);
router.get("/getAllCommunityCreatedByUser", getCommunityListCreatedByUser);
router.post("/login", loginUser);
router.put("/edit", uploadS3.single("profileImage"), editUser);
router.get("/get", getUser);
router.get("/getCommunityAndPost", checkAuth, getCommunityAndPosts);
router.get("/search", checkAuth, searchAllUsers);
router.get("/notifications", checkAuth, getNotifications);
router.post("/invite/update", checkAuth, updateInviteStatus);
router.get("/getUserProfile", getUserProfile);
router.get("/myCommunityAnalytics", checkAuth, getMyCommunityAnalyticsData);
router.get("/getCommunityStatus/:community_id", checkAuth, getCommunityStatus);

module.exports = router;
