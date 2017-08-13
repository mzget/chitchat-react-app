import * as React from "react";
import { SimpleToolbar } from "../components/SimpleToolbar";
import { ToolbarEnhancer } from "./toolsbox/ToolbarEnhancer";
import { ProfileEnhanced } from "./profile/ProfileBox";

import * as authRx from "../redux/authen/authRx";

export function listener(props, id, value) {
    let { authReducer } = props;
    switch (id) {
        case 0:
            props.history.push(`/admin`);
            break;
        case 1:
            props.dispatch(authRx.logout(props.authReducer.token));
            break;
        default:
            break;
    }
};

export const WebToolbarEnhanced = ToolbarEnhancer((
    { teamname, onPressTitle, onMenuSelect, menus, listener, history }: any) =>
    <SimpleToolbar
        title={(teamname) ? teamname.toUpperCase() : ""}
        onPressTitle={onPressTitle}
        menus={menus}
        onSelectedMenuItem={onMenuSelect}
        groupItem={<ProfileEnhanced />} />
);

export const MobileToolbarEnhanced = ToolbarEnhancer((
    { teamname, onMenuSelect, menus, listener, history }: any) =>
    <SimpleToolbar
        title={(teamname) ? teamname.toUpperCase() : ""}
        menus={menus}
        onSelectedMenuItem={onMenuSelect} />
);