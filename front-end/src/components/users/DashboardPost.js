// author : Het Brahmbhatt
import React, { Component } from 'react'
import Navbar from '../navbar/navbar';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import {
    Card, CardText, CardBody,
} from 'reactstrap';
import ReactPaginate from 'react-paginate';

import { connect } from "react-redux";
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import '../community/Post.css'
import { Row, Col, CardTitle } from 'reactstrap';
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';
import moment from 'moment'
import Comment from '../community/Comment'
import { Button } from '@material-ui/core';
import createCommentAction from '../../actions/comment/createCommentAction';
import getPostAction from '../../actions/posts/getPostAction';
import upvotePostAction from '../../actions/posts/upVoteAction';
import downVotePostAction from '../../actions/posts/downVoteAction';
import ModeCommentTwoToneIcon from '@material-ui/icons/ModeCommentTwoTone';
import { Link } from 'react-router-dom';

const newLocal = "103%";
class DashboardPost extends Component {
    constructor(props) {
        super(props);
        console.log(this.props.data);
        console.log(this.props)
        this.state = {
            post_id: this.props.data._id,
            community_id: this.props.data.community._id,
            communityName: this.props.data.community.communityName,
            createdAt: this.props.data.createdAt,
            images: this.props.data.images,
            numberOfComments: this.props.data.numberOfComments,
            updatedAt: this.props.data.updatedAt,
            voteStatus: this.props.data.voteStatus,
            votes: this.props.data.votes,
            title: this.props.data.title,
            type: this.props.data.type,
            score: 0,
            vote: 0,
            userData: this.props.data.createdBy,
            description: this.props.data.description,
            comments: this.props.data.comments,
            firstCommentDescription: "",
            commentFlag: false,
            createdBy: this.props.data.createdBy.name,
            link: this.props.data.link
        }
    };
    handleDescriptionChange = (e) => {
        this.setState(
            {
                firstCommentDescription: e.target.value
            }
        )
    }


    vote(type) {
        this.setState(state => ({
            vote: state.vote === type ? 0 : type
        }));
    }

    upVote = (e) => {
        let upVoteObj = {
            post_id: this.state.post_id,
            community_id: this.state.community_id
        }
        this.props.upvotePostAction(upVoteObj).then(response => {
            console.log(this.props.getDataPost.post);

            this.setState(
                {
                    votes: this.props.getDataPost.post.votes
                }
            )
        })
    }
    downVote = (e) => {
        let downVoteObj = {
            post_id: this.state.post_id,
            community_id: this.state.community_id
        }
        this.props.downVotePostAction(downVoteObj).then(response => {

            this.setState(
                {
                    votes: this.props.getDownVoteDataPost.post.votes
                }
            )
        })
    }
    handleFirstCommentSubmit = (e) => {
        e.preventDefault();
        let obj = {
            "description": this.state.firstCommentDescription,
            "post_id": this.state.post_id,
            "community_id": this.state.community_id
        }
        this.props.createCommentAction(obj).then(response => {
            // this.props.refreshComments();
        })
    }
    commentsClicked = inp => {
        this.setState({
            commentFlag: !this.state.commentFlag
        })
    }
    displayComments = (allComments) => {
        let comments = []
        console.log("here")
        for (let comment of Object.values(allComments)) {
            comments.push(<Comment
                commentData={comment}
                key={comment._id}
                community_id={this.state.community_id}
                post_id={this.state.post_id}
                addComment={this.addComment}
            />)
            if (comment.children && Object.keys(comment.children).length > 0) {
                let replies = this.displayComments(comment.children)
                comments = comments.concat(replies)
            }
        }
        return comments
    }
    render() {
        console.log(this.state)
        let comments = this.displayComments(this.state.comments)
        let replyActionsStyle = { backgroundColor: '#CCC', margin: "5px 0 0 5px", lineHeight: "1" };

        console.log(this.state)
        const vote = this.state.vote;
        const score = this.state.score;
        let postDivision = null;
        let avatarImageDivision = this.state.images.map((data, index) => (
            <div style={{ marginBottom: "5px" }}>
                <Slide index={index}>
                    <img src={data} height="100%" width="100%" style={{ position: "absolute" }} alt="" />

                </Slide>
            </div>
        ))
        if (this.state.type == "image") {
            postDivision =
                <div>
                    <Card >
                        <Row>
                            <Col xs="1" style={{ backgroundColor: "#F5F5F5" }}>
                                <ArrowUpwardIcon style={{ cursor: "pointer" }} onClick={this.upVote} />
                                <span style={{ paddingLeft: "6px" }}> {this.state.votes}</span>
                                <ArrowDownwardIcon style={{ cursor: "pointer" }} onClick={this.downVote} />

                            </Col>
                            <Col style={{ paddingLeft: "0px" }}>
                                <span style={{ color: "#787C7E", fontSize: "12px", marginLeft: "4%" }}><span style={{ color: "black", fontWeight: "1000" }}>r/ {this.state.communityName} &bull;

                                </span >                                <span style={{ color: "#787C7E", fontSize: "12px", marginLeft: "3%" }} >  Posted by u/
                        <Link style={{ color: "black" }} to={{
                                            pathname: "/users/profile-page", state: {
                                                userData: this.state.userData
                                            }
                                        }}>{this.state.createdBy}</Link>&nbsp;{moment.utc(this.state.createdAt).local().startOf('seconds').fromNow()}

                                    </span>

                                </span>

                                <CardTitle tag="h5" style={{ marginLeft: "7%", marginTop: "5px" }}>{this.state.title}</CardTitle>
                                <div style={{ marginBottom: "5px" }}>
                                    <CarouselProvider
                                        naturalSlideWidth={200}
                                        naturalSlideHeight={200}
                                        totalSlides={this.state.images.length}
                                    >
                                        <ButtonBack style={{ border: "none", backgroundColor: "white", fontSize: "40px", float: "left", marginTop: "30%" }}>&#60;</ButtonBack>
                                        <ButtonNext style={{ border: "none", backgroundColor: "white", float: "right", marginTop: "30%", fontSize: "40px", }}>&#62;</ButtonNext>
                                        <Slider>

                                            {avatarImageDivision}
                                        </Slider>

                                    </CarouselProvider>
                                </div>
                            </Col>
                        </Row>
                        <Row style={{ backgroundColor: "#F5F5F5", height: "30px", width: "103%", paddingLeft: "10%" }}>
                            <Button
                                size="small"
                                onClick={this.commentsClicked}
                            >
                                <ModeCommentTwoToneIcon style={{ fontSize: "18px" }} />
                                <span style={{ fontSize: "12px", fontWeight: "300px", textTransform: "capitalize" }}>
                                    {this.state.numberOfComments} Comments
                            </span>
                            </Button></Row>
                    </Card>
                </div>
        }
        else if (this.state.type == "text") {
            postDivision =
                <div>
                    <Card >
                        <Row>
                            <Col xs="1" style={{ backgroundColor: "#F5F5F5" }}>
                                <ArrowUpwardIcon style={{ cursor: "pointer" }} onClick={this.upVote} />
                                <span style={{ paddingLeft: "6px" }}> {this.state.votes}</span>
                                <ArrowDownwardIcon style={{ cursor: "pointer" }} onClick={this.downVote} />
                            </Col>

                            <Col>

                                <span style={{ color: "#787C7E", fontSize: "12px", marginLeft: "4%" }}><span style={{ color: "black", fontWeight: "1000" }}>r/ {this.state.communityName} &bull;

</span >                                <span style={{ color: "#787C7E", fontSize: "12px", marginLeft: "3%" }} >  Posted by u/
<Link style={{ color: "black" }} to={{
                                            pathname: "/users/profile-page", state: {
                                                userData: this.state.userData
                                            }
                                        }}>{this.state.createdBy}</Link>&nbsp;{moment.utc(this.state.createdAt).local().startOf('seconds').fromNow()}

                                    </span>

                                </span>
                                <CardBody>
                                    <CardTitle tag="h5">{this.state.title}</CardTitle>
                                    <CardText>{this.state.description}</CardText>
                                </CardBody>     </Col>
                        </Row>
                        <Row style={{ backgroundColor: "#F5F5F5", height: "30px", width: "103%", paddingLeft: "10%" }}>
                            <Button
                                size="small"
                                onClick={this.commentsClicked}
                            >
                                <ModeCommentTwoToneIcon style={{ fontSize: "18px" }} />
                                <span style={{ fontSize: "12px", fontWeight: "300px", textTransform: "capitalize" }}>
                                    {this.state.numberOfComments} Comments
                            </span>
                            </Button></Row>
                    </Card>
                </div>

        }
        else if (this.state.type == "link") {
            postDivision = <Card >
                <Row>
                    <Col xs="1" style={{ backgroundColor: "#F5F5F5" }}>
                        <ArrowUpwardIcon style={{ cursor: "pointer" }} onClick={this.upVote} />
                        <span style={{ paddingLeft: "6px" }}> {this.state.votes}</span>
                        <ArrowDownwardIcon style={{ cursor: "pointer" }} onClick={this.downVote} />

                    </Col>

                    <Col>
                        <span style={{ color: "#787C7E", fontSize: "12px", marginLeft: "4%" }}><span style={{ color: "black", fontWeight: "1000" }}>r/ {this.state.communityName} &bull;

</span >                                <span style={{ color: "#787C7E", fontSize: "12px", marginLeft: "3%" }} >  Posted by u/
<Link style={{ color: "black" }} to={{
                                    pathname: "/users/profile-page", state: {
                                        userData: this.state.userData
                                    }
                                }}>{this.state.createdBy}</Link>&nbsp;{moment.utc(this.state.createdAt).local().startOf('seconds').fromNow()}

                            </span>

                        </span>
                        <CardBody>
                            <CardTitle tag="h5">{this.state.title}</CardTitle>
                            <CardText>
                                <a href={this.state.link}>{this.state.link}</a>
                            </CardText>
                        </CardBody>
                    </Col>
                </Row>
                <Row style={{ backgroundColor: "#F5F5F5", height: "30px", width: newLocal, paddingLeft: "10%" }}>
                    <Button
                        size="small"
                        onClick={this.commentsClicked}
                    >
                        <ModeCommentTwoToneIcon style={{ fontSize: "18px" }} />
                        <span style={{ fontSize: "12px", fontWeight: "300px", textTransform: "capitalize" }}>
                            {this.state.numberOfComments} Comments
                            </span>
                    </Button></Row>
            </Card >
        }
        return (
            <div style={{ marginTop: "10%" }}>
                {postDivision}

                {
                    this.state.commentFlag ?
                        <div className="comment" style={{ backgroundColor: "white" }}>
                            <textarea style={{ marginLeft: "12%", marginTop: "5%" }} id="w3review" placeholder="What are your thoughts?" name="description" onChange={this.handleDescriptionChange} rows="2" cols="30" />
                            <div style={{ marginLeft: "12%" }} className="comment-action">
                                <Button size="small" variant="contained" style={replyActionsStyle} onClick={this.handleFirstCommentSubmit}>Submit</Button>
                                <Button size="small" variant="contained" style={replyActionsStyle} onClick={this.replyButtonClicked}>Cancel</Button>
                            </div>
                            {comments}
                        </div> : ""
                }


            </div >
        )
    }
}
const matchStateToProps = (state) => {
    console.log("inside matchStatetoProps", state)
    return {
        postData: state.createCommunityReducer.postData,
        message: state.createCommunityReducer.message,
        getPostData: state.getPostByIDReducer.getPostData,
        getDataPost: state.upvotePostReducer.getDataPost,
        getDownVoteDataPost: state.downVotePostReducer.getDownvoteDataPost,

    }

}

const matchDispatchToProps = (dispatch) => {
    return {
        createCommentAction: (data) => dispatch(createCommentAction(data)),
        getPostAction: (data) => dispatch(getPostAction(data)),
        upvotePostAction: (data) => dispatch(upvotePostAction(data)),
        downVotePostAction: (data) => dispatch(downVotePostAction(data)),


    }
}

export default connect(matchStateToProps, matchDispatchToProps)(DashboardPost)
