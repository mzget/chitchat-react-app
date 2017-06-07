"use strict";
var React = require("react");
var Profile_1 = require("./Profile");
var DialogBoxEnhancer_1 = require("./toolsbox/DialogBoxEnhancer");
var DialogBox_1 = require("../components/DialogBox");
exports.ProfilePageEnhanced = DialogBoxEnhancer_1.DialogBoxEnhancer(function (_a) {
    var title = _a.title, message = _a.message, open = _a.open, handleClose = _a.handleClose, onError = _a.onError, location = _a.location, history = _a.history;
    return (<div>
        <Profile_1.ProfilePage onError={onError} location={location} history={history}/>
        <DialogBox_1.DialogBox title={title} message={message} open={open} handleClose={handleClose}/>
    </div>);
});
