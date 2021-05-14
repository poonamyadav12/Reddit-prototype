import React, { Component } from 'react'
import _ from 'lodash';
import Navbar from "../navbar/navbar";
import { Row, Col, CardTitle } from 'reactstrap';
import AsyncSelect from 'react-select/async'
import axios from 'axios';
import { BACKEND_URL, BACKEND_PORT } from '../../config/config';
import cookie from "react-cookies";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import {
    Card, CardText, CardBody,
} from 'reactstrap';
import ReactPaginate from 'react-paginate';

export class Invitation extends Component {
    constructor(props) {
        super(props);
        console.log(this.props.location.state.communityData);
        console.log(this.props)

        this.state = {
            community_id: this.props.location.state.communityData._id,
            communityName: this.props.location.state.communityData.communityName,
            members: [],
            invites: [],
            pageNumber: 1,
            pageSize: 2

        }
    }
    handleUserSearch = async (inp, callback) => {
        axios.defaults.headers.common["authorization"] = cookie.load('token')
        axios.defaults.withCredentials = true;
        return axios
            .get(BACKEND_URL + ":" + BACKEND_PORT + '/user/search?searchKeyword=' + inp)
            .then((response) => {
                if (response.status === 200) {
                    console.log("api response>>>>>>>>>>", response)
                    this.setState(
                        {
                            users: response.data.users
                        }
                    )
                    callback(response.data.users.map(i => ({
                        label: i.name,
                        value: i._id
                    })));
                }
            })
            .catch((err) => {
            });
    }
    async componentDidMount() {
        axios.defaults.headers.common["authorization"] = cookie.load('token')
        axios.defaults.withCredentials = true;
        return axios
            .get(BACKEND_URL + ":" + BACKEND_PORT + '/community/mycommunities/users/invites/' + this.state.community_id + '?pageNumber=' + this.state.pageNumber + '&pageSize=' + this.state.pageSize)
            .then((response) => {
                if (response.status === 200) {
                    this.setState(
                        {
                            invites: response.data.paginatedResponse.invites,
                            totalPages: response.data.paginatedResponse.totalPages,
                        }
                    )

                }
            })

    }
    handlePageClick = (e) => {
        let obj = {
            communityID: this.state.community_id,
            pageNumber: Number(e.selected) + 1,
            pageSize: this.state.pageSize
        }
        return axios
            .get(BACKEND_URL + ":" + BACKEND_PORT + '/community/mycommunities/users/invites/' + this.state.community_id + '?pageNumber=' + obj.pageNumber + '&pageSize=' + this.state.pageSize)
            .then((response) => {
                if (response.status === 200) {
                    this.setState(
                        {
                            invites: response.data.paginatedResponse.invites,
                            totalPages: response.data.paginatedResponse.totalPages,
                        }
                    )

                }
            })

    }
    handlePaginationDropdown = (e) => {
        e.preventDefault()
        console.log(e.target.value);
        let obj = {
            communityID: this.state.community_id,
            pageNumber: 1,
            pageSize: e.target.value
        }
        return axios
            .get(BACKEND_URL + ":" + BACKEND_PORT + '/community/mycommunities/users/invites/' + this.state.community_id + '?pageNumber=' + obj.pageNumber + '&pageSize=' + obj.pageSize)
            .then((response) => {
                if (response.status === 200) {
                    this.setState(
                        {
                            invites: response.data.paginatedResponse.invites,
                            totalPages: response.data.paginatedResponse.totalPages,
                        }
                    )

                }
            })

    }
    handleSubmit = e => {
        e.preventDefault();
        if (this.state.members.length == 0) {
            alert("Please enter atleast one member");
            return;
        }
        let users = []
        for (let i = 0; i < this.state.members.length; i++) {
            users.push(this.state.members[i].value);
        }
        let objToSend = {
            community_id: this.state.community_id,
            users: users
        }
        console.log(objToSend)
        axios.defaults.headers.common["authorization"] = cookie.load('token')
        axios.defaults.withCredentials = true;
        return axios
            .post(BACKEND_URL + ":" + BACKEND_PORT + '/community/mycommunities/users/invite', objToSend)
            .then((response) => {
                if (response.status === 200) {
                    console.log("api response>>>>>>>>>>", response)
                    toast.success("invited successfullyi");


                }
            })
            .catch((err) => {
                console.log(err.response)
                toast.error(err.response.data.errorMessage[0]);
            });

    }
    handleSelectChange = (members) => {
        console.log(members)
        this.setState({
            members: members,
        })
    }
    render() {
        console.log(this.state)
        let userMap = this.state.invites.map((invites, index) => {
            return (
                <div>
                    <Card style={{ marginTop: "15px", border: "1px" }}>
                        <CardBody style={{ border: "1px", overflow: "scroll" }}>
                            {index + 1}.
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                {invites.user.name}
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

                                <strong style={{ fontWeight: "700" }}>{invites.status}</strong>
                        </CardBody>
                    </Card>


                </div>

            )
        }
        )
        return (
            <div>
                <Navbar />

                <Row>
                    <Col></Col>
                    <Col>
                        <Row>
                            <h3>INVITE FOR {this.state.communityName}</h3>
                        </Row>
                        <br></br>
                        <br></br>
                        <br></br>
                        <br></br>
                        <br></br>
                        <br></br>


                        <Row>
                            <Col>
                                <AsyncSelect
                                    isMulti
                                    value={this.state.members}
                                    onChange={this.handleSelectChange}
                                    placeholder={'Invite members to this community'}
                                    loadOptions={this.handleUserSearch}
                                />
                                <form onSubmit={this.handleSubmit} id="Login">

                                    <button type="submit" className="btn btn-success" style={{ "backgroundColor": "#0079D3", "marginTop": "100px", "marginLeft": "0px" }} onSubmit={this.handleSubmit}>INVITE</button>
                                </form>
                            </Col>
                        </Row>
                        <Row>
                            <h3>INVITATION STATUS</h3>
                            <br></br>


                            <div class="input-group mb-3" style={{ paddingLeft: "5px" }}>
                                <select class="form-select" style={{ fontWeight: "bold", width: "350px" }} aria-label="user select" onChange={this.handlePaginationDropdown}>
                                    <option selected value="2">2</option>
                                    <option value="5">5</option>
                                    <option value="10">10</option>
                                </select>
                            </div>
                        </Row>
                        <Row>
                            {userMap}
                        </Row>
                        <Row>
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
                        </Row>
                        <ToastContainer />

                    </Col>
                    <Col>
                    </Col>

                </Row>
            </div>
        )
    }
}

export default Invitation
