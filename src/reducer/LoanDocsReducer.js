const LoanDocsReducer = (state = { loandocs:[], pageIndex:0, pageSize:10, totalCount:0, sortBy:[], filters:[], backToList:false }, action) => {
    switch(action.type){
        case "UPDATELOANDOCSLIST":
            return {
                ...state,
                ...action.payload
            };
        default:
        return state;
    }
}

export default LoanDocsReducer;