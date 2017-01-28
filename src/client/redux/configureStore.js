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
const createLogger = require("redux-logger");
const react_router_redux_1 = require("react-router-redux");
const react_router_1 = require("react-router");
const rootReducer = require("./rootReducer");
const rootRxEpic = require("./rootRxEpic");
const epicMiddleware = redux_observable_1.createEpicMiddleware(rootRxEpic.rootEpic);
const routingMiddleware = react_router_redux_1.routerMiddleware(react_router_1.browserHistory);
const middlewares = [redux_thunk_1.default, epicMiddleware, routingMiddleware];
if (process.env.NODE_ENV === `development`) {
    const logger = createLogger();
    middlewares.push(logger);
}
/**
 * ## creatStoreWithMiddleware
 * Like the name...
 */
// const createStoreWithMiddleware = applyMiddleware(...middlewares)(createStore)(RootReducer.rootReducer, RootReducer.getInitialState());
const createStoreWithMiddleware = redux_1.applyMiddleware(...middlewares)(redux_1.createStore);
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
}
;
//!!! Note >>> Do not edit these 2 line below. I make it for call global store. @ Mzget.
const store = configureStore();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = store;
