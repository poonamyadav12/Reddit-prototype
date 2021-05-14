import {
  createCommunity,
  updateExistingCommunity,
  getAllCommunityForUser,
  getCommunityDetails,
  getAllPosts,
  getAllCreatedCommunitiesByUserId,
  getCommunityListCreatedByUser,
  deleteCommunity,
  requestToJoinCommunity,
  communityUpVote,
  communityDownVote,
  communitySearch,
  getMyCommunitiesOfAUser,
  getCommunityStatus,
} from "../../apis/community_api";
const { communityAnalytics } = require("../../apis/community_analytics_api");

export const handle_request = async (message, callback) => {
  console.log("Handle Request for Community ", message);
  switch (message.path) {
    case "community-create":
      return createCommunity(message, callback);
    case "community-update":
      return updateExistingCommunity(message, callback);
    case "community-all-for-user":
      return getAllCommunityForUser(message, callback);
    case "community-details":
      return getCommunityDetails(message, callback);
    case "communityList-createdByUser":
      return getCommunityListCreatedByUser(message, callback);
    case "get-posts":
      return getAllPosts(message, callback);
    case "get-created-communities":
      return getAllCreatedCommunitiesByUserId(message, callback);
    case "community-delete":
      return deleteCommunity(message, callback);
    case "join-community":
      return requestToJoinCommunity(message, callback);
    case "community-upvote":
      return communityUpVote(message, callback);
    case "community-downvote":
      return communityDownVote(message, callback);
    case "community-search":
      return communitySearch(message, callback);
      return getAllCreatedCommunities(message, callback);
    case "community_analytics":
      return communityAnalytics(message, callback);
    case "get-mycommunities-of-user":
      return getMyCommunitiesOfAUser(message, callback);
    case "get-community-status":
      return getCommunityStatus(message, callback);
    default:
      return callback({ status: 500, data: "no path found" }, null);
  }
};
