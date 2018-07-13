import * as React from "react";

import { List, ListItem } from "material-ui/List";
import Divider from "material-ui/Divider";
import Subheader from "material-ui/Subheader";
import { grey400, darkBlack, lightBlack } from "material-ui/styles/colors";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";

interface IComponentProps {
    items: Array<string>;
    onSelected: (item: string) => void;
}

const renderList = (props: IComponentProps) => (props.items.map((item, i) => {
    return (
        <div key={i}>
            <ListItem
                onClick={() => props.onSelected(item)}
                rightIcon={null}
                primaryText={item}
            />
            <Divider inset={true} />
        </div>);
})
);

export const TeamRoleList = (props: IComponentProps) => (
    < MuiThemeProvider >
        <Subheader>Team roles.</Subheader>
        <List>
            {(!!props.items) ? renderList(props) : null}
        </List>
    </ MuiThemeProvider >
);