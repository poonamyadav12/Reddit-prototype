// Created by Priyansh Patel
import React, { Component } from "react";
import {
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Card,
  Button,
  CardTitle,
  CardText,
  Row,
  Col,
  FormGroup,
  CardBody,
} from "reactstrap";
import classnames from "classnames";
import getMyCommunityModUserReqAction from "../../actions/community/getMyCommunityModUserReqAction";
import "./communityModUsersList.css";
import { connect } from "react-redux";
import { InputGroup, InputGroupAddon, InputGroupText, Input } from "reactstrap";
import bulkRequestAcceptAction from "../../actions/community/bulkRequestAcceptAction";
import getMyCommunityModMemAction from "../../actions/community/getMyCommunityModMemAction";
import ReactPaginate from "react-paginate";
import CommunityModCommunityList from './communityModCommunityList';
import Modal from "react-modal";

let checkedUserList = [];
let toggledMember = null;

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

class CommunityModUsersList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: "1",
      communityId: this.props.data.communityId,
      communityAvatar: this.props.data.communityAvatar,
      communityName: this.props.data.communityName,
      description: this.props.data.description,
      totalRequests: this.props.data.totalRequests,
      userReqData: [],
      pageNumber: "1",
      checkedUserList: [],
      acceptFlag: false,
      userReqPageNumber: "1",
      memberPageNumber: "1",
      memberList: [],
      memberData: {},
      userReqApiData: {},
      userReqPageSize: "2",
      memberPageSize: "2",
      memberSearchKeyword: "",
      userReqSearchKeyword: "",
      removeUsersPopUp: false,
      toggledUserId: null,
    };
  }
  componentDidMount() {
    console.log("PROPS INSIDE USERS LISSSTTTT===========", this.props);
    this.props.getMyCommunityModUserReqAction(this.state).then((response) => {
      console.log("user req list response >>>>>>>>>>>>>", this.props);
      // users array: this.props.userReqData.users
      if (this.props.userReqError) {
        this.setState({
          userReqError: true,
          userReqMessage: this.props.userReqMessage,
        });
      } else {
        this.setState({
          userReqData: this.props.userReqData.users,
          userReqApiData: this.props.userReqData,
        });
      }
    });

    this.props.getMyCommunityModMemAction(this.state).then((response) => {
      console.log("members req list response >>>>>>>>>>>>>", this.props);
      if (this.props.memberError) {
        this.setState({
          memberError: true,
          memberMessage: this.props.userReqMessage,
        });
      } else {
        this.setState({
          memberData: this.props.memberData,
          memberList: this.props.memberData.users,
        });
      }
    });
  }

  toggleCommunityList = (member) => {
    console.log("toggle@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@", member)
    if (member) {
      this.setState({
        toggledUserId: member._id,
      })
    }
    this.setState({
      removeUsersPopUp: !this.state.removeUsersPopUp,
    });
  };

  handlePageClickMembers = (e) => {
    this.setState({
      memberPageNumber: Number(e.selected) + 1,
    });

    let reqData = {
      memberPageNumber: Number(e.selected) + 1,
      communityId: this.state.communityId,
      memberPageSize: this.state.memberPageSize,
      memberSearchKeyword: this.state.memberSearchKeyword,
    };

    //call action
    this.props.getMyCommunityModMemAction(reqData).then((response) => {
      console.log("members req list response >>>>>>>>>>>>>", this.props);
      if (this.props.memberError) {
        this.setState({
          memberError: true,
          memberMessage: this.props.userReqMessage,
        });
      } else {
        this.setState({
          memberData: this.props.memberData,
          memberList: this.props.memberData.users,
        });
      }
    });
  };

  handlePageClickUserReq = (e) => {
    this.setState({
      userReqPageNumber: Number(e.selected) + 1,
    });

    let reqData = {
      userReqPageNumber: Number(e.selected) + 1,
      communityId: this.state.communityId,
      userReqSearchKeyword: this.state.userReqSearchKeyword,
      userReqPageSize: this.state.userReqPageSize,
    };

    //call action
    this.props.getMyCommunityModUserReqAction(reqData).then((response) => {
      console.log("members req list response >>>>>>>>>>>>>", this.props);
      if (this.props.userReqError) {
        this.setState({
          userReqError: true,
          userReqMessage: this.props.userReqMessage,
        });
      } else {
        this.setState({
          userReqData: this.props.userReqData.users,
        });
      }
    });
  };

  setActiveTab = (tab) => {
    this.setState({
      activeTab: tab,
    });
  };

  toggleTab = (tab) => {
    if (this.state.activeTab !== tab) this.setActiveTab(tab);
    if (tab === "1") {
      //Community Join Requests
      this.setState({
        type: "REQUEST",
        pictures: [],
        link: "",
      });
    } else if (tab === "2") {
      //Community Members
      this.setState({
        type: "JOINED",
        description: "",
      });
    }
  };

  checkBoxChangeHandler = (user, e) => {
    if (e.target.checked) {
      checkedUserList.push(user._id);
      this.setState({
        checkedUserList: checkedUserList,
      });
    } else {
      if (checkedUserList.includes(user._id)) {
        const index = checkedUserList.indexOf(user._id);
        if (index > -1) {
          checkedUserList.splice(index, 1);
          this.setState({
            checkedUserList: checkedUserList,
          });
        }
      }
    }
  };

  bulkAcceptRequests = (e) => {
    e.preventDefault();
    let data = {
      community_id: this.state.communityId,
      users: this.state.checkedUserList,
    };
    // let data = {
    //     community_id: "6094f8334a9f9124fa36ddd4",
    //     users: ["6094f8444a9f9124fa36ddd8"]
    // }
    console.log(data);
    // To Do: create action and reducer to call the API

    if (data.users.length > 0) {
      this.props.bulkRequestAcceptAction(data).then((response) => {
        console.log(
          "bulkRequestAcceptAction response >>>>>>>>>>>>>",
          this.props
        );
        if (this.props.bulkRequestAcceptError) {
          this.setState({
            error: true,
          });
        } else {
          this.setState({
            acceptFlag: true,
            bulkRequestAcceptData: this.props.bulkRequestAcceptData,
          });
        }
      });

      // TO BE UNCOMMENTED, USED TO RELOAD REQUESTS LIST AFTER SOME/ALL OF THEM GET ACCEPTED

      // this.props.getMyCommunityModUserReqAction(this.state).then((response) => {
      //     console.log("user req list response >>>>>>>>>>>>>", this.props);
      //     // users array: this.props.userReqData.users
      //     if (this.props.userReqError) {
      //       this.setState({
      //         userReqError: true,
      //         userReqMessage: this.props.userReqMessage,
      //       });
      //     } else {
      //       this.setState({
      //         userReqData: this.props.userReqData.users,
      //         userReqApiData: this.props.userReqData,
      //       });
      //     }
      //   });
    }
  };

  handleUserReqSearch = (e) => {
    e.preventDefault();
    this.setState({
      userReqPageNumber: 1,
      userReqSearchKeyword: e.target.value,
    });

    let reqObj = {
      userReqPageNumber: 1,
      userReqSearchKeyword: e.target.value,
      userReqPageSize: this.state.userReqPageSize,
      communityId: this.state.communityId,
    };

    this.props.getMyCommunityModUserReqAction(reqObj).then((response) => {
      console.log("user req list response >>>>>>>>>>>>>", this.props);
      // users array: this.props.userReqData.users
      if (this.props.userReqError) {
        this.setState({
          userReqError: true,
          userReqMessage: this.props.userReqMessage,
        });
      } else {
        this.setState({
          userReqData: this.props.userReqData.users,
          userReqApiData: this.props.userReqData,
        });
      }
    });
  };

  handleMemberSearch = (e) => {
    e.preventDefault();
    this.setState({
      memberPageNumber: 1,
      memberSearchKeyword: e.target.value,
    });

    let reqObj = {
      memberPageNumber: 1,
      memberSearchKeyword: e.target.value,
      memberPageSize: this.state.memberPageSize,
      communityId: this.state.communityId,
    };

    this.props.getMyCommunityModMemAction(reqObj).then((response) => {
      console.log("members req list response >>>>>>>>>>>>>", this.props);
      if (this.props.memberError) {
        this.setState({
          memberError: true,
          memberMessage: this.props.userReqMessage,
        });
      } else {
        this.setState({
          memberData: this.props.memberData,
          memberList: this.props.memberData.users,
        });
      }
    });
  };

  handleMemberPageSizeChange = (e) => {
    e.preventDefault();
    this.setState({
      memberPageSize: e.target.value,
      memberPageNumber: 1,
    });

    let reqObj = {
      memberPageSize: e.target.value,
      memberPageNumber: 1,
      communityId: this.state.communityId,
      memberSearchKeyword: this.state.memberSearchKeyword,
    };

    this.props.getMyCommunityModMemAction(reqObj).then((response) => {
      console.log("members req list response >>>>>>>>>>>>>", this.props);
      if (this.props.memberError) {
        this.setState({
          memberError: true,
          memberMessage: this.props.userReqMessage,
        });
      } else {
        this.setState({
          memberData: this.props.memberData,
          memberList: this.props.memberData.users,
        });
      }
    });
  };

  handleUserReqPageSizeChange = (e) => {
    e.preventDefault();
    this.setState({
      userReqPageSize: e.target.value,
      userReqPageNumber: 1,
    });

    let reqObj = {
      userReqPageSize: e.target.value,
      userReqPageNumber: 1,
      communityId: this.state.communityId,
      userReqSearchKeyword: this.state.userReqSearchKeyword,
    };

    this.props.getMyCommunityModUserReqAction(reqObj).then((response) => {
      if (this.props.userReqError) {
        this.setState({
          userReqError: true,
          userReqMessage: this.props.userReqMessage,
        });
      } else {
        this.setState({
          userReqData: this.props.userReqData.users,
          userReqApiData: this.props.userReqData,
        });
      }
    });
  };

  render() {
    let userRequests = <div>No requests to show</div>;
    if (this.state.userReqData.length > 0) {
      userRequests = this.state.userReqData.map((user) => {
        console.log(user);
        return (
          <Row>
            <Col sm="6">
              <Card>
                <CardBody>
                  <Input
                    style={{ marginRight: "1%" }}
                    addon
                    type="checkbox"
                    aria-label="Checkbox for user requests"
                    onChange={(e) => this.checkBoxChangeHandler(user, e)}
                  />
                  {user.avatar ? (
                    <img src={user.avatar} alt="Avatar" class="com-avatar" />
                  ) : (
                    <img src="/logo192.png" alt="Avatar" class="com-avatar" />
                  )}{" "}
                  <span class="com-name">{user.name}</span>
                </CardBody>
              </Card>
            </Col>
          </Row>
        );
      });
    }

    let members = <div>No members to show</div>;
    if (this.state.memberList.length > 0) {
      members = this.state.memberList.map((member) => {
        return (
          <Row>
            <Col sm="6">
              <Card>
                <CardBody onClick={() => this.toggleCommunityList(member)}>
                  {member.avatar ? (
                    <img src={member.avatar} alt="Avatar" class="com-avatar" />
                  ) : (
                    <img src="/logo192.png" alt="Avatar" class="com-avatar" />
                  )}{" "}
                  <span class="com-name">{member.name}</span>
                </CardBody>
              </Card>
            </Col>
          </Row>
        );
      });
    }

    return (
      <div>
      <div style={{ backgroundColor: "rgb(218,224,230)", height: "1000px" }}>
        <span
          onClick={this.props.closePopUp}
          style={{ float: "right", marginRight: "1%", marginTop: "1%" }}
        >
          <i class="fas fa-times closeButtonIcon"></i>
        </span>
        <div className="post-tabs-container">
          <div class="create-post-header">Community Users</div>
          <Nav tabs>
            <NavItem>
              <NavLink
                className={classnames({ active: this.state.activeTab === "1" })}
                onClick={() => {
                  this.toggleTab("1");
                }}
              >
                Join Requests
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: this.state.activeTab === "2" })}
                onClick={() => {
                  this.toggleTab("2");
                }}
              >
                Members
              </NavLink>
            </NavItem>
          </Nav>
          <TabContent activeTab={this.state.activeTab}>
            <TabPane tabId="1">
              <Card style={{ width: "48.7%" }}>
                {/* <CardBody class="sort-header"> */}
                <CardBody>
                  <div className="row">
                    <div
                      className="col-2"
                      style={{ paddingRight: "0", width: "75%" }}
                    >
                      Page Size
                    </div>
                    <div className="col-3">
                      <div
                        class="input-group mb-3"
                        style={{ paddingLeft: "5px" }}
                      >
                        <select
                          class="form-select"
                          style={{ fontWeight: "bold", width: "100%" }}
                          aria-label="user select"
                          onChange={this.handleUserReqPageSizeChange}
                        >
                          <option selected value="2">
                            2
                          </option>
                          <option value="5">5</option>
                          <option value="10">10</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="row">
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
                        onChange={this.handleUserReqSearch}
                      ></Input>
                    </InputGroup>
                  </div>
                </CardBody>
              </Card>
              {userRequests}
              <div className="row">
                <div className="col pagination-class">
                  <ReactPaginate
                    previousLabel={"prev"}
                    nextLabel={"next"}
                    breakLabel={"..."}
                    breakClassName={"break-me"}
                    pageCount={this.props.userReqData.totalPages}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={this.handlePageClickUserReq}
                    containerClassName={"pagination"}
                    subContainerClassName={"pages pagination"}
                    activeClassName={"active"}
                  />
                </div>
              </div>

              {/* <Row>
                                <Col sm="6">
                                    <Card body>
                                        <img src="/logo192.png" alt="Avatar" class="com-avatar" /> <span class="com-name">RandomUser</span>
                                    </Card>
                                </Col>
                            </Row> */}
            </TabPane>
            <TabPane tabId="2">
              <Card style={{ width: "48.7%" }}>
                {/* <CardBody class="sort-header"> */}
                <CardBody>
                  <div className="row">
                    <div
                      className="col-2"
                      style={{ paddingRight: "0", width: "75%" }}
                    >
                      Page Size
                    </div>
                    <div className="col-3">
                      <div
                        class="input-group mb-3"
                        style={{ paddingLeft: "5px" }}
                      >
                        <select
                          class="form-select"
                          style={{ fontWeight: "bold", width: "100%" }}
                          aria-label="user select"
                          onChange={this.handleMemberPageSizeChange}
                        >
                          <option selected value="2">
                            2
                          </option>
                          <option value="5">5</option>
                          <option value="10">10</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="row">
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
                        onChange={this.handleMemberSearch}
                      ></Input>
                    </InputGroup>
                  </div>
                </CardBody>
              </Card>
              {members}
              <div className="row">
                <div className="col pagination-class">
                  <ReactPaginate
                    previousLabel={"prev"}
                    nextLabel={"next"}
                    breakLabel={"..."}
                    breakClassName={"break-me"}
                    pageCount={this.props.memberData.totalPages}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={this.handlePageClickMembers}
                    containerClassName={"pagination"}
                    subContainerClassName={"pages pagination"}
                    activeClassName={"active"}
                  />
                </div>
              </div>
              {/* <Row>
                                <Col sm="6">
                                    <Card body>
                                        <img src="/logo192.png" alt="Avatar" class="com-avatar" /> <span class="com-name">RandomUser</span>
                                    </Card>
                                </Col>
                            </Row> */}
            </TabPane>
          </TabContent>
          <br />
          {this.state.activeTab === "1" ? (
            checkedUserList.length > 0 ? (
              <button
                type="submit"
                className="btn btn-primary"
                onClick={this.bulkAcceptRequests}
                style={{ backgroundColor: "#0079d3" }}
              >
                Accept
              </button>
            ) : null
          ) : null}
        </div>
      </div>
      <Modal
          style={customStyles}
          isOpen={this.state.removeUsersPopUp}
          ariaHideApp={false}
        >
          <CommunityModCommunityList
            data={this.state}
            closePopUp={() => this.toggleCommunityList(null)}
          />
        </Modal>
      </div>
    );
  }
}

const matchStateToProps = (state) => {
  console.log("inside matchStatetoProps", state);
  return {
    userReqError: state.getMyCommunityModUserReqReducer.error,
    userReqMessage: state.getMyCommunityModUserReqReducer.message,
    userReqData: state.getMyCommunityModUserReqReducer.userData,
    bulkRequestAcceptError: state.bulkRequestAcceptReducer.error,
    bulkRequestAcceptMessage: state.bulkRequestAcceptReducer.message,
    bulkRequestAcceptData: state.bulkRequestAcceptReducer.userData,
    memberError: state.getMyCommunityModMemReducer.error,
    memberMessage: state.getMyCommunityModMemReducer.message,
    memberData: state.getMyCommunityModMemReducer.memberData,
  };
};

const matchDispatchToProps = (dispatch) => {
  return {
    getMyCommunityModUserReqAction: (data) =>
      dispatch(getMyCommunityModUserReqAction(data)),
    bulkRequestAcceptAction: (data) => dispatch(bulkRequestAcceptAction(data)),
    getMyCommunityModMemAction: (data) =>
      dispatch(getMyCommunityModMemAction(data)),
  };
};

export default connect(
  matchStateToProps,
  matchDispatchToProps
)(CommunityModUsersList);
