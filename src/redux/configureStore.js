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
var redux_1 = require("redux");
var redux_thunk_1 = require("redux-thunk");
var redux_observable_1 = require("redux-observable");
var rootReducer = require("./rootReducer");
var rootRxEpic = require("./rootRxEpic");
var epicMiddleware = redux_observable_1.createEpicMiddleware(rootRxEpic.rootEpic);
var middlewares = [redux_thunk_1["default"], epicMiddleware];
var createStoreWithMiddleware = null;
if (process.env.NODE_ENV === "development") {
    var logger = require("redux-logger").logger;
    middlewares.push(logger);
    var reduxDevtools = require("redux-devtools-extension");
    var composeWithDevTools = reduxDevtools.composeWithDevTools;
    createStoreWithMiddleware = composeWithDevTools(redux_1.applyMiddleware.apply(void 0, middlewares))(redux_1.createStore);
}
else {
    console.log = function () { };
    createStoreWithMiddleware = redux_1.applyMiddleware.apply(void 0, middlewares)(redux_1.createStore);
}
function configureStore() {
    var initialState = rootReducer.getInitialState();
    return createStoreWithMiddleware(rootReducer.rootReducer, initialState);
}
// !!! Note >>> Do not edit these 2 line below. I make it for call global store. @ Mzget.
var store = configureStore();
exports.__esModule = true;
exports["default"] = store;
