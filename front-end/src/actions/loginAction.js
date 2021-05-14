import axios from 'axios';
import { BACKEND_URL, BACKEND_PORT } from '../config/config'

import cookie from "react-cookies";
import jwt_decode from "jwt-decode"
const LOGIN_SUCCESS = "login_success";
const LOGIN_FAILED = "login_failed";

var successUser = (response, data) => {
    return {
        type: LOGIN_SUCCESS,
        payload: {
            response: response,
            data: data
        }
    }
}

var errorUser = (err, data) => {
    return {
        type: LOGIN_FAILED,
        payload: {
            response: err,
            data: data
        }
    }
}
var loginAction = (data) => (dispatch) => {
    console.log(data)
    return axios
        .post(BACKEND_URL + ":" + BACKEND_PORT + '/user/login', data)
        .then((response) => {
            console.log("response>>>>>>>>>>>", response)
            // let decoded = jwt_decode(response.data.token.split(' ')[1])
            let decoded = jwt_decode(response.data.token)
            console.log("decoded>>>>>>>>>>>>>>>>>>>", decoded)
            if (response.status === 200) {
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
                cookie.save("userName", response.data.user.name, {
                    path: '/',
                    httpOnly: false,
                    maxAge: 90000
                })
                cookie.save("handle", decoded.handle, {
                    path: '/',
                    httpOnly: false,
                    maxAge: 90000
                })
                cookie.save("email", response.data.user.email, {
                    path: '/',
                    httpOnly: false,
                    maxAge: 90000
                })
                cookie.save("userId", response.data.user._id, {
                    path: '/',
                    httpOnly: false,
                    maxAge: 90000
                })
                dispatch(successUser(response, data));
            }
        })
        .catch((err) => {
            dispatch(errorUser(err, data))
        });
}

export default loginAction