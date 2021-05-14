// Created by Priyansh Patel
import axios from "axios";
import { BACKEND_URL, BACKEND_PORT } from "../../config/config";
import cookie from "react-cookies";

const GET_MY_COMMUNITY_MOD_SUCCESS = "get_community_mod_community_success";
const GET_MY_COMMUNITY_MOD_FAILED = "get_community_mod_community_failed";

let successGetMyCommunityModCommunity = (response, data) => {
  return {
    type: GET_MY_COMMUNITY_MOD_SUCCESS,
    payload: {
      response: response,
      data: data,
    },
  };
};

let errorGetMyCommunityModCommunity = (err, data) => {
  return {
    type: GET_MY_COMMUNITY_MOD_FAILED,
    payload: {
      response: err,
      data: data,
    },
  };
};

let getMyCommunityModCommunity = (data) => (dispatch) => {
  console.log("INSIDEEE communityModCommunityAction", data)
  axios.defaults.headers.common["authorization"] = cookie.load("token");
  axios.defaults.withCredentials = true;
  let API_URL =
    BACKEND_URL +
    ":" +
    BACKEND_PORT +
    "/community/mycommunities/user/communities?pageNumber=" +
    data.communityModPageNumber +
    "&pageSize=" +
    data.communityModPageSize +
    "&user_id=" + cookie.load("userId")
  

  console.log("API____URL", API_URL)

  if (data.communityModSearchKeyword != null || data.communityModSearchKeyword != undefined) {
    if (data.communityModSearchKeyword.trim().length > 0) {
    API_URL =
    BACKEND_URL +
    ":" +
    BACKEND_PORT +
    "/community/mycommunities/user/communities?pageNumber=" +
    data.communityModPageNumber +
    "&pageSize=" +
    data.communityModPageSize +
    "&user_id=" + cookie.load("userId") +
    "&searchKeyword=" + data.communityModSearchKeyword
    }
  }

  // if (
  //   data.communityModSearchKeyword != null ||
  //   data.communityModSearchKeyword != undefined ||
  //   data.communityModSearchKeyword != ""
  // ) {
  //   API_URL =
  //   BACKEND_URL +
  //   ":" +
  //   BACKEND_PORT +
  //   "/community/mycommunities?pageNumber=" +
  //   data.communityModPageNumber +
  //   "&pageSize=" +
  //   data.communityModPageSize +
  //   "&user_id=" +
  //   cookie.load("userId") +
  //   "&searchKeyword=" +
  //   data.communityModSearchKeyword;
  // } 
  // else {
  //   API_URL =
  //     BACKEND_URL +
  //     ":" +
  //     BACKEND_PORT +
  //     "/community/mycommunities?pageNumber=" +
  //     data.pageNumber +
  //     "&pageSize=" +
  //     data.pageSize +
  //     "&user_id=" +
  //     data.user_id;
  // }
  return axios
    .get(API_URL)
    .then((response) => {
      if (response.status === 200) {
        console.log("api response>>>>>>>>>>", response);
        dispatch(successGetMyCommunityModCommunity(response, data));
      }
    })
    .catch((err) => {
      dispatch(errorGetMyCommunityModCommunity(err, data));
    });
};

export default getMyCommunityModCommunity;
