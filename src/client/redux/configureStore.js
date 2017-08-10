import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { createEpicMiddleware } from "redux-observable";
import * as rootReducer from "./rootReducer";
import * as rootRxEpic from "./rootRxEpic";
const epicMiddleware = createEpicMiddleware(rootRxEpic.rootEpic);
let middlewares = [thunk, epicMiddleware, rootReducer.apolloMiddleWare];
let createStoreWithMiddleware = null;
if (process.env.NODE_ENV === `development`) {
    const { logger } = require(`redux-logger`);
    middlewares.push(logger);
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
const store = configureStore();
export default store;
