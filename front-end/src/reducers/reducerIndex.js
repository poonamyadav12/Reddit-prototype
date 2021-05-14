import { combineReducers } from 'redux';
import loginReducer from './userReducers/loginReducer';
import SignUpReducer from './userReducers/signupReducer';
import userUpdateReducer from './userReducers/userUpdateReducer';
import userGetByIDReducer from './userReducers/getByIDReducer';
import createCommunityReducer from './communityReducers/createCommunityReducer';
import createPostReducer from './postReducers/createPostReducer';
import myCommunitiesReducer from './communityReducers/myCommunitiesReducer';
import getByIDCommunityReducer from './communityReducers/getByIDCommunityReducer';
import getPostByIDReducer from './postReducers/getPostByIDReducer';
import createCommentReducer from './commentReducer/createCommentReducer';
import getMyCommunityModReducer from './communityReducers/getMyCommunityModReducer';
import getMyCommunityModUserReqReducer from './communityReducers/getCommunityModUserReqReducer';
import bulkRequestAcceptReducer from './communityReducers/bulkRequestAcceptReducer';
import getMyCommunityModMemReducer from './communityReducers/getCommunityModMemReducer';
import upvotePostReducer from './postReducers/upVotePostReducer';
import downVotePostReducer from './postReducers/downVotePostReducer';
import upvoteCommentReducer from './commentReducer/upvoteCommentReducer';
import downVoteCommentReducer from './commentReducer/downVoteCommentReducer';
import getAllCommunityReducer from './communityReducers/getAllCommunityReducer';
import upVoteCommunityReducer from './communityReducers/upVoteCommunityReducer';
import downVoteCommunityReducer from './communityReducers/downVoteCommunityReducer';
import chatReducer from './chatReducer/chatReducer';
import communityJoinReducer from './communityReducers/communityJoinReducer';
import getDashboardReducer from './userReducers/getDashboardReducer';
import userProfileGetReducer from './userReducers/getUserProfileByIDReducer';
import getCommunityModCommunityListReducer from './communityReducers/getCommunityModCommunityListReducer';
import bulkCommunityUserRemoveReducer from './communityReducers/bulkCommunityUserRemoveReducer';


var rootReducer = combineReducers({
    SignUpReducer: SignUpReducer,
    loginReducer: loginReducer,
    userUpdateReducer: userUpdateReducer,
    userGetByIDReducer: userGetByIDReducer,
    createCommunityReducer: createCommunityReducer,
    createPostReducer: createPostReducer,
    myCommunitiesReducer: myCommunitiesReducer,
    getByIDCommunityReducer: getByIDCommunityReducer,
    getPostByIDReducer: getPostByIDReducer,
    createCommentReducer: createCommentReducer,
    getMyCommunityModReducer: getMyCommunityModReducer,
    getMyCommunityModUserReqReducer: getMyCommunityModUserReqReducer,
    bulkRequestAcceptReducer: bulkRequestAcceptReducer,
    getMyCommunityModMemReducer: getMyCommunityModMemReducer,
    upvotePostReducer: upvotePostReducer,
    downVotePostReducer: downVotePostReducer,
    downVoteCommentReducer: downVoteCommentReducer,
    upvoteCommentReducer: upvoteCommentReducer,
    getAllCommunityReducer: getAllCommunityReducer,
    upVoteCommunityReducer: upVoteCommunityReducer,
    downVoteCommunityReducer: downVoteCommunityReducer,
    chatReducer: chatReducer,
    communityJoinReducer: communityJoinReducer,
    getDashboardReducer: getDashboardReducer,
    userProfileGetReducer: userProfileGetReducer,
    getCommunityModCommunityListReducer: getCommunityModCommunityListReducer,
    bulkCommunityUserRemoveReducer: bulkCommunityUserRemoveReducer,

})


export default rootReducer