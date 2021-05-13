// Created by Priyansh Patel

import React, { Component } from 'react';
import { Card, Button, CardTitle, CardText, CardBody } from 'reactstrap';
import ImageThumbnail from './imageThumbnail';
import './myCommunities.css';
import { v4 as uuidv4 } from 'uuid';

class CommunityList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            communityAvatar: this.props.data.communityAvatar,
            communityId: this.props.data.communityId,
            communityName: this.props.data.communityName,
            // communityCover: this.props.communityCover,
            description: this.props.data.description,
            // members: this.props.data.members,
            // posts: this.props.data.posts,
        }
    }

    componentDidMount() {
        console.log("----------inside list component-------------", this.props);
    }

    render() {

        let communityImages = <div>No images to show</div>
        // console.log("PROPS>>>>>>>>>>>>", this.props)

        // if (this.props.communityAvatar.length !== 0) {
        //     if (this.state.communityAvatar.length !== 0) {
        //         communityImages = this.props.communityAvatar.map((image) => {
        //             return <imageThumbnail
        //                 key = {uuidv4}
        //                 data={image}
        //             />
        //         })
        //     }
        // }

        return (
            <Card>
                <CardBody class="com-card">
                    <img src={this.state.communityAvatar} alt="Avatar" class="com-avatar" /> <span class="com-name">r/{this.state.communityName}</span>
                    <button type="button" onClick={this.props.removeButtonClicked.bind(this, this.state)} style={{ borderColor: "#0079d3", color: "rgb(0, 121, 211)", borderRadius: "60px", marginLeft: "1%", float: "right"}} class="btn btn-outline-primary"><span style={{ fontSize: "16px", fontWeight: "300px" }}><strong>Remove</strong></span></button>
                    <button type="button" onClick={this.props.editButtonClicked.bind(this, this.state)} style={{ borderColor: "#0079d3", color: "white", borderRadius: "60px", marginLeft: "10%", float: "right"}} class="btn btn-primary"><span style={{ fontSize: "16px", fontWeight: "300px" }}><strong>Edit</strong></span></button>
                    <br/>
                    <span className="com-desc">{this.state.description}</span>
                    <br/>
                    {/* <span className="com-details"><i class="fas fa-users"></i> {this.state.members.length}</span> */}
                    {/* <span className="com-details"><i class="fas fa-copy"></i> {this.state.posts.length}</span> */}
                    {communityImages}
                </CardBody>
            </Card>
        )
    }
}
export default CommunityList;