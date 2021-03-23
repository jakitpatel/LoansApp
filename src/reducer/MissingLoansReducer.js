const MissingLoansReducer = (state = { missingloans:[], pageIndex:0, pageSize:10, totalCount:0, sortBy:[], filters:[], backToList:false }, action) => {
    switch(action.type){
        case "UPDATEMISSINGLOANLIST":
            return {
                ...state,
                ...action.payload
            };
        default:
        return state;
    }
}

export default MissingLoansReducer;