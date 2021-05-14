// Created by Priyansh Patel
let initialState = {
    bulkDeleteRes: {},
    error: "",
    message: "",
  };
  let bulkCommunityUserRemoveReducer = (state = initialState, action) => {
    console.log(action);
    let newState = { ...state };
    switch (action.type) {
      case "bulk_community_user_remove_success":
        newState.bulkDeleteRes = action.payload.response.data;
        newState.error = false;
        newState.message = "Users Removed successfully";
        return newState;
      case "bulk_community_user_remove_failed":
        newState.error = true;
        newState.message = "Users remove failed";
        return newState;
      default:
        return newState;
    }
  };
  
  export default bulkCommunityUserRemoveReducer;
  