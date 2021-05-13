//Created by Priyansh Patel

import React, { Component } from 'react'
import Navbar from '../Navbar/navbar';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import './myCommunities.css';
import { connect } from "react-redux";
import { Card, Button, CardTitle, CardText, CardBody } from 'reactstrap';
import myCommunitiesAction from '../../actions/community/myCommunitiesAction';
import CommunityList from './communityList';

class MyCommunities extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: cookie.load('userId'),
            error: false,
            myCommunitiesData: this.props.myCommunitiesData.data,
            // communityList: this.props.myCommunitiesData.data.communities,
        }
        // this.editButtonClicked = this.editButtonClicked.bind(this);
        // this.removeButtonClicked = this.removeButtonClicked(this);
    }

    componentDidMount() {
        this.props.myCommunitiesAction(this.state).then(response => {
            console.log("My communities response >>>>>>>>>>>>>", this.props)
            if (this.props.myCommunitiesError) {
                this.setState({
                    error: true
                })
            } else {
                this.setState({
                    myCommunitiesData: this.props.myCommunitiesData.data,
                    communityList: this.props.myCommunitiesData.data.communities, 
                })
            }
        })
    }

    editButtonClicked = (community) => {
        console.log("Edit button clicked>>>>>>>>>>>>>>>>>", community)
        // Open create community page
        return (
            <Redirect to={{
                pathname: '/create-community/' + community._id,
                data: community,
            }}
            />
        )
    }

    removeButtonClicked = (community) => {
        console.log("Remove button clicked>>>>>>>>>>>>>>>>>>>>>", community)
        // Delete Community

        const newCommunityList = this.state.communityList.filter((filteredCommunity) => {
            console.log("Remove button community ", community)
            console.log("Remove button filtered community", filteredCommunity)
            return community.communityId != filteredCommunity.communityId
        });
        const emptyCommunitiesFlag = newCommunityList.length == 0 ? true : false;
        this.setState({
            communityList: newCommunityList,
            emptyCommunitiesFlag
        })
    }

    render() {
        let redirectVar = null;
        if (!cookie.load('token')) {
            // redirectVar = <Redirect to="/" />
        };

        let myCommunities = <div>No communities to show</div>
        console.log("myCommunities PROPS data>>>>>>>>>>>>", this.props.myCommunitiesData.data)
        console.log("STATEEEE>>>>>>>>", this.state)
        if (this.state.communityList) {
            if (this.state.communityList.length !== 0) {
                myCommunities = this.state.communityList.map((community) => {
                    return <CommunityList
                        key={community.communityId}
                        data={community}
                        editButtonClicked = {this.editButtonClicked}
                        removeButtonClicked = {this.removeButtonClicked}
                    />
                })
            }
        }

        return (
            <div>
                {redirectVar}
                <div><Navbar /></div>
                <div class="com-header">
                    My Communities
                </div>
                <div class="com-content">
                    <div class="row">
                        <div class="col-2" style={{ marginLeft: "95px", paddingLeft: "20px", paddingRight: "24px", paddingTop: "20px" }}>
                            <Card>
                                <CardBody class="sort-header">
                                    <div class="row">
                                        <span style={{ paddingLeft: "20px" }}>Created</span>
                                    </div>
                                    <div class="input-group mb-3" style={{ paddingLeft: "5px" }}>
                                        <select class="form-select" style={{ fontWeight: "bold", width: "350px" }} aria-label="user select">
                                            <option selected value="1">Most Recent</option>
                                            <option value="2">Oldest</option>
                                        </select>
                                    </div>
                                    <hr />
                                    <div class="row">
                                        <span style={{ paddingLeft: "20px" }}>Number of posts</span>
                                    </div>
                                    <div class="input-group mb-3" style={{ paddingLeft: "5px" }}>
                                        <select class="form-select" style={{ fontWeight: "bold", width: "350px" }} aria-label="user select">
                                            <option selected value="1">Highest</option>
                                            <option value="2">Lowest</option>
                                        </select>
                                    </div>
                                    <hr />
                                    <div class="row">
                                        <span style={{ paddingLeft: "20px" }}>Number of users</span>
                                    </div>
                                    <div class="input-group mb-3" style={{ paddingLeft: "5px" }}>
                                        <select class="form-select" style={{ fontWeight: "bold", width: "350px" }} aria-label="user select" onChange={this.handlePageSizeChange}>
                                            <option selected value="1">Highest</option>
                                            <option value="2">Lowest</option>
                                        </select>
                                    </div>
                                    <hr />

                                </CardBody>
                            </Card>
                        </div>
                        <div class="col-6" style={{ paddingLeft: "0", paddingRight: "24px", paddingTop: "20px" }}>
                            {myCommunities}
                            {/* <Card>
                                <CardBody class="com-card">
                                    <img src="/logo192.png" alt="Avatar" class="com-avatar" /> <span class="com-name">r/CrytoCurrency</span>
                                    <button type="button" style={{ borderColor: "#0079d3", color: "rgb(0, 121, 211)", borderRadius: "60px", marginLeft: "1%", float: "right"}} class="btn btn-outline-primary"><span style={{ fontSize: "16px", fontWeight: "300px" }}><strong>Remove</strong></span></button>
                                    <button type="button" style={{ borderColor: "#0079d3", color: "white", borderRadius: "60px", marginLeft: "10%", float: "right"}} class="btn btn-primary"><span style={{ fontSize: "16px", fontWeight: "300px" }}><strong>Edit</strong></span></button>
                                    <br/>
                                    <span className="com-desc">Description. Trying to make it long. Even more long. Like really very long.</span>
                                    <br/>
                                    <span className="com-details"><i class="fas fa-users"></i> 100</span>
                                    <span className="com-details"><i class="fas fa-copy"></i> 200</span>
                                </CardBody>
                            </Card>
                            <Card>
                                <CardBody class="com-card">
                                    <img src="/logo192.png" alt="Avatar" class="com-avatar" /> <span class="com-name">r/coolGuides</span>
                                    <button type="button" style={{ borderColor: "#0079d3", color: "rgb(0, 121, 211)", borderRadius: "60px", marginLeft: "1%", float: "right"}} class="btn btn-outline-primary"><span style={{ fontSize: "16px", fontWeight: "300px" }}><strong>Remove</strong></span></button>
                                    <button type="button" style={{ borderColor: "#0079d3", color: "white", borderRadius: "60px", marginLeft: "10%", float: "right"}} class="btn btn-primary"><span style={{ fontSize: "16px", fontWeight: "300px" }}><strong>Edit</strong></span></button>
                                    <br/>
                                    <span className="com-desc">Description. Trying to make it long. Even more long. Like really very long.</span>
                                    <br/>
                                    <span className="com-details"><i class="fas fa-users"></i> 100</span>
                                    <span className="com-details"><i class="fas fa-copy"></i> 200</span>
                                </CardBody>
                            </Card>
                            <Card>
                                <CardBody class="com-card">
                                    <img src="/logo192.png" alt="Avatar" class="com-avatar" /> <span class="com-name">r/Cars</span>
                                    <button type="button" style={{ borderColor: "#0079d3", color: "rgb(0, 121, 211)", borderRadius: "60px", marginLeft: "1%", float: "right"}} class="btn btn-outline-primary"><span style={{ fontSize: "16px", fontWeight: "300px" }}><strong>Remove</strong></span></button>
                                    <button type="button" style={{ borderColor: "#0079d3", color: "white", borderRadius: "60px", marginLeft: "10%", float: "right"}} class="btn btn-primary"><span style={{ fontSize: "16px", fontWeight: "300px" }}><strong>Edit</strong></span></button>
                                    <br/>
                                    <span className="com-desc">Description. Trying to make it long. Even more long. Like really very long.</span>
                                    <br/>
                                    <span className="com-details"><i class="fas fa-users"></i> 100</span>
                                    <span className="com-details"><i class="fas fa-copy"></i> 200</span>
                                </CardBody>
                            </Card>
                            <Card>
                                <CardBody class="com-card">
                                    <img src="/logo192.png" alt="Avatar" class="com-avatar" /> <span class="com-name">r/gadgets</span>
                                    <button type="button" style={{ borderColor: "#0079d3", color: "rgb(0, 121, 211)", borderRadius: "60px", marginLeft: "1%", float: "right"}} class="btn btn-outline-primary"><span style={{ fontSize: "16px", fontWeight: "300px" }}><strong>Remove</strong></span></button>
                                    <button type="button" style={{ borderColor: "#0079d3", color: "white", borderRadius: "60px", marginLeft: "10%", float: "right"}} class="btn btn-primary"><span style={{ fontSize: "16px", fontWeight: "300px" }}><strong>Edit</strong></span></button>
                                    <br/>
                                    <span className="com-desc">Description. Trying to make it long. Even more long. Like really very long.</span>
                                    <br/>
                                    <span className="com-details"><i class="fas fa-users"></i> 100</span>
                                    <span className="com-details"><i class="fas fa-copy"></i> 200</span>
                                </CardBody>
                            </Card>
                            <Card>
                                <CardBody class="com-card">
                                    <img src="/logo192.png" alt="Avatar" class="com-avatar" /> <span class="com-name">r/formula1</span>
                                    <button type="button" style={{ borderColor: "#0079d3", color: "rgb(0, 121, 211)", borderRadius: "60px", marginLeft: "1%", float: "right"}} class="btn btn-outline-primary"><span style={{ fontSize: "16px", fontWeight: "300px" }}><strong>Remove</strong></span></button>
                                    <button type="button" style={{ borderColor: "#0079d3", color: "white", borderRadius: "60px", marginLeft: "10%", float: "right"}} class="btn btn-primary"><span style={{ fontSize: "16px", fontWeight: "300px" }}><strong>Edit</strong></span></button>
                                    <br/>
                                    <span className="com-desc">Description. Trying to make it long. Even more long. Like really very long.</span>
                                    <br/>
                                    <span className="com-details"><i class="fas fa-users"></i> 100</span>
                                    <span className="com-details"><i class="fas fa-copy"></i> 200</span>
                                </CardBody>
                            </Card> */}
                        </div>
                        <div class="col-2" style={{ paddingLeft: "0", paddingTop: "20px", marginRight: "65px" }}>

                        </div>
                    </div>
                </div>
            </div>
        )
    }

}

const matchStateToProps = (state) => {
    console.log("inside matchStatetoProps", state)
    return {
        myCommunitiesError: state.myCommunitiesReducer.error,
        myCommunitiesMessage: state.myCommunitiesReducer.message,
        myCommunitiesData: state.myCommunitiesReducer.communityData,
    }

}

const matchDispatchToProps = (dispatch) => {
    return {
        myCommunitiesAction: (data) => dispatch(myCommunitiesAction(data)),

    }
}

export default connect(matchStateToProps, matchDispatchToProps)(MyCommunities)