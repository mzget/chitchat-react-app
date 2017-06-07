"use strict";
var React = require("react");
var react_router_dom_1 = require("react-router-dom");
var Home_1 = require("./Home");
var DialogBoxEnhancer_1 = require("./toolsbox/DialogBoxEnhancer");
var DialogBox_1 = require("../components/DialogBox");
exports.HomePageWithDialogBox = DialogBoxEnhancer_1.DialogBoxEnhancer(function (_a) {
    var title = _a.title, message = _a.message, open = _a.open, handleClose = _a.handleClose, onError = _a.onError, history = _a.history;
    return (<div>
        <Home_1.HomeWithState onError={onError} history={history}/>
        <DialogBox_1.DialogBox title={title} message={message} open={open} handleClose={handleClose}/>
    </div>);
});
exports.HomePageWithDialogBox = react_router_dom_1.withRouter(exports.HomePageWithDialogBox);
