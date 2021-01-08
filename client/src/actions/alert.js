// import uuid from 'uuid' 
import {v1 as uuid} from "uuid"; 
import { SET_ALERT, REMOVE_ALERT } from './types'

//Able to do this because of thunk middleware
export const setAlert = (msg, alertType, timeout = 5000) => dispatch => {
    const id = uuid();
    dispatch ({
        type: SET_ALERT,
        payload: { msg, alertType, id }
    })

    setTimeout( () => dispatch( {type : REMOVE_ALERT, payload : id}), timeout)
}