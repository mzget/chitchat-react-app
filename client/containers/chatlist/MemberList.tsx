import * as React from "react";
import { Flex, Box } from "reflexbox";

import { List, ListItem } from "material-ui/List";
import Divider from "material-ui/Divider";
import Subheader from "material-ui/Subheader";
import { grey400, darkBlack, lightBlack } from "material-ui/styles/colors";

import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import Avatar from "material-ui/Avatar";
import Toggle from "material-ui/Toggle";

import BadgeSimple from "../../components/BadgeSimple";

import { ChitChatAccount } from "../../../server/scripts/models/User";

interface IComponentProps {
    value: Array<ChitChatAccount>;
    rightIcon?: any;
    rightToggle?: boolean;
    onToggleItem?: (item: ChitChatAccount, checked: boolean) => void;
    onSelected?: (item: ChitChatAccount) => void;
}

const renderList = (props: IComponentProps) => props.value.map((item, i) =>
    <div key={i}>
        <ListItem
            onClick={(!!props.onSelected) ? () => props.onSelected(item) : () => { }}
            leftAvatar={(!!item.avatar) ?
                <Avatar src={item.avatar} /> : <Avatar>{item.username.charAt(0)}</Avatar>
            }
            rightIcon={(props.rightIcon) ? props.rightIcon : null}
            rightToggle={(props.rightToggle) ?
                <Toggle
                    onToggle={(event: object, isInputChecked: boolean) => {
                        props.onToggleItem(item, isInputChecked);
                    }}
                /> : null}
            primaryText={item.username}
            secondaryText={
                <p>
                    <span style={{ color: darkBlack }}>{item.email}</span>
                </p>
            }
        />
        <Divider inset={true} />
    </div>
);

export const MemberList = (props: IComponentProps) => (
    < MuiThemeProvider >
        <List>
            {(!!props.value) ? renderList(props) : null}
        </List>
    </ MuiThemeProvider >
);