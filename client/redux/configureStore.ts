﻿/**
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
import thunk from "redux-thunk";
import { createEpicMiddleware } from "redux-observable";

import * as rootReducer from "./rootReducer";
import * as rootRxEpic from "./rootRxEpic";
const epicMiddleware = createEpicMiddleware(rootRxEpic.rootEpic);

let middlewares = [thunk, epicMiddleware, rootReducer.apolloMiddleWare] as Array<any>;

let createStoreWithMiddleware: any = null;

if (process.env.NODE_ENV === `development`) {
    // const { logger } = require(`redux-logger`);
    // middlewares.push(logger);

    const reduxDevtools = require("redux-devtools-extension");
    const { composeWithDevTools } = reduxDevtools;
    createStoreWithMiddleware = composeWithDevTools(applyMiddleware(...middlewares))(createStore);
}
else {
    console.log = function () { };
    console.warn = function () { };
    createStoreWithMiddleware = applyMiddleware(...middlewares)(createStore);
}

function configureStore() {
    let initialState = rootReducer.getInitialState();
    return createStoreWithMiddleware(rootReducer.rootReducer, initialState);
}

// !!! Note >>> Do not edit these 2 line below. I make it for call global store. @ Mzget.
const store = configureStore();
export default store;
