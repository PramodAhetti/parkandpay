const postReducer=(state=[],action)=>{
    switch(action.type){
        case 'SETPOSTS':
            return action.payload;
        default:
            return state;
        
    }
}
export default postReducer;