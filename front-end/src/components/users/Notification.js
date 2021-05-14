import * as React from "react";
import { Chart } from "react-google-charts";
import axios from 'axios';
import { BACKEND_URL, BACKEND_PORT } from '../../config/config';
import cookie from "react-cookies";
import { Card, Container, Dropdown, Form, ListGroup, Row, Col, Button, NavLink } from 'react-bootstrap';
import _ from "lodash";
import Navbar from "../navbar/navbar";
import { Link, Redirect } from 'react-router-dom';

class Notification extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      response: null,
      error: null
    };
  }
  async componentDidMount() {
    await this.fetchData();
  }
  async fetchData() {
    axios.defaults.headers.common["authorization"] = cookie.load('token')
    axios.defaults.withCredentials = true;
    let queryUrl = `${BACKEND_URL}:${BACKEND_PORT}/user/notifications`;
    const response = await axios.get(queryUrl);
    console.log("ResponseN ", JSON.stringify(response.data.notifications));
    this.setState({
      response: response.data.notifications,
      error: null
    })
  }

  async updateInvitation(invitationId, status) {
    const data = {
      invitation_id: invitationId,
      status: status,
    };
    try {
      let queryUrl = `${BACKEND_URL}:${BACKEND_PORT}/user/invite/update`;
      axios.defaults.headers.common["authorization"] = cookie.load('token')
      axios.defaults.withCredentials = true;
      console.log("token", cookie.load('token'));
      console.log("datafot", JSON.stringify(data));
      const responseForInvite = await axios.post(queryUrl, data);
      console.log("Invite ", JSON.stringify(responseForInvite));
      this.forceReload();
      console.log("IdX ", invitationId);
    } catch (error) {
      this.setState({
        error: "Some Error Occured"
      })
    }
  }
  forceReload() {
    this.fetchData();
  }
  render() {
    const pendingNotifications = _.filter(this.state.response, (notification) => {
      return notification.status === 'PENDING_INVITE';
    });
    console.log("Invited notifications ", pendingNotifications);
    return (
      <>
        { !cookie.load('token') ? window.location.href = '/' : null}
        <Navbar />
        <Container fluid={true}>
          {this.state.error &&
            <div class="alert alert-danger" role="alert" style={{ width: "100%" }}>{this.state.error}</div>}
          <Container>
            <h2>My Invitations</h2>
          </Container>
          <Container>
            <h4> Community Invites</h4>
            <ListGroup variant='flush'>
              {pendingNotifications.length > 0 ? (
                pendingNotifications.map((notification) => {

                  return (
                    <ListGroup.Item key={notification._id}>
                      <div style={{ display: "flex" }}>
                        <div style={{ flex: "0 1 70%" }}>
                          <div className="h4">{notification.community.communityName}</div>
                          <div>{notification.community.description}</div>
                        </div>
                        <Button variant="success" style={{ marginRight: "1rem", height: "2.5rem" }}
                          onClick={() => this.updateInvitation(notification._id, "ACCEPTED_INVITE")}>Accept</Button>
                        <Button variant="danger" style={{ marginRight: "1rem", height: "2.5rem" }}
                          onClick={() => this.updateInvitation(notification._id, "REJECTED_INVITE")}>Decline</Button>
                      </div>
                    </ListGroup.Item>
                  );
                })
              ) : (
                <ListGroup.Item>
                  <h5>No Invites.</h5>
                </ListGroup.Item>
              )}
            </ListGroup>
          </Container>
        </Container>
      </>
    )
  }

}
export default Notification;