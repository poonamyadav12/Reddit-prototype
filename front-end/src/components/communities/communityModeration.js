//Created by Priyansh Patel

import React, { Component } from "react";
import Navbar from "../navbar/navbar";
import cookie from "react-cookies";
import { Redirect } from "react-router";
import "./myCommunities.css";
import { connect } from "react-redux";
import { Card, Button, CardTitle, CardText, CardBody } from "reactstrap";
import myCommunitiesAction from "../../actions/community/myCommunitiesAction";
import Modal from "react-modal";
import CommunityModList from "./communityModList";
import { InputGroup, InputGroupAddon, InputGroupText, Input } from "reactstrap";
import CommunityModUsersList from "./communityModUsersList";
import getMyCommunityModAction from "../../actions/community/getMyCommunityModAction";
import ReactPaginate from "react-paginate";

const customStyles = {
  content: {
    top: "40%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    height: "500px",
    width: "1280px",
    transform: "translate(-50%, -50%)",
  },
};

class CommunityModeration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: cookie.load("userId"),
      error: false,
      myCommunitiesData: this.props.myCommunitiesData,
      usersPopUp: false,
      totalPages: this.props.myCommunitiesData.totalPages,
      pageNumber: "1",
      pageSize: "2",
      searchKeyword: "",
    };
  }

  componentDidMount() {
    this.props.getMyCommunityModAction(this.state).then((response) => {
      console.log("My communities response >>>>>>>>>>>>>", this.props);
      if (this.props.errorGetMyCommunityMod) {
        this.setState({
          error: true,
        });
      } else {
        this.setState({
          myCommunitiesData: this.props.myCommunitiesData,
        });
      }
    });
  }

  handlePageSizeChange = (e) => {
    e.preventDefault();
    this.setState({
      pageSize: e.target.value,
    });

    let reqObj = {
      userId: cookie.load("userId"),
      error: false,
      myCommunitiesData: this.state.myCommunitiesData,
      usersPopUp: false,
      totalPages: this.state.totalPages,
      pageNumber: this.state.pageNumber,
      pageSize: e.target.value,
    };

    this.props.getMyCommunityModAction(reqObj).then((response) => {
      if (this.props.errorGetMyCommunityMod) {
        this.setState({
          error: true,
        });
      } else {
        this.setState({
          myCommunitiesData: this.props.myCommunitiesData,
        });
      }
    });
  };

  toggleUsersList = () => {
    this.setState({
      usersPopUp: !this.state.usersPopUp,
    });
  };

  handleChangeSearchKeyword = (e) => {
    e.preventDefault()
    this.setState({
      searchKeyword: e.target.value
    })

    let reqObj = {
      pageNumber: "1",
      pageSize: this.state.pageSize,
      searchKeyword: e.target.value
    }

    this.props.getMyCommunityModAction(reqObj).then((response) => {
      if (this.props.errorGetMyCommunityMod) {
        this.setState({
          error: true,
        });
      } else {
        this.setState({
          myCommunitiesData: this.props.myCommunitiesData,
        });
      }
    });
  }

  handlePageClick = (e) => {
    this.setState({
      pageNumber: Number(e.selected) + 1,
    });

    let reqObj = {
      pageNumber: Number(e.selected) + 1,
      pageSize: this.state.pageSize,
    }
    this.props.getMyCommunityModAction(reqObj).then((response) => {
      if (this.props.errorGetMyCommunityMod) {
        this.setState({
          error: true,
        });
      } else {
        this.setState({
          myCommunitiesData: this.props.myCommunitiesData,
        });
      }
    });
  };

  render() {
    let myCommunities = <div>No communities to show</div>;
    console.log("Community Dataaaaa>>>>>>>>>>>>", this.state.myCommunitiesData);
    console.log(this.props);
    if (this.state.myCommunitiesData) {
      if (this.state.myCommunitiesData.communities) {
        console.log(
          "INSSSIDDEEEE IFFFFF",
          this.state.myCommunitiesData.communities
        );
        myCommunities = this.state.myCommunitiesData.communities.map(
          (community) => {
            console.log(community);
            return (
              <CommunityModList
                key={community._id}
                data={community}
                communityMod={this.state}
              />
            );
          }
        );
      }
    }

    return (
      <div>
        { !cookie.load('token') ? window.location.href = '/' : null}
        <div>
          <Navbar />
        </div>
        <div class="com-header">My Communities Moderation</div>
        <div class="com-content">
          <div class="row">
            <div
              class="col-2"
              style={{
                marginLeft: "95px",
                paddingLeft: "20px",
                paddingRight: "24px",
                paddingTop: "20px",
              }}
            >
              <Card>
                <CardBody class="sort-header">
                  <div class="row">
                    <span style={{ paddingLeft: "20px" }}>Page Size</span>
                  </div>
                  <hr />
                  <div class="input-group mb-3" style={{ paddingLeft: "5px" }}>
                    <select
                      class="form-select"
                      style={{ fontWeight: "bold", width: "350px" }}
                      aria-label="user select"
                      onChange={this.handlePageSizeChange}
                    >
                      <option selected value="2">
                        2
                      </option>
                      <option value="5">5</option>
                      <option value="10">10</option>
                    </select>
                  </div>
                </CardBody>
              </Card>
            </div>
            <div
              class="col-6"
              style={{
                paddingLeft: "0",
                paddingRight: "24px",
                paddingTop: "20px",
              }}
            >
              <InputGroup>
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <i
                      class="fas fa-search"
                      aria-hidden="true"
                      style={{ color: "#0079d3", fontSize: 18 }}
                    ></i>
                  </InputGroupText>
                </InputGroupAddon>
                <Input
                  Style={{ backgroundColor: "white", color: "Black" }}
                  placeholder="Search"
                  onChange={this.handleChangeSearchKeyword}
                ></Input>
              </InputGroup>
              <br />
              {myCommunities}
              {/* <Card>
                                <CardBody class="com-card" onClick={this.toggleUsersList}>
                                    <img src="/logo192.png" alt="Avatar" class="com-avatar" /> <span class="com-name">r/CrytoCurrency</span>
                                    <br />
                                    <span className="com-desc">Description. Trying to make it long. Even more long. Like really very long.</span>
                                    <br />
                                    <span className="com-details"><i class="fas fa-user-clock"></i>100</span>
                                </CardBody>
                            </Card>
                            <Card>
                                <CardBody class="com-card">
                                    <img src="/logo192.png" alt="Avatar" class="com-avatar" /> <span class="com-name">r/coolGuides</span>
                                    <br />
                                    <span className="com-desc">Description. Trying to make it long. Even more long. Like really very long.</span>
                                    <br />
                                    <span className="com-details"><i class="fas fa-user-clock"></i>100</span>
                                </CardBody>
                            </Card>
                            <Card>
                                <CardBody class="com-card">
                                    <img src="/logo192.png" alt="Avatar" class="com-avatar" /> <span class="com-name">r/Cars</span>
                                    <br />
                                    <span className="com-desc">Description. Trying to make it long. Even more long. Like really very long.</span>
                                    <br />
                                    <span className="com-details"><i class="fas fa-user-clock"></i>100</span>
                                </CardBody>
                            </Card>
                            <Card>
                                <CardBody class="com-card">
                                    <img src="/logo192.png" alt="Avatar" class="com-avatar" /> <span class="com-name">r/gadgets</span>
                                    <br />
                                    <span className="com-desc">Description. Trying to make it long. Even more long. Like really very long.</span>
                                    <br />
                                    <span className="com-details"><i class="fas fa-user-clock"></i>100</span>
                                </CardBody>
                            </Card>
                            <Card>
                                <CardBody class="com-card">
                                    <img src="/logo192.png" alt="Avatar" class="com-avatar" /> <span class="com-name">r/formula1</span>
                                    <br />
                                    <span className="com-desc">Description. Trying to make it long. Even more long. Like really very long.</span>
                                    <br />
                                    <span className="com-details"><i class="fas fa-user-clock"></i>100</span>
                                </CardBody>
                            </Card> */}
            </div>
            <div
              class="col-2"
              style={{
                paddingLeft: "0",
                paddingTop: "20px",
                marginRight: "65px",
              }}
            ></div>
          </div>
          <div className="row">
            <div className="col pagination-class">
              <ReactPaginate
                previousLabel={"prev"}
                nextLabel={"next"}
                breakLabel={"..."}
                breakClassName={"break-me"}
                pageCount={this.props.myCommunitiesData.totalPages}
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
        <Modal
          style={customStyles}
          isOpen={this.state.usersPopUp}
          ariaHideApp={false}
        >
          <CommunityModUsersList
            data={this.state}
            closePopUp={this.toggleUsersList}
          />
        </Modal>
      </div>
    );
  }
}

const matchStateToProps = (state) => {
  console.log("inside matchStatetoProps", state);
  return {
    myCommunitiesError: state.getMyCommunityModReducer.error,
    myCommunitiesMessage: state.getMyCommunityModReducer.message,
    myCommunitiesData: state.getMyCommunityModReducer.communityData,
  };
};

const matchDispatchToProps = (dispatch) => {
  return {
    getMyCommunityModAction: (data) => dispatch(getMyCommunityModAction(data)),
  };
};

export default connect(
  matchStateToProps,
  matchDispatchToProps
)(CommunityModeration);
