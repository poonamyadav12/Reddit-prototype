let initialState = {
    communityData: {},
    error: false,
    message : ""
}
let myCommunitiesReducer = (state = initialState, action) => {
    console.log(action.payload)
    let newState = { ...state }
    switch (action.type) {
        case "my_communities_success":
            newState.communityData = action.payload.response;
            newState.error = false;
            return newState;
        case "my_communities_failed":
            newState.error = true;
            newState.message = "Error while getting communities"
            return newState;
        default:
            return newState;
    }
}

export default myCommunitiesReducer;