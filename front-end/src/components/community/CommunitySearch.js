//Author : Het Brahmbhatt
//TODO:- CHECK THE filters properly
import React, { Component } from 'react'
import { Redirect } from 'react-router'
import { Link } from 'react-router-dom'
import Navbar from "../navbar/navbar";
import { Row, Col } from 'reactstrap';
import axios from 'axios';
import { BACKEND_URL } from '../../config/config';
import { BACKEND_PORT } from '../../config/config';
import {
    Card, CardText, CardBody,
} from 'reactstrap';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ReactPaginate from 'react-paginate';
import { InputGroup, InputGroupAddon, InputGroupText, Input } from 'reactstrap';
import moment from 'moment'
import getAllCommunityAction from '../../actions/community/getAllCommunityAction';
import { connect } from "react-redux";
import cookie from "react-cookies";
import upVoteCommunityAction from '../../actions/community/upVoteCommunityAction';
import downVoteCommunityAction from '../../actions/community/downVoteCommunityAction';

export class CommunitySearch extends Component {
    constructor(props) {
        super(props)
        console.log(this.props)
        this.state = {
            communities: [],
            searchInput: "",
            hasNextPage: false,
            hasPrevPage: true,
            nextPage: "",
            pageNumber: 1,
            pageSize: 2,
            totalPages: "",
            sorting: "desc",
            select: "",
            votes: 0
        }
    }
    handlePageClick = (e) => {

        this.setState(
            {
                pageNumber: Number(e.selected) + 1
            }
        )
        let obj = {
            sorting: this.state.sorting,
            searchInput: this.state.searchInput,
            pageNumber: Number(e.selected) + 1,
            pageSize: this.state.pageSize,
            select: this.state.select,

        }
        this.props.getAllCommunityAction(obj).then(response => {
            this.setState(
                {
                    communities: this.props.getAllCommunityData.docs,
                    totalPages: this.props.getAllCommunityData.totalPages
                }
            )
        })
    };
    handlePaginationDropdown = (e) => {
        e.preventDefault()
        this.setState(
            {
                pageSize: e.target.value
            }
        )
        let obj = {
            searchInput: this.state.searchInput,
            sorting: this.state.sorting,
            pageNumber: this.state.pageNumber,
            pageSize: e.target.value,
            select: this.state.select,
        }
        this.props.getAllCommunityAction(obj).then(response => {
            this.setState(
                {
                    communities: this.props.getAllCommunityData.docs,
                    totalPages: this.props.getAllCommunityData.totalPages
                }
            )
        })
    }
    handleSelectChange = (e) => {
        e.preventDefault()
        this.setState(
            {
                select: e.target.value
            }
        )
        let obj = {
            select: e.target.value,
            searchInput: this.state.searchInput,
            sorting: this.state.sorting,
            pageNumber: this.state.pageNumber,
            pageSize: this.state.pageSize
        }
        this.props.getAllCommunityAction(obj).then(response => {
            this.setState(
                {
                    communities: this.props.getAllCommunityData.docs,
                    totalPages: this.props.getAllCommunityData.totalPages
                }
            )
        })

    }
    handleSortChange = (e) => {

        e.preventDefault()

        this.setState(
            {
                sorting: e.target.value
            }
        )
        let obj = {
            sorting: e.target.value,
            searchInput: this.state.searchInput,
            pageNumber: this.state.pageNumber,
            pageSize: this.state.pageSize,
            select: this.state.select
        }
        this.props.getAllCommunityAction(obj).then(response => {
            this.setState(
                {
                    communities: this.props.getAllCommunityData.docs,
                    totalPages: this.props.getAllCommunityData.totalPages,

                }
            )
        })
    }
    handleSearchChange = (e) => {

        this.setState(
            {
                searchInput: e.target.value
            }
        )

        let obj = {
            sorting: this.state.sorting,
            searchInput: e.target.value,
            pageNumber: this.state.pageNumber,
            pageSize: this.state.pageSize,
            select: this.state.select
        }
        this.props.getAllCommunityAction(obj).then(response => {
            this.setState(
                {
                    communities: this.props.getAllCommunityData.docs,
                    totalPages: this.props.getAllCommunityData.totalPages
                }
            )
        })
    }
    upVote = (community_id) => {

        this.props.upVoteCommunityAction(community_id).then(response => {
            this.props.getAllCommunityAction(this.state).then(response => {
                this.setState(
                    {
                        communities: this.props.getAllCommunityData.docs,
                        totalPages: this.props.getAllCommunityData.totalPages
                    }
                )
            })
        })
    }
    downVote = (community_id) => {

        this.props.downVoteCommunityAction(community_id).then(response => {
            this.props.getAllCommunityAction(this.state).then(response => {
                this.setState(
                    {
                        communities: this.props.getAllCommunityData.docs,
                        totalPages: this.props.getAllCommunityData.totalPages
                    }
                )
            })
        })
    }
    componentDidMount() {
        this.props.getAllCommunityAction(this.state).then(response => {
            console.log(this.props)
            this.setState(
                {
                    communities: this.props.getAllCommunityData.docs,
                    totalPages: this.props.getAllCommunityData.totalPages,

                }
            )
        })
    }
    render() {
        console.log(this.state)
        let communityComponent = this.state.communities.map((docs, index) => (
            <div key={index} >


                <Card style={{ width: "102%", height: "15vh", marginTop: "5%" }}>
                    <CardBody class="com-card" style={{ padding: "0" }}>

                        <Row>
                            <Col xs="1" style={{ backgroundColor: "whitesmoke", height: "15vh" }}>
                                <ArrowUpwardIcon style={{ cursor: "pointer" }} onClick={() => this.upVote(docs._id)} />
                                <span style={{ paddingLeft: "6px" }}>
                                    {docs.numberOfVotes}
                                </span>
                                <ArrowDownwardIcon style={{ cursor: "pointer" }} onClick={() => this.downVote(docs._id)} />
                            </Col>
                            <Col xs="2" style={{ paddingTop: "40px" }}>
                                <img src={docs.communityAvatar[0]} height="100px" width="100px" alt="Avatar" class="com-avatar" />

                            </Col>
                            <Col xs="5" >
                                <div style={{ marginTop: "15px", font: "14px grey", fontFamily: "IBMPlexSans" }}>
                                    <Row>
                                        <span ><h4> {docs.communityName}</h4></span>

                                    </Row>
                                    <Row>
                                        <h1></h1>
                                    </Row>
                                    <Row>
                                        Created By r/{docs.creator.length == 0 ? "" : docs.creator[0].name}
                                    </Row>

                                    <Row>
                                        Created At {moment.utc(docs.createdAt).format('MMMM Do YYYY')}

                                    </Row>
                                    <Row>
                                        <h1></h1>
                                        <i class="fa fa-clipboard" aria-hidden="true"></i>
                                        &nbsp;
                                        {docs.numberOfPosts}
                                    </Row>

                                </div>
                            </Col>
                            <Col style={{ marginTop: "5%", marginRight: "10%" }}>
                                <Link className="btn btn-primary" style={{ color: "#0079d3", color: "white", borderRadius: "60px", }} to={{
                                    pathname: "/community-home-page", state: {
                                        communityData: docs
                                    }
                                }}>VISIT</Link>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>

            </div>
        ))
        return (
            <div>
                { !cookie.load('token') ? window.location.href = '/' : null}
                <div>
                    <Navbar />
                </div>
                <Row style={{ height: "100%", backgroundColor: "#DAE0E6" }}>
                    <Col xs="1" style={{ marginLeft: "-6%" }}>
                    </Col>
                    <Col xs="3">
                        <Card style={{ marginTop: "22%", marginLeft: "15%", marginLeft: "1%", width: "80%" }}>
                            <CardBody class="sort-header">
                                <div class="row">
                                    <span style={{ paddingLeft: "20px" }}>Select Sorting</span>
                                </div>
                                <div class="input-group mb-3" style={{ paddingLeft: "5px" }}>
                                    <select class="form-select" style={{ fontWeight: "bold", width: "350px" }} aria-label="user select" onChange={this.handleSelectChange}>
                                        <option hidden disabled selected value> -- select an option -- </option>
                                        <option value="numberOfUsers">Most Users</option>
                                    </select>
                                </div>
                                <hr />
                                <div class="row">
                                    <span style={{ paddingLeft: "20px" }}>Created at</span>
                                </div>
                                <div class="input-group mb-3" style={{ paddingLeft: "5px" }}>
                                    <select class="form-select" style={{ fontWeight: "bold", width: "350px" }} aria-label="user select" onChange={this.handleSortChange}>
                                        <option selected value="desc">Most recent</option>
                                        <option value="asc">Least recent</option>
                                    </select>
                                </div>
                                <hr />
                                <div class="row">
                                    <span style={{ paddingLeft: "20px" }}>Pagination Size</span>
                                </div>
                                <div class="input-group mb-3" style={{ paddingLeft: "5px" }}>
                                    <select class="form-select" style={{ fontWeight: "bold", width: "350px" }} aria-label="user select" onChange={this.handlePaginationDropdown}>
                                        <option selected value="2">2</option>
                                        <option value="5">5</option>
                                        <option value="10">10</option>
                                    </select>
                                </div>
                                <hr />
                            </CardBody>
                        </Card>
                    </Col>
                    <Col xs="5" style={{ marginTop: "5%" }}>

                        <Row style={{ width: "105%" }}>
                            <InputGroup >
                                <InputGroupAddon addonType="prepend">
                                    <InputGroupText style={{ width: "49px" }}>
                                        <i class="fas fa-search" aria-hidden="true" style={{ color: '#0079d3', fontSize: 18 }}>
                                        </i>
                                    </InputGroupText>
                                </InputGroupAddon>
                                <Input Style={{ backgroundColor: 'white', color: 'Black' }} onChange={this.handleSearchChange} placeholder="Search">
                                </Input>
                            </InputGroup>
                        </Row>

                        {communityComponent}

                    </Col>
                    <Col className="pagination-class">
                        <ReactPaginate
                            previousLabel={"prev"}
                            nextLabel={"next"}
                            breakLabel={"..."}
                            breakClassName={"break-me"}
                            pageCount={this.state.totalPages}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={5}
                            onPageChange={this.handlePageClick}
                            containerClassName={"pagination"}
                            subContainerClassName={"pages pagination"}
                            activeClassName={"active"} />
                    </Col>

                </Row>

            </div>
        )
    }
}

const matchStateToProps = (state) => {
    console.log("inside matchStatetoProps", state)
    return {
        getAllCommunityData: state.getAllCommunityReducer.getAllCommunityData,
        upVoteCommunityData: state.upVoteCommunityReducer.upVotecommunityData,
        downVoteCommunityData: state.upVoteCommunityReducer.downVoteCommunityData,
        message: state.getAllCommunityReducer.message,
    }

}

const matchDispatchToProps = (dispatch) => {
    return {
        getAllCommunityAction: (data) => dispatch(getAllCommunityAction(data)),
        upVoteCommunityAction: (data) => dispatch(upVoteCommunityAction(data)),
        downVoteCommunityAction: (data) => dispatch(downVoteCommunityAction(data)),

    }
}

export default connect(matchStateToProps, matchDispatchToProps)(CommunitySearch)