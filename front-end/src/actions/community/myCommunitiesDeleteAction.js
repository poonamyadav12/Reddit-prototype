// Created by Priyansh Patel
import axios from 'axios';
import { BACKEND_URL, BACKEND_PORT } from '../../config/config';
import cookie from "react-cookies";
const MY_COMMUNITIES_DELETE_SUCCESS = "my_communities_delete_success";
const MY_COMMUNITIES_DELETE_FAILED = "my_communities_delete_failed";
let successMyCommunities = (response, data) => {
    return {
        type: MY_COMMUNITIES_DELETE_SUCCESS,
        payload: {
            response: response,
            data: data
        }
    }
}
let errorMyCommunities = (err, data) => {
    return {
        type: MY_COMMUNITIES_DELETE_FAILED,
        payload: {
            response: err,
            data: data
        }
    }
}
let myCommunitiesDeleteAction = (data) => (dispatch) => {
    axios.defaults.headers.common["authorization"] = cookie.load("token");
    axios.defaults.withCredentials = true;
    return axios
        .delete(BACKEND_URL + ":" + BACKEND_PORT + '/community/delete?communityId='+data._id)
        .then((response) => {
            if (response.status === 200) {
                console.log("api response>>>>>>>>>>", response)
                dispatch(successMyCommunities(response, data));
            }
        })
        .catch((err) => {
            dispatch(errorMyCommunities(err, data))
        });
}

export default myCommunitiesDeleteAction;