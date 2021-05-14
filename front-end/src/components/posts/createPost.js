// TO-DO (Priyansh Patel)
// - Redirect to community page on post creation (Commented in the code below)
// - Error display

import React, { Component } from 'react'
import { TabContent, TabPane, Nav, NavItem, NavLink, Card, Button, CardTitle, CardText, Row, Col, FormGroup } from 'reactstrap';
import { Form, Label, Input, FormText } from 'reactstrap';

import Navbar from '../navbar/navbar';

//import Navbar from '../Navbar/Navbar';

import classnames from 'classnames';
import ImageUploader from 'react-images-upload';
import './createPost.css';
import createPostAction from '../../actions/createPostAction';
import { connect } from "react-redux";

class CreatePost extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeTab: '1',
            pictures: [],
            type: "text",
            title: "",
            description: "",
            link: "",
            communityId: this.props.match.params.id,
            createPostBackendError: false
        }
        this.onDrop = this.onDrop.bind(this);
    }

    onDrop = (picture) => {
        this.setState({
            pictures: this.state.pictures.concat(picture)
        })
    }

    setActiveTab = (tab) => {
        this.setState({
            activeTab: tab
        })
    }

    toggleTab = (tab) => {
        if (this.state.activeTab !== tab) this.setActiveTab(tab)
        if (tab === '1') {
            //text
            this.setState({
                type: "text",
                pictures: [],
                link: ""
            })
        }
        else if (tab === '2') {
            //image
            this.setState({
                type: "image",
                description: ""
            })
        } else {
            //link
            this.setState({
                type: "link",
                pictures: [],
                description: ""
            })
        }
    }

    handleTitleChange = (e) => {
        this.setState({
            title: e.target.value
        })
    }
    handleOtherChange = inp => {
        {
            this.setState({
                [inp.target.name]: inp.target.value,
                error: false
            })
        }

    }
    handleDescriptionChange = (e) => {
        this.setState({
            description: e.target.value
        })
    }

    handleUrlChange = (e) => {
        this.setState({
            link: e.target.value
        })
    }

    handleCreatePost = (e) => {
        e.preventDefault();
        console.log(this.state)
        this.props.createPostAction(this.state).then(response => {
            if (this.props.error) {
                this.setState({
                    createPostBackendError: true
                })
            } else {
                // TODO :Redirect to community page
            }
        })
    }

    render() {
        return (
            <div>
                <div><Navbar /></div>
                <div style={{ backgroundColor: "rgb(218,224,230)", height: "1000px" }}>
                    <div className="post-tabs-container">
                        <div class="create-post-header">
                            Create a post
                    </div>
                        <Nav tabs>
                            <NavItem>
                                <NavLink
                                    className={classnames({ active: this.state.activeTab === '1' })}
                                    onClick={() => { this.toggleTab('1'); }}
                                >
                                    Post
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink
                                    className={classnames({ active: this.state.activeTab === '2' })}
                                    onClick={() => { this.toggleTab('2'); }}
                                >
                                    Images
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink
                                    className={classnames({ active: this.state.activeTab === '3' })}
                                    onClick={() => { this.toggleTab('3'); }}
                                >
                                    Link
                                </NavLink>
                            </NavItem>
                        </Nav>
                        <TabContent activeTab={this.state.activeTab}>
                            <TabPane tabId="1">
                                <Row>
                                    <Col sm="6">
                                        <Card body>
                                            <div>
                                                <Form method="post" onSubmit={this.handleCreatePost}>
                                                    <FormGroup>
                                                        <Input type="text" name="title" id="title" placeholder="Title" onChange={this.handleOtherChange} maxlength="180" required />
                                                    </FormGroup>
                                                    <FormGroup>
                                                        <Input type="textarea" name="description" id="description" placeholder="Text" onChange={this.handleOtherChange} maxlength="180" required />
                                                    </FormGroup>
                                                    <button type="submit" class="btn btn-outline-primary post-button" onSubmit={this.handleCreatePost}><span style={{ fontSize: "16px", fontWeight: "300px" }}><strong>Post</strong></span></button>
                                                </Form>
                                            </div>
                                        </Card>
                                    </Col>
                                </Row>
                            </TabPane>
                            <TabPane tabId="2">
                                <Row>
                                    <Col sm="6">
                                        <Card body>
                                            <Form method="post" onSubmit={this.handleCreatePost}>
                                                <FormGroup>
                                                    <Input type="text" name="title" id="title" onChange={this.handleOtherChange} placeholder="Title" maxlength="180" required />
                                                    <ImageUploader
                                                        withIcon={true}
                                                        buttonText='Choose images'
                                                        onChange={this.onDrop}
                                                        imgExtension={['.jpg', '.gif', '.png', '.gif', '.jpeg']}
                                                        maxFileSize={5242880}
                                                    />
                                                </FormGroup>

                                                <button type="submit" class="btn btn-outline-primary post-button"><span style={{ fontSize: "16px", fontWeight: "300px" }} onSubmit={this.handleCreatePost}><strong>Post</strong></span></button>
                                            </Form>
                                        </Card>
                                    </Col>
                                </Row>
                            </TabPane>
                            <TabPane tabId="3">
                                <Row>
                                    <Col sm="6">
                                        <Card body>
                                            <div>
                                                <Form onSubmit={this.handleCreatePost}>
                                                    <FormGroup>
                                                        <Input type="text" name="title" id="title" onChange={this.handleOtherChange} placeholder="Title" maxlength="180" required />
                                                    </FormGroup>
                                                    <FormGroup>
                                                        <Input type="url" name="link" id="link" onChange={this.handleOtherChange} placeholder="Url" required />
                                                    </FormGroup>
                                                    <button type="submit" class="btn btn-outline-primary post-button"><span style={{ fontSize: "16px", fontWeight: "300px" }} onSubmit={this.handleCreatePost}><strong>Post</strong></span></button>
                                                </Form>
                                            </div>
                                        </Card>
                                    </Col>
                                </Row>
                            </TabPane>
                        </TabContent>
                    </div>
                </div>
            </div>
        )
    }
}

const matchStateToProps = (state) => {
    return {
        error: state.createPostReducer.error,
        message: state.createPostReducer.message,
    }

}

const matchDispatchToProps = (dispatch) => {
    return {
        createPostAction: (data) => dispatch(createPostAction(data)),
    }
}

export default connect(matchStateToProps, matchDispatchToProps)(CreatePost)