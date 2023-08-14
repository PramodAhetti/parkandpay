
const user_reducer=(state={name:undefined,token:undefined,user_id:undefined},action)=>{
    switch(action.type){
        case 'NEW':
            state=action.payload;
            return state;
        case 'LOGIN':
            state=action.payload;
            return state;
        default:
            return state;
        }
}

export default user_reducer;