import * as React from "react";
import { EditGroupMember } from "./EditGroupMember";
import { EditGroupMemberEnhancer, IEnhanceProps } from "./EditGroupMemberEnhancer";

import * as Colors from "material-ui/styles/colors";
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

const iconButtonElement = (
    <IconButton
        touch={true}
        tooltip="more"
    >
        <MoreVertIcon color={Colors.grey400} />
    </IconButton>
);

export const EditGroupMemberEnhanced = EditGroupMemberEnhancer(({ members, value, removeItem }) =>
    <EditGroupMember
        members={members}
        rightIconButton={(item) => (
            <IconMenu
                iconButtonElement={iconButtonElement}
                onChange={(e, itemValue) => {
                    console.log("handleChange", itemValue);
                    if (itemValue == "1") {
                        removeItem(item);
                    }
                }}
                value={value}
            >
                <MenuItem value="1">Delete</MenuItem>
                {/*<MenuItem value="2" primaryText="Refresh" />*/}
            </IconMenu>
        )} />
) as React.ComponentClass<{ members }>;