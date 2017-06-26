import * as React from "react";

import { List, ListItem } from "material-ui/List";
import Divider from "material-ui/Divider";
import { grey400, darkBlack, lightBlack } from "material-ui/styles/colors";

import { TeamRole } from "../chitchat/chats/models/UserRole";

interface IComponentProps {
    items: Array<TeamRole>;
    onSelected?: (item: TeamRole) => void;
}

const renderList = (props: IComponentProps) => (
    props.items.map((item, i) => (
        <div key={i}>
            <ListItem
                leftIcon={null}
                rightIcon={null}
                primaryText={item.name}
                onClick={(event) => props.onSelected(item)}
            />
            <Divider />
        </div>))
);

export const TeamRoleListItem = (props: IComponentProps) => (
    <div>
        <List>
            {(!!props.items) ? renderList(props) : null}
        </List>
    </div>
);