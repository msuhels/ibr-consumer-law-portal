import {GET_APP_BRANDING} from "./actionTypes";

const initialState = {
    appDetails:null,
}

const taskReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_APP_BRANDING:
            return {...state, appDetails: action.payload};        
        default:
            return state;
    }
};

export default taskReducer;