let initialState = {
    communityData: {},
    error: false,
    message: "",
  };
  let getCommunityModCommunityListReducer = (state = initialState, action) => {
    console.log(action.payload);
    let newState = { ...state };
    switch (action.type) {
      case "get_community_mod_community_success":
        newState.communityData = action.payload.response.data;
        newState.error = false;
        return newState;
      case "get_community_mod_community_failed":
        newState.error = true;
        newState.message = "Error while getting communities";
        return newState;
      default:
        return newState;
    }
  };
  
  export default getCommunityModCommunityListReducer;
  