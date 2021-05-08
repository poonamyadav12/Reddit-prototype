import {
  registerUser,
  loginUser,
  editUser,
  getUserByObjId,
  getUsersOfMyCommunity,
  getCommunityAndPosts
  bulkApproveRequests,
  searchAllUsers,
} from "../../apis/user_api";

export const handle_request = async (message, callback) => {
  console.log("Handle Request for user ", message);
  switch (message.path) {
    case "user_signup":
      return registerUser(message, callback);
    case "user_login":
      return loginUser(message, callback);
    case "edit_user":
      return editUser(message, callback);
    case "get_user":
      return getUserByObjId(message, callback);
    case "get-mycommunity-users":
      return getUsersOfMyCommunity(message, callback);
    case "get-community-post-createdByUser":
      return getCommunityAndPosts(message, callback);
    case "bulk-approve-request":
      return bulkApproveRequests(message, callback);
    case "search-user":
      return searchAllUsers(message, callback);
    default:
      return callback({ status: 500, data: "no path found" }, null);
  }
};
