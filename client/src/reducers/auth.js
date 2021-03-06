import { REGISTER_SUCCESS, 
    REGISTER_FAIL, 
    USER_LOADED, 
    AUTH_ERROR, 
    LOGIN_FAIL, 
    LOGIN_SUCCESS,
    LOGOUT
} from '../actions/types'

const initialState = {
    // We will store token in local storage
    token: localStorage.getItem('token'),
    
    // By default value is null
    isAuthenticated: null,
    
    // To check request status
    loading: true,
    user: null
}


export default function (state = initialState, action){
    //Destructuring
    const { type, payload} = action;
    
    switch(type) {
        case USER_LOADED:
            return{
                ...state,
                isAuthenticated :true,
                loading: false,
                user: payload
            }
        case REGISTER_SUCCESS:
        case LOGIN_SUCCESS: 
            //To put the returned token in local storage
            localStorage.setItem('token', payload.token);
            return {
                ...state,
                ...payload,
                isAuthenticated: true,
                loading: false
            }
        case REGISTER_FAIL: 
        case AUTH_ERROR: 
        case LOGIN_FAIL:
        case LOGOUT: 
            localStorage.removeItem('token');
            return {
                ...state,
                token: null,
                isAuthenticated: false,
                loading: false
            }
        default: 
            return state;
    }   
}