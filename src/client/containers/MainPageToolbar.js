import * as React from "react";
import * as authRx from "../redux/authen/authRx";
import { SimpleToolbar } from "../components/SimpleToolbar";
import { ToolbarEnhancer } from "./toolsbox/ToolbarEnhancer";
import { ProfileEnhanced } from "./profile/ProfileBox";
const menus = ["menu", "log out"];
export function listener(props, id, value) {
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
export const WebToolbarEnhanced = ToolbarEnhancer(({ teamReducer, authReducer, onPressTitle, onMenuSelect, listener, history }) => React.createElement(SimpleToolbar, { title: (teamReducer.team) ? teamReducer.team.name : "", onPressTitle: onPressTitle, menus: menus, onSelectedMenuItem: onMenuSelect, groupItem: React.createElement(ProfileEnhanced, null) }));
export const MobileToolbarEnhanced = ToolbarEnhancer(({ teamReducer, authReducer, onMenuSelect, listener, history }) => React.createElement(SimpleToolbar, { title: (teamReducer.team) ? teamReducer.team.name : "", menus: menus, onSelectedMenuItem: onMenuSelect }));
