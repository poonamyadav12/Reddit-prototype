let initialState = {
    getCommentData: {},
    error: "",
    message: ""
}
let createCommunity = (state = initialState, action) => {
    console.log(action);
    let newState = { ...state }
    switch (action.type) {
        case "create_comment_success":
            newState.getCommentData = action.payload.response.data;
            newState.error = false;
            newState.message = "Comment created successfully";
            return newState;
        case "create_comment_fail":
            newState.error = true;
            newState.message = "Comment creation fail"
            return newState;
        default:
            return newState;
    }
}

export default createCommunity