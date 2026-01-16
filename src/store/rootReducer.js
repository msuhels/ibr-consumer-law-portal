import {combineReducers} from "redux";
import taskReducer from "./setting/reducer";

const rootReducer = combineReducers({settings: taskReducer});

export default rootReducer