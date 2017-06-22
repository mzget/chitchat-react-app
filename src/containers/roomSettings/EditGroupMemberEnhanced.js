import * as React from "react";
import { EditGroupMember } from "./EditGroupMember";
import { EditGroupMemberEnhancer } from "./EditGroupMemberEnhancer";
import * as Colors from "material-ui/styles/colors";
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
const iconButtonElement = (React.createElement(IconButton, { touch: true, tooltip: "more" },
    React.createElement(MoreVertIcon, { color: Colors.grey400 })));
export const EditGroupMemberEnhanced = EditGroupMemberEnhancer(({ members, room_id, value, removeItem }) => React.createElement(EditGroupMember, { members: members, rightIconButton: (item) => (React.createElement(IconMenu, { iconButtonElement: iconButtonElement, onChange: (e, itemValue) => {
            if (itemValue == "1") {
                removeItem(item);
            }
        }, value: value },
        React.createElement(MenuItem, { value: "1" }, "Delete"))) }));
