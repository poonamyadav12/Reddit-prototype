import axios from 'axios';
import { BACKEND_URL, BACKEND_PORT } from '../config/config'
import cookie from "react-cookies";
const SIGNUP_SUCCESS = "signup_success";
const SIGNUP_FAILED = "signup_failed";

var successUser = (response, data) => {
    return {
        type: SIGNUP_SUCCESS,
        payload: {
            response: response,
            data: data
        }
    }
}

var errorUser = (err, data) => {
    return {
        type: SIGNUP_FAILED,
        payload: {
            response: err,
            data: data
        }
    }
}


var SignUpAction = (data) => (dispatch) => {
    console.log("data >>>>>>>>>>>>", data)
    console.log(BACKEND_URL + ":" + BACKEND_PORT + '/user/signup', data)
    return axios
        .post(BACKEND_URL + ":" + BACKEND_PORT + '/user/signup', data)
        .then((response) => {
            console.log("response >>>>>>>>>>>>", response)
            cookie.save("token", "Bearer " + response.data.token, {
                path: '/',
                httpOnly: false,
                maxAge: 90000
            })
            cookie.save("auth", true, {
                path: '/',
                httpOnly: false,
                maxAge: 90000
            })
            cookie.save("userName", data.user.name, {
                path: '/',
                httpOnly: false,
                maxAge: 90000
            })
            cookie.save("userId", response.data.user._id, {
                path: '/',
                httpOnly: false,
                maxAge: 90000
            })
            cookie.save("name", response.data.user.name, {
                path: '/',
                httpOnly: false,
                maxAge: 90000
            })
            cookie.save("email", response.data.user.email, {
                path: '/',
                httpOnly: false,
                maxAge: 90000
            })
            dispatch(successUser(response, data))
        }).catch((err) => {
            dispatch(errorUser(err, data))
        });
}

export default SignUpAction