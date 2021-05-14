import React, { Component } from 'react'
import Navbar from '../navbar/navbar'
import getDashboardDataAction from '../../actions/dashboard/getDashboardData';
import { connect } from "react-redux";
import DashboardPost from './DashboardPost';
import { Row, Col, CardTitle } from 'reactstrap';
import {
    Card, CardText, CardBody,
} from 'reactstrap';
import ReactPaginate from 'react-paginate';

import _ from 'lodash';
import { InputGroup, InputGroupAddon, InputGroupText, Input } from 'reactstrap';

export class Dashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            docs: [],
            searchInput: "",
            pageNumber: 1,
            pageSize: 2,
            select: "",
            sorting: "desc",

        }
    }
    handlePageClick = (e) => {

        this.setState(
            {
                pageNumber: Number(e.selected) + 1
            }
        )
        let obj = {
            // sorting: this.state.sorting,
            searchInput: this.state.searchInput,
            pageNumber: Number(e.selected) + 1,
            pageSize: this.state.pageSize,
            sorting: this.state.sorting,
            select: this.state.select,

        }
        this.props.getDashboardDataAction(obj).then(response => {
            console.log(this.props.dashboardData)
            this.setState(
                {
                    docs: this.props.dashboardData.docs,
                    totalPages: this.props.dashboardData.totalPages
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
        this.props.getDashboardDataAction(obj).then(response => {
            console.log(this.props.dashboardData)
            this.setState(
                {
                    docs: this.props.dashboardData.docs,
                    totalPages: this.props.dashboardData.totalPages
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
        this.props.getDashboardDataAction(obj).then(response => {
            console.log(this.props.dashboardData)
            this.setState(
                {
                    docs: this.props.dashboardData.docs,
                    totalPages: this.props.dashboardData.totalPages
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
        this.props.getDashboardDataAction(obj).then(response => {
            console.log(this.props.dashboardData)
            this.setState(
                {
                    docs: this.props.dashboardData.docs,
                    totalPages: this.props.dashboardData.totalPages
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
            searchInput: e.target.value,
            pageNumber: this.state.pageNumber,
            pageSize: this.state.pageSize,
            select: this.state.select,
            sorting: this.state.sorting,

        }
        this.props.getDashboardDataAction(obj).then(response => {
            this.setState(
                {
                    docs: this.props.dashboardData.docs,
                    totalPages: this.props.dashboardData.totalPages
                }
            )
        })
    }
    async componentDidMount() {
        this.props.getDashboardDataAction(this.state).then(response => {
            console.log(this.props.dashboardData)
            this.setState(
                {
                    docs: this.props.dashboardData.docs,
                    totalPages: this.props.dashboardData.totalPages
                }
            )
        })
    }
    render() {
        let postComponent = this.state.docs.map((postData, index) => (
            <div>
                <DashboardPost
                    data={postData}
                    key={postData._id}
                />
            </div>
        ))
        return (
            <div>
                <Navbar />
                <Row style={{ backgroundColor: "#DAE0E6", marginTop: "2%" }}>
                    <Col xs="2" style={{ paddingTop: "3%", paddingLeft: "2.5%", marginLeft: "1%" }}>
                        <Card>
                            <CardBody class="sort-header">
                                <div class="row">
                                    <span style={{ paddingLeft: "20px" }}>Popularity</span>
                                </div>
                                <div class="input-group mb-3" style={{ paddingLeft: "5px" }}>
                                    <select class="form-select" style={{ fontWeight: "bold" }} aria-label="user select" onChange={this.handleSelectChange}>
                                        <option hidden disabled selected value> -- select-- </option>
                                        <option value="numberOfUsers">No. of Users</option>
                                        <option value="numberOfComments">No. of Comments</option>
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
                    <Col xs="5" style={{ marginLeft: "5%", marginTop: "3%" }}>
                        <div style={{ marginLeft: "3%" }}>
                            <Row style={{ width: "102%" }}>
                                <InputGroup >
                                    <InputGroupAddon addonType="prepend">
                                        <InputGroupText style={{ width: "40px" }}>
                                            <i class="fas fa-search" aria-hidden="true" style={{ color: '#0079d3', fontSize: 18 }}>
                                            </i>
                                        </InputGroupText>
                                    </InputGroupAddon>
                                    <Input Style={{ backgroundColor: 'white', color: 'Black' }} onChange={this.handleSearchChange} placeholder="Search by title or description">
                                    </Input>
                                </InputGroup>
                            </Row>
                        </div>
                        <div style={{ marginLeft: "3%" }}>
                            {postComponent}
                        </div>
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
                    </Col>
                </Row>
            </div>
        )
    }
}

const matchStateToProps = (state) => {
    return {
        dashboardData: state.getDashboardReducer.dashboardData,

    }

}
const matchDispatchToProps = (dispatch) => {
    return {
        getDashboardDataAction: (data) => dispatch(getDashboardDataAction(data)),

    }
}

export default connect(matchStateToProps, matchDispatchToProps)(Dashboard)