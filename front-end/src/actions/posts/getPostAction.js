import axios from 'axios';
import { BACKEND_URL } from '../../config/config';
import { BACKEND_PORT } from '../../config/config';
import cookie from "react-cookies";


const POST_GET_SUCCESS = "post_get_success";
const POST_GET_FAIL = "post_get_fail";
var success = (response) => {
    return {
        type: POST_GET_SUCCESS,
        payload: {
            response: response,
        }
    }
}

var error = (err) => {
    console.log("err", err)
    return {
        type: POST_GET_FAIL,
        payload: {
            response: err
        }
    }
}
var getPostsByIDAction = (data) => (dispatch) => {
    axios.defaults.headers.common["authorization"] = cookie.load('token')
    axios.defaults.withCredentials = true;
    return axios
        .get(BACKEND_URL + ":" + BACKEND_PORT + "/community/posts?orderByDate=" + data.sorting + "&orderByPopularity=" + data.popularity + "&pageNumber=" + data.pageNumber + "&pageSize=" + data.pageSize + "&community_id=" + data.communityID).then(response => {
            if (response.status === 200) {
                console.log(response.data)
                dispatch(success(response, data));

            }
        }).catch((err) => {
            dispatch(error(err, data))
        });
}

export default getPostsByIDAction