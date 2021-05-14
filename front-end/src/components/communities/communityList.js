// Created by Priyansh Patel

import React, { Component } from 'react';
import { Card, Button, CardTitle, CardText, CardBody } from 'reactstrap';
import ImageThumbnail from './imageThumbnail';
import './myCommunities.css';
import { v4 as uuidv4 } from 'uuid';
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { BACKEND_URL, BACKEND_PORT } from '../../config/config';
class CommunityList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            communityAvatar: [],
            _id: this.props.data._id,
            communityName: this.props.data.communityName,
            communityAvatar: this.props.data.communityAvatar,
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
        console.log("ImAAAggggeeeEEEE>>>???????????????????>>>>>>>>>", this.props.data)

        if (this.props.data.communityAvatar.length > 1) {
            if (this.state.communityAvatar.length > 1) {
                let avatarAndImages = this.state.communityAvatar
                let onlyImages = avatarAndImages.slice(1)
                // communityImages = onlyImages.map((image) => {
                //     return <imageThumbnail
                //         key = {uuidv4}
                //         data={image}
                //     />
                // })

                communityImages = onlyImages.map((data, index) => (
                    <div style={{ marginBottom: "5px" }}>
                        <Slide index={index}>
                            <img src={data} height="100%" width="100%" style={{ position: "absolute" }} alt="" />
                        </Slide>
                    </div>
                ))
            }
        }

        return (
            <Card>
                <CardBody class="com-card">
                    <img src={this.state.communityAvatar[0]} alt="Avatar" class="com-avatar" /> <span class="com-name">r/{this.state.communityName}</span>
                    <button type="button" onClick={this.props.editButtonClicked.bind(this, this.state)} style={{ borderColor: "#0079d3", color: "rgb(0, 121, 211)", borderRadius: "60px", marginLeft: "1%", float: "right" }} class="btn btn-outline-primary"><span style={{ fontSize: "16px", fontWeight: "300px" }}><strong>EDIT</strong></span></button>

                    <Link className="btn btn-primary" style={{ color: "#0079d3", color: "white", borderRadius: "60px", }} to={{
                        pathname: "/invitations", state: {
                            communityData: this.state,
                        }
                    }}>INVITE</Link>                    <br />
                    <button type="button" onClick={this.props.removeButtonClicked.bind(this, this.state)} style={{ borderColor: "#0079d3", color: "rgb(0, 121, 211)", borderRadius: "60px", marginLeft: "1%", float: "right" }} class="btn btn-outline-primary"><span style={{ fontSize: "16px", fontWeight: "300px" }}><strong>Remove</strong></span></button>

                    <span className="com-desc">{this.state.description}</span>
                    <br />
                    {/* <span className="com-details"><i class="fas fa-users"></i> {this.state.members.length}</span> */}
                    {/* <span className="com-details"><i class="fas fa-copy"></i> {this.state.posts.length}</span> */}
                    {/* {communityImages} */}
                    <CarouselProvider
                        naturalSlideWidth={200}
                        naturalSlideHeight={200}
                        totalSlides={this.state.communityAvatar.length - 1}
                    >
                        <ButtonBack style={{ border: "none", backgroundColor: "white", fontSize: "40px", float: "left", marginTop: "30%" }}>&#60;</ButtonBack>
                        <ButtonNext style={{ border: "none", backgroundColor: "white", float: "right", marginTop: "30%", fontSize: "40px", }}>&#62;</ButtonNext>
                        <Slider>

                            {communityImages}
                        </Slider>

                    </CarouselProvider>
                </CardBody>
            </Card>
        )
    }
}
export default CommunityList;