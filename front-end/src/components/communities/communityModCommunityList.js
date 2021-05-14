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
import "./communityModUsersList.css";
import { connect } from "react-redux";
import { InputGroup, InputGroupAddon, InputGroupText, Input } from "reactstrap";

import ReactPaginate from "react-paginate";
import getMyCommunityModCommunityAction from '../../actions/community/getMyCommuityModCommunityAction';
import bulkCommunityUserRemoveAction from '../../actions/community/bulkCommunityUserRemoveAction';
import { setRawCookie } from "react-cookies";

let checkedCommunityList = [];

class CommunityModCommunityList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      testFlag: true,
      communityData: {},
      communityList: [],
      checkedCommunityList: [],
      communityModTotalPages: "1",
      communityModPageNumber: "1",
      communityModPageSize: "2",
      communityModSearchKeyword: "",
    };
  }
  componentDidMount() {
    console.log("CommunityModCommunityList Component Mounted")
    console.log("this.state", this.state)
    console.log("this,props", this.props)
    //call action here
    this.props.getMyCommunityModCommunityAction(this.state).then((response) => {
      console.log("community list response >>>>>>>>>>>>>", this.props);
      // users array: this.props.userReqData.users
      if (this.props.communityError) {
        this.setState({
          communityError: true,
          communityMessage: this.props.communityMessage,
        });
      } else {
        this.setState({
          communityData: this.props.communityData,
          communityList: this.props.communityData.communities.communities,
          communityModTotalPages: this.props.communityData.communities.totalPages,
        });
      }
    });
  }

  handlePageClickCommunityModCommunity = (e) => {
    this.setState({
      communityModPageNumber: Number(e.selected) + 1,
    });

    let communityModPageNumber = Number(e.selected) + 1

    let reqData = {
      communityModPageNumber: communityModPageNumber,
      communityModPageSize: this.state.communityModPageSize
    }

    this.props.getMyCommunityModCommunityAction(reqData).then((response) => {
      console.log("community list response >>>>>>>>>>>>>", this.props);
      // users array: this.props.userReqData.users
      if (this.props.communityError) {
        this.setState({
          communityError: true,
          communityMessage: this.props.communityMessage,
        });
      } else {
        this.setState({
          communityData: this.props.communityData,
          communityList: this.props.communityData.communities.communities,
          communityModTotalPages: this.props.communityData.communities.totalPages,
        });
      }
    });
  };

  handleCommunityModSearch = (e) => {
    e.preventDefault();
    this.setState({
      communityModPageNumber: 1,
      communityModSearchKeyword: e.target.value,
      communityModPageSize: this.state.communityModPageSize,
    });

    let reqObj = 
      {
        communityModPageNumber: 1,
        communityModSearchKeyword: e.target.value,
        communityModPageSize: this.state.communityModPageSize,
      }
    
      this.props.getMyCommunityModCommunityAction(reqObj).then((response) => {
        console.log("community list response >>>>>>>>>>>>>", this.props);
        // users array: this.props.userReqData.users
        if (this.props.communityError) {
          this.setState({
            communityError: true,
            communityMessage: this.props.communityMessage,
          });
        } else {
          this.setState({
            communityData: this.props.communityData,
            communityList: this.props.communityData.communities.communities,
            communityModTotalPages: this.props.communityData.communities.totalPages,
          });
        }
      });
  };

  handleCommunityModCommunityPageSizeChange = (e) => {
    e.preventDefault();
    this.setState({
      communityModPageSize: e.target.value,
      communityModPageNumber: 1,
    });

    let reqObj = {
      communityModPageSize: e.target.value,
      communityModPageNumber: 1,
      communityModSearchKeyword: this.state.communityModSearchKeyword,
    }

    this.props.getMyCommunityModCommunityAction(reqObj).then((response) => {
      console.log("community list response >>>>>>>>>>>>>", this.props);
      // users array: this.props.userReqData.users
      if (this.props.communityError) {
        this.setState({
          communityError: true,
          communityMessage: this.props.communityMessage,
        });
      } else {
        this.setState({
          communityData: this.props.communityData,
          communityList: this.props.communityData.communities.communities,
          communityModTotalPages: this.props.communityData.communities.totalPages,
        });
      }
    });
  };

  communityCheckBoxChangeHandler = (community, e) => {
    console.log(community)
    if (e.target.checked) {
      checkedCommunityList.push(community._id);
      this.setState({
        checkedCommunityList: checkedCommunityList,
      });
    } else {
      if (checkedCommunityList.includes(community._id)) {
        const index = checkedCommunityList.indexOf(community._id);
        if (index > -1) {
          checkedCommunityList.splice(index, 1);
          this.setState({
            checkedCommunityList: checkedCommunityList,
          });
        }
      }
    }
    console.log(checkedCommunityList)
  };

  bulkCommunityUserRemove = (e) => {
    e.preventDefault(e);
    console.log("USER REMOVEEEEEEEEEEEEEE", this.props.data.toggledUserId)
    let answer = window.confirm("Are you sure you want to remove the user from selected communities?")
    if (answer){
      let data = {
        user_id: this.props.data.toggledUserId,
        communities: checkedCommunityList,
      };
      if (data.communities.length > 0) {
        this.props.bulkCommunityUserRemoveAction(data).then((response) => {
          console.log(
            "bulkCommunityUserRemoveAction response >>>>>>>>>>>>>",
            this.props
          );
          if (this.props.bulkDeleteError) {
            this.setState({
              error: true,
            });
          } else {
            this.props.getMyCommunityModCommunityAction(this.state).then((response) => {
              console.log("community list response >>>>>>>>>>>>>", this.props);
              // users array: this.props.userReqData.users
              if (this.props.communityError) {
                this.setState({
                  communityError: true,
                  communityMessage: this.props.communityMessage,
                });
              } else {
                this.setState({
                  communityData: this.props.communityData,
                  communityList: this.props.communityData.communities.communities,
                  communityModTotalPages: this.props.communityData.communities.totalPages,
                });
              }
            });
          }

        });
      }
    }
  }

  render() {
    let communities = <div>No communities to show</div>
    if (this.state.communityList.length > 0) {
      communities = this.state.communityList.map((community) => {
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
                    onChange={(e) => this.communityCheckBoxChangeHandler(community, e)}
                  />
                  {community.communityAvatar[0] ? (
                    <img src={community.communityAvatar[0]} alt="Avatar" class="com-avatar" />
                  ) : (
                    <img src="/logo192.png" alt="Avatar" class="com-avatar" />
                  )}{" "}
                  <span class="com-name">{community.communityName}</span>
                </CardBody>
              </Card>
            </Col>
          </Row>
        );
      });
    }
    return (
      <div style={{ backgroundColor: "rgb(218,224,230)", height: "1000px" }}>
        <span
          onClick={this.props.closePopUp}
          style={{ float: "right", marginRight: "1%", marginTop: "1%" }}
        >
          <i class="fas fa-times closeButtonIcon"></i>
        </span>
        <div className="post-tabs-container">
          <div class="create-post-header">Your Communities</div>

          <Card style={{ width: "48.7%" }}>
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
                          onChange={this.handleCommunityModCommunityPageSizeChange}
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
                        onChange={this.handleCommunityModSearch}
                      ></Input>
                    </InputGroup>
                  </div>
                </CardBody>
              </Card>
        
            {communities}
            <div className="row">
                <div className="col pagination-class">
                  <ReactPaginate
                    previousLabel={"prev"}
                    nextLabel={"next"}
                    breakLabel={"..."}
                    breakClassName={"break-me"}
                    pageCount={this.state.communityModTotalPages}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={this.handlePageClickCommunityModCommunity}
                    containerClassName={"pagination"}
                    subContainerClassName={"pages pagination"}
                    activeClassName={"active"}
                  />
                </div>
              </div>
          </div>
          <br/>
          <div className="container">
            {checkedCommunityList.length > 0 ? (
              <button
                type="submit"
                className="btn btn-primary"
                onClick={this.bulkCommunityUserRemove}
                style={{ backgroundColor: "#0079d3" }}
              >
                Remove
              </button>
            ) : null}
            </div>
      </div>
    );
  }
}

const matchStateToProps = (state) => {
  console.log("inside matchStatetoProps", state);
  return {
    communityData: state.getCommunityModCommunityListReducer.communityData,
    communityError: state.getCommunityModCommunityListReducer.error,
    communityMessage: state.getCommunityModCommunityListReducer.message,
    bulkDeleteRes: state.bulkCommunityUserRemoveReducer.bulkDeleteRes,
    bulkDeleteError: state.bulkCommunityUserRemoveReducer.error,
    bulkDeleteMessage: state.bulkCommunityUserRemoveReducer.message,
  };
};

const matchDispatchToProps = (dispatch) => {
  return {
    getMyCommunityModCommunityAction: (data) =>
      dispatch(getMyCommunityModCommunityAction(data)),
    bulkCommunityUserRemoveAction: (data) => dispatch(bulkCommunityUserRemoveAction(data)),
  };
};

export default connect(
  matchStateToProps,
  matchDispatchToProps
)(CommunityModCommunityList);

// export default CommunityModCommunityList;
