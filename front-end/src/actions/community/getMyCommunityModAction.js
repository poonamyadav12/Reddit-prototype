// Created by Priyansh Patel
import axios from "axios";
import { BACKEND_URL, BACKEND_PORT } from "../../config/config";
import cookie from "react-cookies";

const GET_MY_COMMUNITY_MOD_SUCCESS = "get_my_community_mod_success";
const GET_MY_COMMUNITY_MOD_FAILED = "get_my_community_mod_failed";

let successGetMyCommunityMod = (response, data) => {
  return {
    type: GET_MY_COMMUNITY_MOD_SUCCESS,
    payload: {
      response: response,
      data: data,
    },
  };
};

let errorGetMyCommunityMod = (err, data) => {
  return {
    type: GET_MY_COMMUNITY_MOD_FAILED,
    payload: {
      response: err,
      data: data,
    },
  };
};

let getMyCommunityMod = (data) => (dispatch) => {
  axios.defaults.headers.common["authorization"] = cookie.load("token");
  axios.defaults.withCredentials = true;

  let API_URL =
    BACKEND_URL +
    ":" +
    BACKEND_PORT +
    "/community/myCommunities?pageNumber=" +
    data.pageNumber +
    "&pageSize=" +
    data.pageSize;

  if (data.searchKeyword != null || data.searchKeyword != undefined) {
    if (data.searchKeyword.trim().length > 0) {
      API_URL =
        BACKEND_URL +
        ":" +
        BACKEND_PORT +
        "/community/myCommunities?pageNumber=" +
        data.pageNumber +
        "&pageSize=" +
        data.pageSize +
        "&searchKeyword=" +
        data.searchKeyword;
    }
  }
  return axios
    .get(API_URL)
    .then((response) => {
      if (response.status === 200) {
        console.log("api response>>>>>>>>>>", response);
        dispatch(successGetMyCommunityMod(response, data));
      }
    })
    .catch((err) => {
      dispatch(errorGetMyCommunityMod(err, data));
    });
};

export default getMyCommunityMod;
