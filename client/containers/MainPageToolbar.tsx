import * as React from "react";
import * as authRx from "../redux/authen/authRx";
import { SimpleToolbar } from "../components/SimpleToolbar";
import { ToolbarEnhancer } from "./toolsbox/ToolbarEnhancer";
import { ProfileEnhanced } from "./profile/ProfileBox";


const menus = ["menu", "log out"];
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
}

export const WebToolbarEnhanced = ToolbarEnhancer(({ teamReducer, authReducer, onPressTitle, onMenuSelect, listener, history }: any) =>
    <SimpleToolbar
        title={(teamReducer.team) ? teamReducer.team.name.toUpperCase() : ""}
        onPressTitle={onPressTitle}
        menus={menus}
        onSelectedMenuItem={onMenuSelect}
        groupItem={<ProfileEnhanced />} />
);

export const MobileToolbarEnhanced = ToolbarEnhancer(({ teamReducer, authReducer, onMenuSelect, listener, history }: any) =>
    <SimpleToolbar
        title={(teamReducer.team) ? teamReducer.team.name.toUpperCase() : ""}
        menus={menus}
        onSelectedMenuItem={onMenuSelect} />
);