let initialState = {
    communityData: {},
    error: false,
    message : ""
}
var createCommunityReducer = (state = initialState, action) => {
    console.log(action.payload)
    let newState = { ...state }
    switch (action.type) {
        case "create_community_success":
            newState.communityData = action.payload.response;
            newState.error = false;
            return newState;
        case "create_community_fail":
            newState.error = true;
            newState.message = action.payload.response.response.data.errorMessage;
            return newState;
        default:
            return newState;
    }
}

export default createCommunityReducer