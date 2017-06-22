import * as React from "react";

import { List, ListItem } from "material-ui/List";
import Divider from "material-ui/Divider";
import { grey400, darkBlack, lightBlack } from "material-ui/styles/colors";

import { Room } from "../../chitchat/chats/models/Room";

interface IComponentProps {
    items: Array<Room>;
    onSelected?: (item: Room) => void;
}

const renderList = (props: IComponentProps) => (
    props.items.map((item, i) => (
        <div key={i}>
            <ListItem
                leftIcon={null}
                rightIcon={null}
                primaryText={item.name}
                secondaryText={
                    <p style={{ color: darkBlack }}>{item.description}</p>
                }
                onClick={(event) => props.onSelected(item)}
            />
            <Divider />
        </div>))
);

export const GroupListView = (props: IComponentProps) => (
    <div>
        <List>
            {(!!props.items) ? renderList(props) : null}
        </List>
    </div>
);