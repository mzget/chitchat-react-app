"use strict";
exports.__esModule = true;
var React = require("react");
var authRx = require("../redux/authen/authRx");
var SimpleToolbar_1 = require("../components/SimpleToolbar");
var ToolbarEnhancer_1 = require("./toolsbox/ToolbarEnhancer");
var ProfileBox_1 = require("./profile/ProfileBox");
var menus = ["menu", "log out"];
function listener(props, id, value) {
    console.log(menus[id]);
    var authReducer = props.authReducer;
    switch (id) {
        case 0:
            props.history.push("/admin/" + authReducer.user);
            break;
        case 1:
            props.dispatch(authRx.logout(props.authReducer.token));
            break;
        default:
            break;
    }
}
exports.listener = listener;
exports.WebToolbarEnhanced = ToolbarEnhancer_1.ToolbarEnhancer(function (_a) {
    var teamReducer = _a.teamReducer, authReducer = _a.authReducer, onPressTitle = _a.onPressTitle, onMenuSelect = _a.onMenuSelect, listener = _a.listener, history = _a.history;
    return React.createElement(SimpleToolbar_1.SimpleToolbar, { title: (teamReducer.team) ? teamReducer.team.name : "", onPressTitle: onPressTitle, menus: menus, onSelectedMenuItem: onMenuSelect, groupItem: React.createElement(ProfileBox_1.ProfileEnhanced, null) });
});
exports.MobileToolbarEnhanced = ToolbarEnhancer_1.ToolbarEnhancer(function (_a) {
    var teamReducer = _a.teamReducer, authReducer = _a.authReducer, onMenuSelect = _a.onMenuSelect, listener = _a.listener, history = _a.history;
    return React.createElement(SimpleToolbar_1.SimpleToolbar, { title: (teamReducer.team) ? teamReducer.team.name : "", menus: menus, onSelectedMenuItem: onMenuSelect });
});
