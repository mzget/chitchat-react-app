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
import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import { createEpicMiddleware } from "redux-observable";
import { browserHistory } from "react-router";

import * as rootReducer from "./rootReducer";
import * as rootRxEpic from "./rootRxEpic";
const epicMiddleware = createEpicMiddleware(rootRxEpic.rootEpic);

let middlewares = [thunk, epicMiddleware] as Array<any>;

// const createStoreWithMiddleware = applyMiddleware(...middlewares)(createStore)(RootReducer.rootReducer, RootReducer.getInitialState());
const createStoreWithMiddleware = composeWithDevTools(applyMiddleware(...middlewares))(createStore);

function configureStore() {
    let initialState = rootReducer.getInitialState();
    return createStoreWithMiddleware(rootReducer.rootReducer, initialState);
};

// !!! Note >>> Do not edit these 2 line below. I make it for call global store. @ Mzget.
const store = configureStore();
export default store;
