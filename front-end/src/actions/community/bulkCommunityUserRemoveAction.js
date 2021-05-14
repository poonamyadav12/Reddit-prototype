// Created by Priyansh Patel
import axios from "axios";
import { BACKEND_URL, BACKEND_PORT } from "../../config/config";
import cookie from "react-cookies";

const BULK_COMMUNITY_USER_REMOVE_SUCCESS =
  "bulk_community_user_remove_success";
const BULK_COMMUNITY_USER_REMOVE_FAILED =
  "bulk_community_user_remove_failed";

let successBulkCommunityUserRemove = (response, data) => {
  return {
    type: BULK_COMMUNITY_USER_REMOVE_SUCCESS,
    payload: {
      response: response,
      data: data,
    },
  };
};

let errorBulkCommunityUserRemove = (err, data) => {
  return {
    type: BULK_COMMUNITY_USER_REMOVE_FAILED,
    payload: {
      response: err,
      data: data,
    },
  };
};

let bulkCommunityUserRemoveAction = (data) => (dispatch) => {

    console.log("inside action",data)
    
  axios.defaults.headers.common["authorization"] = cookie.load("token");
  axios.defaults.withCredentials = true;
  return axios
    .post(
      BACKEND_URL +
        ":" +
        BACKEND_PORT +
        "/community/delete/user", data
    )
    .then((response) => {
      if (response.status === 200) {
        console.log("api response>>>>>>>>>>", response);
        dispatch(successBulkCommunityUserRemove(response, data));
      }
    })
    .catch((err) => {
      dispatch(errorBulkCommunityUserRemove(err, data));
    });
};

export default bulkCommunityUserRemoveAction;
