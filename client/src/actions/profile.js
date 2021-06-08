import axios from 'axios'
import { setAlert } from './alert'

import {
    GET_PROFILE,
    PROFILE_ERROR
} from './types'

//Get current user's profile
export const getCurrentProfile = () => async dispatch => {
    try {
        //Since we get the token from profile route in backend
        const res = await axios.get('/api/profile/me')

        dispatch({
            type: GET_PROFILE,
            payload: res.data
        })
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        })
    }
}

//Create or update a profile
export const createProfile = (FormData, history, edit = false) => async dispatch => {
    try {
        const config = {
            headers : {
                'Content-Type' : 'application/json'
            }
        }

        //Making a request 
        const res = await axios.post('/api/profile', FormData, config); 

        dispatch({
            type: GET_PROFILE,
            payload: res.data
        });

        //Alert, displaying message according to operation done
        dispatch(setAlert(edit ? 'Profile Updated': 'Profile Updated', 'success'));

        // If creating a profile, then redirect
        if(!edit) {
            history.push('/dashboard');
        }

    } catch (err) {
        const errors = err.response.data.errors;
        if(errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')))
        }
        
        dispatch({
            type: PROFILE_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        })
    }
}