const config = {
  frontendURL: "http://localhost:3000",
  // mongoDB:
  //   "mongodb+srv://poonam2802:py2802@2580@cluster0.illbn.mongodb.net/RedditDb?retryWrites=true&w=majority",
  // //  // mongoDB:
  mongoDB:
  "mongodb+srv://root:root@cluster0.hy57j.mongodb.net/Reddit?retryWrites=true&w=majority",
  //  mongoDB:
  //  "mongodb+srv://root:root@cluster0.hy57j.mongodb.net/Reddit?retryWrites=true&w=majority",
  //  mongoDB:
  //  "mongodb+srv://root:root@cluster0.hy57j.mongodb.net/Reddit?retryWrites=true&w=majority",
  // mongoDB:
  //   "mongodb+srv://shakthivel:Sunshine123@cluster0.uqmlv.mongodb.net/mongodbreddit?retryWrites=true&w=majority",
  // INVITED_TO_JOIN_COMMUNITY: "INVITED", // Inside community schema
  REQUESTED_TO_JOIN_COMMUNITY: "REQUESTED", // Inside community schema
  REJECTED_REQUEST_TO_JOIN_COMMUNITY: "REJECTED", // Inside community schema
  ACCEPTED_REQUEST_TO_JOIN_COMMUNITY: "JOINED", // Inside community schema
  USER_PENDING_INVITE: "PENDING_INVITE",
  USER_ACCEPTED_INVITE: "ACCEPTED_INVITE",
  USER_REJECTED_INVITE: "REJECTED_INVITE",
};

module.exports = config;
