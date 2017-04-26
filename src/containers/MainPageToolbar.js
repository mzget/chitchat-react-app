"use strict";
const React = require("react");
const authRx = require("../redux/authen/authRx");
const SimpleToolbar_1 = require("../components/SimpleToolbar");
const ToolbarEnhancer_1 = require("./toolsbox/ToolbarEnhancer");
const ProfileBox_1 = require("./profile/ProfileBox");
const menus = ["menu", "log out"];
function listener(props, id, value) {
    console.log(menus[id]);
    let { authReducer } = props;
    switch (id) {
        case 0:
            props.history.push(`/admin/${authReducer.user}`);
            break;
        case 1:
            props.dispatch(authRx.logout(props.authReducer.token));
            break;
        default:
            break;
    }
}
exports.listener = listener;
exports.WebToolbarEnhanced = ToolbarEnhancer_1.ToolbarEnhancer(({ teamReducer, authReducer, onMenuSelect, listener, history }) => React.createElement(SimpleToolbar_1.SimpleToolbar, { title: (teamReducer.team) ? teamReducer.team.name : "", menus: menus, onSelectedMenuItem: onMenuSelect, groupItem: React.createElement(ProfileBox_1.ProfileEnhanced, null) }));
exports.MobileToolbarEnhanced = ToolbarEnhancer_1.ToolbarEnhancer(({ teamReducer, authReducer, onMenuSelect, listener, history }) => React.createElement(SimpleToolbar_1.SimpleToolbar, { title: (teamReducer.team) ? teamReducer.team.name : "", menus: menus, onSelectedMenuItem: onMenuSelect }));
