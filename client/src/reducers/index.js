import postReducer from "./all_posts";
import islogged from "./islogged"
import userstate from "./user"
import {combineReducers} from 'redux';
const allreducers=combineReducers({
    posts:postReducer,
    islogged:islogged,
    user:userstate
})

export default allreducers;