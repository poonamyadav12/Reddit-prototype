import React, { Component } from 'react'
import './profile.css'
import Select from 'react-select'
import { BACKEND_URL } from '../../config/config';
import { BACKEND_PORT } from '../../config/config';
import updateUserProfileAction from '../../actions/userUpdateAction';
import userGetByIDAction from '../../actions/userGetByIDAction';
import { connect } from "react-redux";
//import Navbar from "../Navbar/Navbar";

import cookie from "react-cookies";
import Navbar from "../navbar/navbar";
import ReactDOM from 'react-dom';
import { WithContext as ReactTags } from 'react-tag-input';
import { displayName } from 'react-grid-gallery';
// import TagsInput from 'react-tagsinput'

const KeyCodes = {
    comma: 188,
    enter: 13,
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];


//author - Het 
class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            email: "",
            gender: null,
            location: "",
            password: "",
            description: "",
            error: false,
            image: BACKEND_URL + ':' + BACKEND_PORT + '/avatar.jpeg',
            rawImagePath: "",
            wasImageUpdated: false,
            tags: [],
            selectedGenderOption: null,
            profilePicture: null,
            successFlag: false
            // tags: [{ id: "topic1", text: "topic1" },
            // { id: "topic2", text: "topic2" }],
        }
        this.handleTagDelete = this.handleTagDelete.bind(this);
        this.handleTagAddition = this.handleTagAddition.bind(this);
        this.handleDrag = this.handleDrag.bind(this);
    }
    componentDidMount() {
        document.title = "Profile"
        this.props.userGetByIDAction(cookie.load('userId')).then(response => {
            console.log("get profile props>>>>>>>>>>>>>>>>", this.props)
            console.log("USER PROFILE ------------------------- ", this.props.getByIDuserData.data.user)
            let tagObjArr = []
            let tagObj = {}
            for (const topic of this.props.getByIDuserData.data.user.topics) {
                tagObj = {}
                tagObj.id = topic
                tagObj.text = topic
                tagObjArr.push(tagObj)
            }
            this.setState({
                name: this.props.getByIDuserData.data.user.name,
                email: this.props.getByIDuserData.data.user.email,
                gender: this.props.getByIDuserData.data.user.gender == undefined ? "" : this.props.getByIDuserData.data.user.gender,
                location: this.props.getByIDuserData.data.user.location == undefined ? "" : this.props.getByIDuserData.data.user.location,
                description: this.props.getByIDuserData.data.user.description == undefined ? "" : this.props.getByIDuserData.data.user.description,
                image: this.props.getByIDuserData.data.user.avatar,
                rawImagePath: this.props.getByIDuserData.data.user.avatar,
                profilePicture: this.props.getByIDuserData.data.user.avatar,
                tags: tagObjArr,
                selectedGenderOption: {
                    value: this.props.getByIDuserData.data.user.gender,
                    label: this.props.getByIDuserData.data.user.gender
                },
            })
        })
    }

    handleTagDelete(i) {
        const { tags } = this.state;
        this.setState({
            tags: tags.filter((tag, index) => index !== i),
        });
    }

    handleTagAddition(tag) {
        let newtags = [...this.state.tags, tag]
        this.setState({
            tags: newtags
        })
    }

    handleDrag(tag, currPos, newPos) {
        const tags = [...this.state.tags];
        const newTags = tags.slice();

        newTags.splice(currPos, 1);
        newTags.splice(newPos, 0, tag);

        this.setState({ tags: newTags });
    }

    handleOtherChange = inp => {
        {
            this.setState({
                [inp.target.name]: inp.target.value
            })
        }

    }
    handleGenderChange = selectedGenderOption => {
        this.setState({
            selectedGenderOption: selectedGenderOption,
            gender: selectedGenderOption.value
        })
    }
    handleImageChange = e => {
        this.setState({
            image: e.target.files[0],
            wasImageUpdated: true,
            profilePicture: URL.createObjectURL(e.target.files[0])
        })
    }

    handleOnSubmit = e => {
        e.preventDefault();
        console.log(this.state);
        let formData = new FormData();
        // Append image if it was updated
        if (this.state.wasImageUpdated) {
            console.log("INSIDE profile pic updated")
            formData.append(
                "profileImage",
                this.state.image,
                this.state.image.name
            );
        } else {
            console.log("INSIDE profile pic existing")
            formData.append("uploadedProfileImage", this.state.rawImagePath);
        }

        // Append other data
        formData.append("userId", cookie.load('userId'))
        formData.append("name", this.state.name);
        formData.append("email", this.state.email);
        formData.append("password", this.state.password);
        formData.append("gender", this.state.gender);
        formData.append("description", this.state.description);
        formData.append("location", this.state.location);
        console.log("Form Data Update User+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+")
        for (var pair of formData.entries()) {
            console.log(pair[0] + ', ' + pair[1]);
        }

        let tagsList = []
        if (this.state.tags !== null) {
            for (const tag of this.state.tags) {
                tagsList.push(tag.text)
            }
        }
        formData.append("topics", tagsList);

        this.props.updateUserProfileAction(formData)
    }
    handleInputChange = inp => {
        // console.log( inp.target.name, inp.target.value );
        if (/[~`!#$@%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(inp.target.value)) {
            this.setState({
                error: true,
                errorMessage: "Special characters not allowed",
                [inp.target.name]: ""
            })
        } else {
            this.setState({
                error: false,
                [inp.target.name]: inp.target.value,
                errorMessage: " "

            })
        }
    }
    render() {
        let renderError = null;
        if (this.props.error) {
            // renderError = <div style={{ 'color': 'red' }}>{this.state.errorMessage}</div>
            renderError = <div class="alert alert-danger" role="alert" style={{ width: "100%" }}>{this.props.message}</div>
        }

        let renderSuccess = null;
        if (this.props.auth) {
            // renderError = <div style={{ 'color': 'red' }}>{this.state.errorMessage}</div>
            renderSuccess = <div class="alert alert-success" role="alert" style={{ width: "100%" }}>{this.props.message}</div>
        }

        const gender = [
            { value: 'Male', label: 'Male' },
            { value: 'Female', label: 'Female' },
            { value: 'Other', label: 'Other' },
        ]

        const { tags } = this.state;

        return (
            <div>
                <div>
                    <Navbar />
                </div>
                <div class="container">
                    <div className="row" >
                        <i class="fa fa-cog fa-fw" style={{ padding: "5px" }}></i>
                        <div className="col-md-6" >User Settings</div>
                        <div className="col-md-1" >&nbsp;</div>
                    </div>
                    <br></br>
                    <div className="row" >
                        <ul >
                            <li><a href="/"><div style={{ color: "#7C7C7C" }}><strong>Account</strong></div></a></li>
                            <li><a href="/"><div style={{ color: "#7C7C7C", borderBottom: "2px solid #0079d3", borderBottomColor: "#0079d3" }}><strong>Profile</strong></div></a></li>
                            <li><a href="/"><div style={{ color: "#7C7C7C" }}><strong>Safety & Privacy</strong></div></a></li>
                            <li><a href="/"><div style={{ color: "#7C7C7C" }}><strong>Feed Settings</strong></div></a></li>
                            <li><a href="/"><div style={{ color: "#7C7C7C" }}><strong>Notifications</strong></div></a></li>
                            <li><a href="/"><div style={{ color: "#7C7C7C" }}><strong>Subscriptions</strong></div></a></li>
                            <li><a href="/"><div style={{ color: "#7C7C7C" }}><strong>Chats and Messages</strong></div></a></li>
                        </ul>
                    </div>
                    <br></br>
                    <div className="row" >
                        <h6 style={{ color: "black" }}>
                            Customize Profile
                        </h6>
                    </div>
                    <div className="row" >
                        <div className="col-10" >
                            <hr />
                        </div>
                    </div>
                    <form onSubmit={this.handleOnSubmit} method="post">
                        <div className="row">
                            <div className="col-2">
                                {/* <img src={this.state.image} width="200" height="200" alt="" /> */}
                                {this.state.profilePicture != null ?
                                    this.state.profilePicture != "" ?
                                        <img src={this.state.profilePicture} width="200" height="200" alt="" />
                                        : <img src={this.state.image} width="200" height="200" alt="" />
                                    : <img src={this.state.image} width="200" height="200" alt="" />}

                                <div className="row"><p style={{ "margin-left": '20px' }}>Change your Avatar</p></div>
                                <div className="row">
                                    <input style={{ "marginLeft": '20px' }} accept="image/x-png,image/gif,image/jpeg" type="file" name="profileImage" onChange={this.handleImageChange} />
                                </div>
                            </div>
                            <div className="col-8" style={{ marginLeft: "15%" }}>
                                <div className="row" >
                                    <div className="col-4">
                                        <h6 style={{ color: "black", marginLeft: "1%" }}>
                                            Name
                                    </h6>

                                    </div>
                                    <div className="col-4">

                                        <h6 style={{ color: "black", marginLeft: "1%" }}>
                                            Change Password
                                    </h6>
                                    </div>
                                </div>
                                <div className="row" >
                                    <div className="col-4">
                                        <input type="text" style={{ width: "100%" }} name="name" placeholder="DISPLAY NAME" onChange={this.handleInputChange} value={this.state.name} required />

                                    </div>
                                    <div className="col-4">
                                        <input type="password" style={{ width: "100%" }} name="password" placeholder="PASSWORD" onChange={this.handleOtherChange} />

                                    </div>
                                </div>
                                <div className="row" style={{ marginTop: "10%" }} >
                                    <div className="col-4">
                                        <h6 style={{ color: "black", marginLeft: "1%" }}>
                                            Gender
                                    </h6>

                                    </div>
                                    <div className="col-4">

                                        <h6 style={{ color: "black", marginLeft: "1%" }}>
                                            Location
                                    </h6>
                                    </div>
                                </div>
                                <div className="row" >
                                    <div className="col-4">
                                        <Select
                                            options={gender}
                                            onChange={this.handleGenderChange}
                                            value={this.state.selectedGenderOption} />
                                    </div>
                                    <div className="col-4">
                                        <input type="text" style={{ width: "100%" }} name="location" placeholder="LOCATION" onChange={this.handleOtherChange} value={this.state.location} />

                                    </div>
                                </div>
                                <div className="row" style={{ marginTop: "10%" }}>
                                    <div className="col-12">
                                        <h6 style={{ color: "black", marginLeft: "1%" }}>
                                            Topics
                                        </h6>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12">
                                        {/* <TagsInput value={this.state.tags} onChange={this.handleTagChange} /> */}
                                        <div>
                                            <ReactTags tags={tags}
                                                handleDelete={this.handleTagDelete}
                                                handleAddition={this.handleTagAddition}
                                                handleDrag={this.handleDrag}
                                                delimiters={delimiters}
                                                value={this.state.tags}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <br></br>
                        <br></br>
                        <br></br>
                        <div className="row" >
                            <h6 style={{ color: "black", marginLeft: "1%" }}>
                                Description(Optional)
                        </h6>
                        </div>
                        <br></br>
                        <div className="row" >
                            <div className="col-7">
                                <textarea id="w3review" name="description" value={this.state.description} onChange={this.handleOtherChange} rows="4" cols="76">
                                </textarea>
                            </div>
                        </div>
                        <div style={{ marginLeft: "40%", marginTop: "2%" }}>
                            <button type="submit" className="btn btn-danger" style={{ backgroundColor: "#0079d3" }} onSubmit={this.handleOnSubmit} value={this.state.description}>Save</button>
                        </div>
                    </form>
                    <div className="row" style={{ marginTop: "1%" }}>
                        {renderError}
                        {renderSuccess}
                    </div>
                </div>
            </div>
        )
    }
}

const matchStateToProps = (state) => {
    console.log("inside matchStatetoProps", state)
    return {
        user: state.userUpdateReducer.userData,
        getByIDuserData: state.userGetByIDReducer.getByIDuserData,
        error: state.userUpdateReducer.error,
        message: state.userUpdateReducer.message,
        auth: state.userUpdateReducer.auth,
    }

}
const matchDispatchToProps = (dispatch) => {
    return {
        updateUserProfileAction: (data) => dispatch(updateUserProfileAction(data)),
        userGetByIDAction: (data) => dispatch(userGetByIDAction(data))
    }
}

export default connect(matchStateToProps, matchDispatchToProps)(Profile)
