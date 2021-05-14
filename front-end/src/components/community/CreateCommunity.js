//author-Het 
import React, { Component } from 'react'
import community_page from '../../images/community-page.png'
import './CreateCommunity.css'
import IconButton from '@material-ui/core/IconButton';
import RemoveIcon from '@material-ui/icons/Remove';
import AddIcon from '@material-ui/icons/Add';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { Row, Col, CardTitle } from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BACKEND_URL } from '../../config/config';
import { BACKEND_PORT } from '../../config/config';
import createCommunityAction from '../../actions/community/createCommunityAction';
import { connect } from "react-redux";
import getByIDCommunityAction from '../../actions/community/getCommunityByID';
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';
import Navbar from "../navbar/navbar";
import { Link } from 'react-router-dom';
import cookie from "react-cookies";
class CreateCommunity extends Component {
    constructor(props) {
        super(props)
        this.state = {
            communityAvatar: [],
            communityCover: "",
            updateCommunityAvatar: [],
            updateCommunityCover: "",
            updateCommunityAvatarFlag: false,
            updateCommunityCoverFlag: false,
            communityName: "",
            description: "",
            rules: [
                {
                    id: uuidv4(),
                    title: "",
                    description: ""
                }
            ],
            error: false,
            title: "",
            buttonName: "",
            rulesTitle: ""
        }
    }
    componentDidMount() {
        document.title = "Create a Community"
    }
    handleRemoveFields = id => {
        const values = [...this.state.rules];
        values.splice(values.findIndex(value => value.id === id), 1);
        this.setState(
            {
                rules: values
            }
        )
    }
    handleOtherChange = inp => {
        {
            this.setState({
                [inp.target.name]: inp.target.value,
                error: false
            })
        }

    }
    handleChangeInput = (id, event) => {
        const newRules = this.state.rules.map(i => {
            console.log(id);

            if (id === i.id) {
                i[event.target.name] = event.target.value
            }
            return i;
        })
        this.setState(
            {
                rules: newRules
            }
        )
    }
    async componentDidMount() {
        console.log(this.props.match.params.id)
        if (this.props.match.params.id != null) {
            this.props.getByIDCommunityAction(this.props.match.params.id).then(response => {
                if (this.props.getCommunityData.data.rules.length == 0) {
                    this.setState(
                        {
                            communityName: this.props.getCommunityData.data.communityName,
                            description: this.props.getCommunityData.data.description,
                            title: "Edit a Community",
                            buttonName: "Update Community",
                            rules: [
                                {
                                    id: uuidv4(),
                                    title: "",
                                    description: ""
                                }
                            ],
                            communityCover: this.props.getCommunityData.data.communityCover,
                            communityAvatar: this.props.getCommunityData.data.communityAvatar,
                            communityAvatarLength: this.props.getCommunityData.data.communityAvatar.length,
                            rulesTitle: "Edit Rules"

                        }
                    )
                }
                else {
                    this.setState(
                        {
                            // rules : this.props.getCommunityData.rules
                            communityName: this.props.getCommunityData.data.communityName,
                            description: this.props.getCommunityData.data.description,
                            title: "Edit a Community",
                            buttonName: "Update Community",
                            rules: this.props.getCommunityData.data.rules,
                            communityCover: this.props.getCommunityData.data.communityCover,
                            communityAvatar: this.props.getCommunityData.data.communityAvatar,
                            communityAvatarLength: this.props.getCommunityData.data.communityAvatar.length,
                            rulesTitle: "Edit Rules"
                        }
                    )
                }
            })
        }
        else if (this.props.match.params.id == undefined) {
            this.setState({
                commmunityAvatar: [],
                communityCover: "",
                communityName: "",
                description: "",
                rules: [
                    {
                        id: uuidv4(),
                        title: "",
                        description: ""
                    }
                ],
                error: false,
                title: "Create a Community",
                buttonName: "Create Community",
                rulesTitle: "Add Rules"


            })
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        if (this.props.match.params.id == undefined) {
            if (this.state.communityName == "" || this.state.description == "") {
                this.setState({
                    error: true
                })
            }
            else {

                console.log(this.state)
                const formData = new FormData();
                const files = this.state.commmunityAvatar;
                for (let i = 0; i < files.length; i++) {
                    formData.append(`communityAvatar`, files[i])
                }
                formData.append(`communityCover`, this.state.communityCover)

                let obj = {
                    communityName: this.state.communityName,
                    description: this.state.description,
                    creator: cookie.load('userId'),
                    rules: this.state.rules,
                    members: [
                        {
                            _id: cookie.load('userId'),
                            communityJoinStatus: 'JOINED'
                        }
                    ]
                }
                formData.append("community", JSON.stringify(obj));
                this.props.createCommunityAction(formData).then(response => {
                    if (this.props.communityError) {
                        alert(this.props.message)
                    }
                    else {
                        alert("Community Created Successfully")
                    }


                })
            }

        }
        else {
            console.log(this.state)
            const formData = new FormData();

            if (this.state.updateCommunityCoverFlag && this.state.updateCommunityAvatarFlag) {
                alert("in both")
                const files = this.state.updateCommunityAvatar;
                for (let i = 0; i < files.length; i++) {
                    formData.append(`communityAvatar`, files[i])
                }
                formData.append(`communityCover`, this.state.updateCommunityCover)
            }
            else if (this.state.updateCommunityCoverFlag) {
                alert("in cover")

                formData.append(`communityCover`, this.state.updateCommunityCover)


            }
            else if (this.state.updateCommunityAvatarFlag) {
                alert("in avatar")

                const files = this.state.updateCommunityAvatar;
                for (let i = 0; i < files.length; i++) {
                    formData.append(`communityAvatar`, files[i])
                }
            }

            let obj = {
                communityName: this.state.communityName,
                description: this.state.description,
                creator: cookie.load('userId'),
                rules: this.state.rules,
                _id: this.props.match.params.id,
                members: [
                    {
                        _id: cookie.load('userId'),
                        communityJoinStatus: 'JOINED'
                    }
                ]
            }
            formData.append("community", JSON.stringify(obj));
            axios.defaults.headers.common["authorization"] = cookie.load('token')
            axios.defaults.withCredentials = true;
            return axios
                .post(BACKEND_URL + ":" + BACKEND_PORT + "/community/update", formData, {
                    headers: Object.assign(
                        { "content-type": "multipart/form-data" }
                    )
                }).then(response => {
                    if (response.status === 200) {
                        console.log(response.data)
                        alert("Community Update Succcessfully")
                        // dispatch(success(response, data));

                    }
                }).catch((err) => {
                    // dispatch(error(err, data))
                });

        }

    };
    fileSelectedHandler = (e) => {
        this.setState({ commmunityAvatar: [...this.state.commmunityAvatar, ...e.target.files] })
    }
    fileAvatarHandler = (e) => {
        this.setState({ communityCover: e.target.files[0] })
    }
    updateFileSelectedHandler = (e) => {
        this.setState({ updateCommunityAvatar: [...this.state.updateCommunityAvatar, ...e.target.files], updateCommunityAvatarFlag: true })
    }
    updateFileAvatarHandler = (e) => {
        this.setState({ updateCommunityCover: e.target.files[0], updateCommunityCoverFlag: true })
    }
    handleAddFields = () => {
        this.setState({ rules: [...this.state.rules, { id: uuidv4(), title: '', description: '' }] })
    }
    render() {
        console.log(this.state);
        let error = null;
        let fileDivision = null;
        let avatarImageDivision = this.state.communityAvatar.map((data, index) => (
            <div>

                <Slide index={index}>
                    <img src={data} style={{ position: "absolute" }} alt="" />

                </Slide>
            </div>
        ))
        if (this.props.match.params.id == null) {
            fileDivision = (
                <div>
                    <div className="row" style={{ marginLeft: "2%", marginTop: "5%" }}>
                        <div className="col-3">
                            <span><strong><div>Choose Multiple Images Files</div></strong></span>
                        </div>
                        <div className="col-3">
                            <span><strong><div>Choose Community Avatar</div></strong></span>
                        </div>
                    </div>

                    <div className="row" style={{ marginLeft: "2%" }}>
                        <input style={{ background: "none", border: "none" }} type="file" id="file" multiple name="file" data-show-upload="true" data-show-caption="true" onChange={this.fileSelectedHandler} />
                        <input style={{ background: "none", border: "none" }} type="file" id="file" name="file" data-show-upload="true" data-show-caption="true" onChange={this.fileAvatarHandler} />

                    </div>
                </div>
            )
        }
        else {
            fileDivision = (
                <div>
                    <div className="row" style={{ marginLeft: "2%", marginTop: "5%" }}>
                        <div className="col-3">
                            <span><strong><div>Present Images </div></strong></span>
                        </div>

                    </div>
                    <div className="row" style={{ marginLeft: "2%", marginTop: "5%" }}>
                        <div className="col-3">
                            <span><strong><div>Community Cover </div></strong></span>
                        </div>
                        <div className="col-3">
                            <span><strong><div>Community Avatar</div></strong></span>
                        </div>
                    </div>
                    <div className="row" style={{ marginLeft: "2%", marginTop: "5%" }}>
                        <div className="col-3" style={{ height: "100px", width: "100px" }}>
                            <img src={this.state.communityCover} style={{ position: "absolute" }} width="100%" height="100%" alt="" />
                        </div>
                        <div className="col-3" >
                            <div style={{ marginBottom: "5px" }}>
                                <CarouselProvider
                                    naturalSlideWidth={200}
                                    naturalSlideHeight={200}
                                    totalSlides={this.state.communityAvatar.length}
                                >
                                    <ButtonBack style={{ border: "none", backgroundColor: "white", fontSize: "40px", float: "left", marginTop: "30%" }}>&#60;</ButtonBack>
                                    <ButtonNext style={{ border: "none", backgroundColor: "white", float: "right", marginTop: "30%", fontSize: "40px", }}>&#62;</ButtonNext>
                                    <Slider>

                                        {avatarImageDivision}
                                    </Slider>

                                </CarouselProvider>
                            </div>
                        </div>
                        <div className="row" style={{ marginLeft: "2%" }}>

                            <input style={{ background: "none", border: "none" }} type="file" id="file" name="file" data-show-upload="true" data-show-caption="true" onChange={this.updateFileAvatarHandler} />
                            <input style={{ background: "none", border: "none" }} type="file" id="file" multiple name="file" data-show-upload="true" data-show-caption="true" onChange={this.updateFileSelectedHandler} />


                        </div>
                    </div>

                </div>
            )
        }
        if (this.state.error) {
            error = <div style={{ 'color': 'red' }}>*Please fill all the required fields</div>
        }
        return (
            <div>
                { !cookie.load('token') ? window.location.href = '/' : null}
                <div>
                    <Navbar />
                </div>
                <div className="row">
                    <div className="col-1">
                        <img src={community_page} style={{ position: "absolute" }} width="110%" maxHeight="160%" alt="" />
                    </div>
                    <div className="col-11">
                        <br></br><br></br><br></br><br></br>
                        <div className="row" style={{ marginLeft: "2%" }}>
                            <div className="col-5">
                                <span><strong><div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: "20px" }}>{this.state.title}</div></strong></span>
                                <hr />
                            </div>
                        </div>
                        <div className="row" style={{ marginLeft: "2%" }}>
                            <div className="col-5">
                                <span><strong><div className="required" style={{ fontSize: "16px" }}>Name</div></strong></span>

                            </div>
                        </div>
                        <div className="row" style={{ marginLeft: "2%" }}>
                            <textarea style={{ marginLeft: "1%" }} id="w3review" value={this.state.communityName} name="communityName" onChange={this.handleOtherChange} rows="2" cols="60">
                            </textarea>
                        </div>
                        <div className="row" style={{ marginLeft: "2%", marginTop: "5%" }}>
                            <div className="col-5">
                                <span><strong><div className="required">Description</div></strong></span>
                            </div>
                        </div>
                        <div className="row" style={{ marginLeft: "2%" }}>
                            <textarea style={{ marginLeft: "1%" }} id="w3review" name="description" value={this.state.description} onChange={this.handleOtherChange} rows="2" cols="60">
                            </textarea>
                        </div>
                        {fileDivision}
                        <div className="row" style={{ marginLeft: "2%", marginTop: "5%" }}>
                            <div className="row" >
                                <div className="col-8" style={{ marginLeft: "20%", marginTop: "5%" }}>
                                    <span ><strong><div> Rules</div></strong></span>
                                </div>
                            </div>
                            <div className="row" style={{ marginLeft: "2px", width: "120%" }}>
                                <div className="col-8">
                                    <form onSubmit={this.handleSubmit}>

                                        {this.state.rules.map((inputField, index) => (
                                            <div key={inputField.id}  >
                                                <input name="title" placeholder="Title" value={this.state.rules[index].title} onChange={event => this.handleChangeInput(this.state.rules[index].id, event)} />
                                                <input name="description" style={{ marginLeft: "2%" }} placeholder="Description" value={this.state.rules[index].description} onChange={event => this.handleChangeInput(this.state.rules[index].id, event)} />
                                                <IconButton disabled={this.state.rules.length === 1} onClick={() => this.handleRemoveFields(inputField.id)}>
                                                    <RemoveIcon />
                                                </IconButton>
                                                <IconButton
                                                    onClick={this.handleAddFields}
                                                >
                                                    <AddIcon />
                                                </IconButton>
                                            </div>
                                        ))}
                                        <div className="error">
                                            {error}
                                        </div>
                                        <button type="submit" className="btn btn-danger" style={{ backgroundColor: "#0079d3", border: "1px solid #0079d3", marginLeft: "40%", borderRadius: "60px", marginTop: "5%", cursor: "pointer" }} onSubmit={this.handleFormSubmit}>{this.state.buttonName}</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <ToastContainer />

                    </div>
                </div>
            </div>
        )

    }
}
const matchStateToProps = (state) => {
    return {
        communityData: state.createCommunityReducer.communityData,
        getCommunityData: state.getByIDCommunityReducer.getCommunityData,
        communityError: state.createCommunityReducer.error,
        message: state.createCommunityReducer.message,

    }

}
const matchDispatchToProps = (dispatch) => {
    return {
        createCommunityAction: (data) => dispatch(createCommunityAction(data)),
        getByIDCommunityAction: (data) => dispatch(getByIDCommunityAction(data)),

    }
}

export default connect(matchStateToProps, matchDispatchToProps)(CreateCommunity)