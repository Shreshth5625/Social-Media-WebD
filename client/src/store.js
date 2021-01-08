import { createStore, applyMiddleware} from 'redux'
import {composeWithDevTools} from 'redux-devtools-extension'
import thunk from 'redux-thunk'
import rootReducer from './reducers';   //from index.js

var initialState = {};

const middleware = [thunk]

var store = createStore(rootReducer, initialState, composeWithDevTools(applyMiddleware(...middleware)))

export default store;