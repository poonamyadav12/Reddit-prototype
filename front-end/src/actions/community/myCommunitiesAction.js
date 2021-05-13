// Created by Priyansh Patel
import axios from 'axios';
import { BACKEND_URL, BACKEND_PORT } from '../../config/config';
import cookie from "react-cookies";
const MY_COMMUNITIES_SUCCESS = "my_communities_success";
const MY_COMMUNITIES_FAILED = "my_communities_failed";
let successMyCommunities = (response, data) => {
    return {
        type: MY_COMMUNITIES_SUCCESS,
        payload: {
            response: response,
            data: data
        }
    }
}
let errorMyCommunities = (err, data) => {
    return {
        type: MY_COMMUNITIES_FAILED,
        payload: {
            response: err,
            data: data
        }
    }
}
let myCommunitiesAction = (data) => (dispatch) => {
    console.log(BACKEND_URL + ":" + BACKEND_PORT + '/community/myCommunities?pageNumber=1&pageSize=3')
    axios.defaults.headers.common["authorization"] = cookie.load("token");
    axios.defaults.withCredentials = true;
    return axios
        // .get(BACKEND_URL + ":" + BACKEND_PORT + '/user/communities?userId=' + cookie.load('userId'))
        .get(BACKEND_URL + ":" + BACKEND_PORT + '/community/myCommunities?pageNumber=1&pageSize=3')
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

export default myCommunitiesAction;