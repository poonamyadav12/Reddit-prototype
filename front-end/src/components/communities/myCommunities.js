//Created by Priyansh Patel

import React, { Component } from 'react';
import Navbar from "../navbar/navbar";
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import './myCommunities.css';
import { connect } from "react-redux";
import { Card, Button, CardTitle, CardText, CardBody } from 'reactstrap';
import myCommunitiesAction from '../../actions/community/myCommunitiesAction';
import CommunityList from './communityList';
import ReactPaginate from "react-paginate";
import myCommunitiesDeleteAction from '../../actions/community/myCommunitiesDeleteAction';

class MyCommunities extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: cookie.load('userId'),
            error: false,
            myCommunitiesData: this.props.myCommunitiesData.data,
            totalPages: "1",
            pageNumber: "1",
            pageSize: "2",
            sortBy: "createdAt",
            sortOrder: "desc",
            communityList: [],
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
                    communityList: this.props.myCommunitiesData.data.docs,
                    totalPages: this.props.myCommunitiesData.data.totalPages,
                })
            }
        })
    }

    editButtonClicked = (community) => {
        console.log("Edit button clicked>>>>>>>>>>>>>>>>>", community)
        window.location.assign('/create-community/' + community._id)
    }
    inviteButtonClicked = (community) => {
        alert("hi")
    }

    removeButtonClicked = (community) => {
        console.log("Remove button clicked>>>>>>>>>>>>>>>>>>>>>", community)
        // Delete Community

        let answer = window.confirm("Are you sure you want to delete this community?");
        if (answer) {
            let reqObj = {
                _id: community._id
            }
            this.props.myCommunitiesDeleteAction(reqObj).then(response => {
                console.log("My communities response >>>>>>>>>>>>>", this.props)
                if (this.props.myCommunitiesError) {
                    this.setState({
                        error: true
                    })
                } else {
                    const newCommunityList = this.state.communityList.filter((filteredCommunity) => {
                        console.log("Remove button community ", community)
                        console.log("Remove button filtered community", filteredCommunity)
                        return community._id != filteredCommunity._id
                    });
                    const emptyCommunitiesFlag = newCommunityList.length == 0 ? true : false;
                    this.setState({
                        communityList: newCommunityList,
                        emptyCommunitiesFlag,
                        totalPages: this.props.myCommunitiesData.data.totalPages,
                    })
                }
            })
        }
    }

    handlePageSizeChange = (e) => {
        e.preventDefault();
        this.setState({
            pageSize: e.target.value,
            pageNumber: "1"
        });
        let pageSize = e.target.value

        let reqobj = {
            userId: cookie.load('userId'),
            pageSize: pageSize,
            pageNumber: "1",
            sortBy: this.state.sortBy,
            sortOrder: this.state.sortOrder,
            myCommunitiesData: this.state.myCommunitiesData,
            communityList: this.state.communityList,
        }

        this.props.myCommunitiesAction(reqobj).then(response => {
            console.log("My communities response >>>>>>>>>>>>>", this.props)
            if (this.props.myCommunitiesError) {
                this.setState({
                    error: true
                })
            } else {
                this.setState({
                    myCommunitiesData: this.props.myCommunitiesData.data,
                    communityList: this.props.myCommunitiesData.data.docs,
                    totalPages: this.props.myCommunitiesData.data.totalPages,
                })
            }
        })
    }

    handlePageClick = (e) => {
        this.setState({
            pageNumber: Number(e.selected) + 1,
        });
        let pageNumber = Number(e.selected) + 1

        let reqobj = {
            userId: cookie.load('userId'),
            pageSize: this.state.pageSize,
            pageNumber: pageNumber,
            sortBy: this.state.sortBy,
            sortOrder: this.state.sortOrder,
            myCommunitiesData: this.state.myCommunitiesData,
            communityList: this.state.communityList,
        }

        this.props.myCommunitiesAction(reqobj).then(response => {
            console.log("My communities response >>>>>>>>>>>>>", this.props)
            if (this.props.myCommunitiesError) {
                this.setState({
                    error: true
                })
            } else {
                this.setState({
                    myCommunitiesData: this.props.myCommunitiesData.data,
                    communityList: this.props.myCommunitiesData.data.docs,
                    totalPages: this.props.myCommunitiesData.data.totalPages,
                })
            }
        })
    }

    handleSortOrder = (e) => {
        this.setState({
            sortOrder: e.target.value
        });
        let sortOrder = e.target.value

        let reqobj = {
            userId: cookie.load('userId'),
            pageSize: this.state.pageSize,
            pageNumber: this.state.pageNumber,
            sortBy: this.state.sortBy,
            sortOrder: sortOrder,
            myCommunitiesData: this.state.myCommunitiesData,
            communityList: this.state.communityList,
        }

        this.props.myCommunitiesAction(reqobj).then(response => {
            console.log("My communities response >>>>>>>>>>>>>", this.props)
            if (this.props.myCommunitiesError) {
                this.setState({
                    error: true
                })
            } else {
                this.setState({
                    myCommunitiesData: this.props.myCommunitiesData.data,
                    communityList: this.props.myCommunitiesData.data.docs,
                    totalPages: this.props.myCommunitiesData.data.totalPages,
                })
            }
        })
    }

    handleSortBy = (e) => {
        this.setState({
            sortBy: e.target.value
        });
        let sortBy = e.target.value

        let reqobj = {
            userId: cookie.load('userId'),
            pageSize: this.state.pageSize,
            pageNumber: this.state.pageNumber,
            sortBy: sortBy,
            sortOrder: this.state.sortOrder,
            myCommunitiesData: this.state.myCommunitiesData,
            communityList: this.state.communityList,
        }

        this.props.myCommunitiesAction(reqobj).then(response => {
            console.log("My communities response >>>>>>>>>>>>>", this.props)
            if (this.props.myCommunitiesError) {
                this.setState({
                    error: true
                })
            } else {
                this.setState({
                    myCommunitiesData: this.props.myCommunitiesData.data,
                    communityList: this.props.myCommunitiesData.data.docs,
                    totalPages: this.props.myCommunitiesData.data.totalPages,
                })
            }
        })
    }

    render() {
        let myCommunities = <div>No communities to show</div>

        if (this.state.communityList) {
            if (this.state.communityList.length !== 0) {
                myCommunities = this.state.communityList.map((community) => {
                    return <CommunityList
                        key={community._id}
                        data={community}
                        editButtonClicked={this.editButtonClicked}
                        removeButtonClicked={this.removeButtonClicked}
                        inviteButtonClicked={this.inviteButtonClicked}

                    />
                })
            }
        }

        return (
            <div>
                { !cookie.load('token') ? window.location.href = '/' : null}
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
                                        <span style={{ paddingLeft: "20px" }}>Page Size</span>
                                    </div>
                                    <div class="input-group mb-3" style={{ paddingLeft: "5px" }}>
                                        <select class="form-select" style={{ fontWeight: "bold", width: "350px" }} aria-label="user select" onChange={this.handlePageSizeChange}>
                                            <option selected value="2">2</option>
                                            <option value="5">5</option>
                                            <option value="10">10</option>
                                        </select>
                                    </div>
                                    <hr />
                                    <div class="row">
                                        <span style={{ paddingLeft: "20px" }}>Sort By</span>
                                    </div>
                                    <div class="input-group mb-3" style={{ paddingLeft: "5px" }}>
                                        <select class="form-select" style={{ fontWeight: "bold", width: "350px" }} aria-label="user select" onChange={this.handleSortBy}>
                                            <option selected value="createdAt">Created Date</option>
                                            <option value="numberOfPosts">Number of Posts</option>
                                            <option value="numberOfUsers">Number of Users</option>
                                        </select>
                                    </div>
                                    <hr />
                                    <div class="row">
                                        <span style={{ paddingLeft: "20px" }}>Order By</span>
                                    </div>
                                    <div class="input-group mb-3" style={{ paddingLeft: "5px" }}>
                                        <select class="form-select" style={{ fontWeight: "bold", width: "350px" }} aria-label="user select" onChange={this.handleSortOrder}>
                                            <option selected value="desc">Descending</option>
                                            <option value="asc">Ascending</option>
                                        </select>
                                    </div>
                                </CardBody>
                            </Card>
                        </div>
                        <div class="col-6" style={{ paddingLeft: "0", paddingRight: "24px", paddingTop: "20px", marginBottom: "5%" }}>
                            {myCommunities}
                            <div className="row">
                                <div className="col pagination-class">
                                    <ReactPaginate
                                        previousLabel={"prev"}
                                        nextLabel={"next"}
                                        breakLabel={"..."}
                                        breakClassName={"break-me"}
                                        pageCount={this.state.totalPages}
                                        // pageCount={1}
                                        marginPagesDisplayed={2}
                                        pageRangeDisplayed={5}
                                        onPageChange={this.handlePageClick}
                                        containerClassName={"pagination"}
                                        subContainerClassName={"pages pagination"}
                                        activeClassName={"active"}
                                    />
                                </div>
                            </div>
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
        myCommunitiesDeleteAction: (data) => dispatch(myCommunitiesDeleteAction(data))
    }
}

export default connect(matchStateToProps, matchDispatchToProps)(MyCommunities)