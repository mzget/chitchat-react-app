/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * This is pure function for redux app.
 *
 * # configureStore.js
 * 
 * A Redux boilerplate setup
 * 
 */

/**
 * ## Imports
 * 
 * redux functions
 */
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';

import thunk from 'redux-thunk';
import { createEpicMiddleware } from 'redux-observable';
import * as createLogger from 'redux-logger';
import { routerMiddleware } from "react-router-redux";
import { browserHistory } from "react-router";

import * as rootReducer from "./rootReducer";
import * as rootRxEpic from './rootRxEpic';
const epicMiddleware = createEpicMiddleware(rootRxEpic.rootEpic);
const routingMiddleware = routerMiddleware(browserHistory);

const middlewares = [thunk, epicMiddleware, routingMiddleware];

if (process.env.NODE_ENV === `development`) {
    const logger = createLogger();
    middlewares.push(logger);
}

/**
 * ## creatStoreWithMiddleware
 * Like the name...
 */
// const createStoreWithMiddleware = applyMiddleware(...middlewares)(createStore)(RootReducer.rootReducer, RootReducer.getInitialState());
const createStoreWithMiddleware = applyMiddleware(...middlewares)(createStore);

/**
 * ## configureStore
 * @param {Object} the state with for keys:
 * device, global, auth, profile
 */
// const configureStore = () => {
// return createStore(RootReducer.rootReducer, RootReducer.getInitialState(), applyMiddleware(...middlewares));
//    const store:Redux.Store = compose(applyMiddleware(ReduxThunk))(createStore)(RootReducer.rootReducer, RootReducer.getInitialState());
//    return store;
// };
function configureStore() {
    let initialState = rootReducer.getInitialState();
    return createStoreWithMiddleware(rootReducer.rootReducer, initialState);
};

//!!! Note >>> Do not edit these 2 line below. I make it for call global store. @ Mzget.
const store = configureStore();
export default store;
