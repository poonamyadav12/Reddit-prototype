// Created by Priyansh Patel

import React, { Component } from "react";
import { Card, Button, CardTitle, CardText, CardBody } from "reactstrap";
import "./myCommunities.css";
import CommunityModUsersList from "./communityModUsersList";
import Modal from "react-modal";

const customStyles = {
  content: {
    top: "40%",
    left: "50%",
    right: "auto",
    // bottom: "auto",
    marginRight: "-50%",
    height: "500px",
    width: "1280px",
    transform: "translate(-50%, -50%)",
  },
};

class CommunityModList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      communityAvatar: this.props.data.communityAvatar,
      communityId: this.props.data._id,
      communityName: this.props.data.communityName,
      description: this.props.data.description,
      totalRequests: this.props.data.totalRequests,
      usersPopUp: false,
    };
  }

  componentDidMount() {
    console.log("-=-=-=-=-=-inside community mod lissstttt=-=-=-=-=-=-=-=-=-=-", this.props);
  }

  toggleUsersList = () => {
    this.setState({
      usersPopUp: !this.state.usersPopUp,
    });
  };

  render() {
    return (
      <div>
        <Card>
          <CardBody class="com-card" onClick={this.toggleUsersList}>
            {this.state.communityAvatar ? (
              <img
                src={this.state.communityAvatar}
                alt="Avatar"
                class="com-avatar"
              />
            ) : null}{" "}
            <span class="com-name">r/{this.state.communityName}</span>
            <br />
            <span className="com-desc">{this.state.description}</span>
            <br />
            <span className="com-details">
              <i class="fas fa-users"></i> {this.state.totalRequests}
            </span>
          </CardBody>
        </Card>
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
export default CommunityModList;
