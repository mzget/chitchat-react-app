import * as React from "react";
import { Flex, Box } from "reflexbox";

import { List, ListItem } from "material-ui/List";
import Divider from "material-ui/Divider";
import Subheader from "material-ui/Subheader";
import { grey400, darkBlack, lightBlack } from "material-ui/styles/colors";

import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import Avatar from "material-ui/Avatar";

import BadgeSimple from "../../components/BadgeSimple";

import { Room, RoomStatus, RoomType } from "../../chitchat/shared/Room";

interface IComponentProps {
    values: Array<Room>;
    onSelected: (item: Room) => void;
}

const renderList = (props: IComponentProps) => (props.values.map((item, i) => {
    return (
        <div key={i}>
            <ListItem
                onClick={() => props.onSelected(item)}
                leftAvatar={(!!item.image) ?
                    <Avatar src={item.image} /> : <Avatar>{item.name.charAt(0)}</Avatar>
                }
                rightIcon={null}
                primaryText={item.name}
                secondaryText={
                    <p>
                        <span style={{ color: darkBlack }}>{item.description}</span>
                    </p>
                }
            />
            <Divider inset={true} />
        </div>);
})
);

export const GroupList = (props: IComponentProps) => (
    < MuiThemeProvider >
        <List>
            {(!!props.values) ? renderList(props) : null}
        </List>
    </ MuiThemeProvider >
);