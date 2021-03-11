const loansReducer = (state = { loans:[], pageIndex:0, pageSize:10, totalCount:0, sortBy:[], filters:[], backToList:false }, action) => {
    switch(action.type){
        case "UPDATELOANLIST":
            return {
                ...state,
                ...action.payload
            };
        case "SETWIRES":
            return {
                ...state,
                loans: [].concat(action.payload)//[...state.wires,action.payload],
            };
        default:
        return state;
    }
}

export default loansReducer;