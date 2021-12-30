const ForgivnessReducer = (state = { forgivnesslist:[], pageIndex:0, pageSize:10, totalCount:0, sortBy:[], filters:[], backToList:false }, action) => {
    switch(action.type){
        case "UPDATEFORGIVNESSLIST":
            return {
                ...state,
                ...action.payload
            };
        default:
        return state;
    }
}

export default ForgivnessReducer;