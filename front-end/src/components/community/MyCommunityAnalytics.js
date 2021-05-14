import * as React from "react";
import { Chart } from "react-google-charts";
import axios from 'axios';
import { BACKEND_URL, BACKEND_PORT } from '../../config/config';
import cookie from "react-cookies";
import { Card, Container, Dropdown, Form, ListGroup, Row, Col } from 'react-bootstrap';
import _ from "lodash";
import Navbar from "../navbar/navbar";

const data = [
  ["Year", "Visitations", { role: "style" }],
  ["2010", 10, `color: ${getRandomColor()}`],
  ["2020", 14, `color: ${getRandomColor()}`],
  ["2030", 16, `color: ${getRandomColor()}`],
  ["2040", 22, `color: ${getRandomColor()}`],
  [
    "2050",
    28,
    `color: ${getRandomColor()}`
  ]
];
const pieOptions = {
  title: "",
  pieHole: 0.6,
  slices: [
    {
      color: "#2BB673"
    },
    {
      color: "#d91e48"
    },
    {
      color: "#007fad"
    },
    {
      color: "#e9a227"
    }
  ],
  legend: {
    position: "bottom",
    alignment: "center",
    textStyle: {
      color: "233238",
      fontSize: 14
    }
  },
  tooltip: {
    showColorCode: true
  },
  chartArea: {
    left: 0,
    top: 0,
    width: "100%",
    height: "80%"
  },
  fontName: "Roboto"
};
function getRandomColor() {
  var letters = '0123456789ABCDEF'.split('');
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
class MyCommunityAnalytics extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      numberOfUsers: null,
      numberOfPosts: null,
      numberOfVotes: null,
      maxPostsUserPerCommunity: null,
      communityWithMaxPost: null,
    };
  }
  async componentDidMount() {
    await this.fetchData();
  }

  async fetchData() {
    axios.defaults.headers.common["authorization"] = cookie.load('token')
    axios.defaults.withCredentials = true;
    let queryUrl = `${BACKEND_URL}:${BACKEND_PORT}/user/myCommunityAnalytics`;
    console.log("Query URL", queryUrl);
    const response = await axios.get(queryUrl);
    console.log("Response ", JSON.stringify(response));
    let myAnalyticsData = response.data;
    console.log("Modified data 1", myAnalyticsData);
    let modifiedDataForUsers = [];
    let modifiedDataForPosts = [];
    let modifiedDataForVotes = [];
    let maxPostsUserPerCommunity = [];

    modifiedDataForUsers.push(["Community", "Number Of Users", { role: "style" }]);
    modifiedDataForPosts.push(["Community", "Number Of Posts", { role: "style" }]);
    modifiedDataForVotes.push(["Community", "Most upvoted post", { role: "style" }, { role: 'annotation' }]);
    maxPostsUserPerCommunity.push(["Community", "User With Highest Post", { role: "style" }, { role: 'annotation' }]);

    if (myAnalyticsData) {
      let communityWithMaxPost = _.maxBy(myAnalyticsData, (c) => c.numberOfPosts);
      for (var i = 0; i < myAnalyticsData.length; i++) {
        let name = myAnalyticsData[i].communityName;
        let numberOfUsers = myAnalyticsData[i].numberOfUsers;
        let numberOfPosts = myAnalyticsData[i].numberOfPosts;
        let maxPosts = _.maxBy(Object.values(_.groupBy(myAnalyticsData[i].posts, (p) => p.createdBy._id)), (v) => v.length);
        let mostUpvotedPost = _.maxBy(myAnalyticsData[i].posts, (v) => v.votes);
        modifiedDataForUsers.push([name, numberOfUsers, `color: ${getRandomColor()}`])
        modifiedDataForPosts.push([name, numberOfPosts, `color: ${getRandomColor()}`])
        modifiedDataForVotes.push([name, mostUpvotedPost?.votes || 0, `color: ${getRandomColor()}`, mostUpvotedPost?.title || ''])
        maxPostsUserPerCommunity.push([name, maxPosts ? maxPosts.length : 0, `color: ${getRandomColor()}`, maxPosts ? maxPosts[0].createdBy.name : ''])
      }
      this.setState({
        numberOfUsers: modifiedDataForUsers,
        numberOfPosts: modifiedDataForPosts,
        mostUpvotedPost: modifiedDataForVotes,
        maxPostsUserPerCommunity: maxPostsUserPerCommunity,
        communityWithMaxPost
      })
    }

  }

  render() {
    return (
      <>
        <div>
          {!cookie.load('token') ? window.location.href = '/' : null}
          <Navbar />
        </div>
        {this.state.communityWithMaxPost ? <div style={{ textAlign: "right", marginRight: "10rem" }}><h5> Community with max posts <b>{`${this.state.communityWithMaxPost.communityName}`}</b> <br></br>Number of posts = <b>{`${this.state.communityWithMaxPost.numberOfPosts}`}</b>  </h5></div> : <h5>No community with max posts yet</h5>}
        <Row>
          <Col lg={6}>
            {this.state.numberOfUsers && this.state.numberOfUsers.length > 1 ? (
              <div className="App">
                <Chart chartType="ColumnChart" width="100%" height="400px" data={this.state.numberOfUsers} options={{ is3D: true }} />
              </div>)
              : this.state.mostUpvotedPost ? (
                <h4>No Number of users per community yet.</h4>
              ) : null}
          </Col>
          <Col lg={6}>
            {this.state.mostUpvotedPost && this.state.mostUpvotedPost.length > 1 ? (
              <div className="App">
                <Chart chartType="ColumnChart" width="100%" height="400px" data={this.state.numberOfPosts} />
              </div>)
              : this.state.mostUpvotedPost ? (
                <h4>No Number of post per community yet.</h4>
              ) : null}
          </Col>
        </Row>
        <Row>
          <Col lg={6}>
            {this.state.mostUpvotedPost && this.state.mostUpvotedPost.length > 1 ? (
              <div className="App">
                <Chart chartType="ColumnChart" width="100%" height="400px" data={this.state.mostUpvotedPost} />
              </div>) : this.state.mostUpvotedPost ? (
                <h4>No Most Upvoted posts yet.</h4>
              ) : null}
          </Col>
          <Col lg={6}>
            {this.state.maxPostsUserPerCommunity && this.state.maxPostsUserPerCommunity.length > 1 ? (
              <div className="App">
                <Chart chartType="ColumnChart" width="100%" height="400px" data={this.state.maxPostsUserPerCommunity} />
              </div>) : this.state.maxPostsUserPerCommunity ? (
                <h4>No Maximum Posts per user yet.</h4>
              ) : null}
          </Col>
        </Row>
      </>
    );
  }
}
export default MyCommunityAnalytics;
