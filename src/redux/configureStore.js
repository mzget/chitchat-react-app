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
"use strict";
/**
 * ## Imports
 *
 * redux functions
 */
const redux_1 = require("redux");
const redux_thunk_1 = require("redux-thunk");
const redux_observable_1 = require("redux-observable");
const rootReducer = require("./rootReducer");
const rootRxEpic = require("./rootRxEpic");
const epicMiddleware = redux_observable_1.createEpicMiddleware(rootRxEpic.rootEpic);
let middlewares = [redux_thunk_1.default, epicMiddleware];
let createStoreWithMiddleware = null;
if (process.env.NODE_ENV === `development`) {
    //    const { logger } = require(`redux-logger`);
    //    middlewares.push(logger);
    const reduxDevtools = require("redux-devtools-extension");
    const { composeWithDevTools } = reduxDevtools;
    createStoreWithMiddleware = composeWithDevTools(redux_1.applyMiddleware(...middlewares))(redux_1.createStore);
}
else {
    console.log = function () { };
    createStoreWithMiddleware = redux_1.applyMiddleware(...middlewares)(redux_1.createStore);
}
function configureStore() {
    let initialState = rootReducer.getInitialState();
    return createStoreWithMiddleware(rootReducer.rootReducer, initialState);
}
// !!! Note >>> Do not edit these 2 line below. I make it for call global store. @ Mzget.
const store = configureStore();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = store;
