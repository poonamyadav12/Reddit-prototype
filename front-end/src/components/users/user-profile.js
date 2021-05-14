import React, { Component } from 'react'
import { Redirect } from 'react-router'
import { Link } from 'react-router-dom'
import Navbar from "../navbar/navbar";
import userProfileAction from '../../actions/userProfileAction';
import { connect } from "react-redux";
import {
    Card, CardText, CardBody,
} from 'reactstrap';
import { Accordion } from "react-bootstrap";
import cookie from "react-cookies";

import { Row, Col, CardTitle } from 'reactstrap';
//TODO : Add all the other use Data in the profile
export class UserProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: "",
            userCommunities: []
            // post_id: this.props.data._id,
        }
    };
    componentDidMount() {
        if (cookie.load('token')) {
            this.props.userProfileAction(this.props.location.state.userData._id).then(response => {
                console.log(this.props.userProfileData.user.user)
                this.setState(
                    {
                        user: this.props.userProfileData.user.user,
                        userCommunities: this.props.userProfileData.user.userCommunities,

                    }
                )
            })
        }

    }
    render() {

        console.log(this.state)
        let communityAccordion = this.state.userCommunities.map((community, index) => {
            return (
                <div>
                    <Card style={{ marginTop: "15px", width: "447px", border: "1px" }}>
                        <CardBody style={{ border: "1px", overflow: "scroll" }}>
                            {index + 1}.
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

                                <img src={community.communityCover} width="20" height="20" alt="" />
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

                                <strong style={{ fontWeight: "700" }}>{community.communityName}</strong>
                        </CardBody>
                    </Card>
                </div>
            );
        })
        return (
            <div>
                { !cookie.load('token') ? window.location.href = '/' : null}
                <div>
                    <Navbar />
                </div>
                <div class="container">
                    <div className="row" style={{ paddingTop: "7%" }} >
                        <h6 style={{ color: "black" }}>
                            {this.state.user.name}'s Profile Page
                        </h6>

                    </div>
                    <div className="row" >
                        <div className="col-12" >
                            <hr />

                        </div>
                    </div>

                    <div className="row">
                        <div className="col-2">
                            {/* <img src={this.state.image} width="200" height="200" alt="" /> */}
                            {this.state.profilePicture != null ?
                                this.state.profilePicture != "" ?
                                    <img src={this.state.profilePicture} width="200" height="200" alt="" />
                                    : <img src={this.state.image} width="200" height="200" alt="" />
                                : <img src={this.state.user.avatar} width="200" height="200" alt="" />}

                            <div className="row"><p style={{ "margin-left": '20px' }}>{this.state.user.name}'s  Avatar</p></div>
                        </div>
                        <div className="col-8" style={{ marginLeft: "15%" }}>
                            <div className="row" >
                                <div className="col-4">
                                    <h6 style={{ color: "black", marginLeft: "1%" }}>
                                        Name
                                    </h6>

                                </div>
                                <div className="col-4">

                                    <h6 style={{ color: "black", marginLeft: "1%" }}>
                                        Location Preferences
                                    </h6>
                                </div>
                            </div>
                            <div className="row" >
                                <div className="col-4">
                                    <input type="text" style={{ width: "100%" }} name="name" placeholder="DISPLAY NAME" value={this.state.user.name} required />

                                </div>
                                <div className="col-4">
                                    <input type="text" style={{ width: "100%" }} name="password" placeholder="LOCATION" value={this.state.user.location == " " ? "----------------------" : this.state.user.location} />

                                </div>
                            </div>
                            <div className="row" style={{ marginTop: "10%" }} >
                                <div className="col-4">
                                    <h6 style={{ color: "black", marginLeft: "1%" }}>
                                        Gender
                                    </h6>

                                </div>
                                <div className="col-4">

                                    <h6 style={{ color: "black", marginLeft: "1%" }}>
                                        Description
                                    </h6>
                                </div>
                            </div>
                            <div className="row" >
                                <div className="col-4">
                                    <input type="text" style={{ width: "100%" }} name="name" value={this.state.user.gender == " " ? "----------------------" : this.state.user.gender} />

                                </div>
                                <div className="col-4">
                                    <input type="text" style={{ width: "100%" }} name="password" placeholder="DESCRIPTION" value={this.state.user.description == " " ? "----------------------" : this.state.user.description} />

                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="container">
                        <Row style={{ paddingTop: "1%", marginLeft: "32%" }}>
                            <Card >
                                <CardBody>
                                    <div className="row" style={{ marginLeft: "-3%", backgroundColor: "#0079d3", height: "40px" }}>
                                        <div style={{ fontSize: "16px", padding: "10px", fontFamily: "arial", color: "#1A1A1B", fontWeight: "700", color: "white" }}>Communities </div>
                                    </div>
                                    <br></br>
                                    <br></br>
                                    <CardText style={{ fontSize: "14px", fontFamily: "sans-serif", color: "#1C1C1C" }}></CardText>
                                    {communityAccordion}
                                </CardBody>
                            </Card>
                        </Row>
                    </div>
                    <br></br>
                    <br></br>
                    <br></br>
                </div>
            </div>




        )
    }
}

const matchStateToProps = (state) => {
    return {
        userProfileData: state.userProfileGetReducer.profileGetData,

    }

}
const matchDispatchToProps = (dispatch) => {
    return {
        userProfileAction: (data) => dispatch(userProfileAction(data))

    }
}

export default connect(matchStateToProps, matchDispatchToProps)(UserProfile)