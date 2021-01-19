import axios from 'axios'
import { SET_ALERT } from './alert'

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