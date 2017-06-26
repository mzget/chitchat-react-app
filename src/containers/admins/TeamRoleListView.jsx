import * as React from "react";
import { List, ListItem } from "material-ui/List";
import Divider from "material-ui/Divider";
import Subheader from "material-ui/Subheader";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
const renderList = (props) => (props.items.map((item, i) => {
    return (<div key={i}>
            <ListItem onClick={() => props.onSelected(item)} rightIcon={null} primaryText={item}/>
            <Divider inset={true}/>
        </div>);
}));
export const TeamRoleList = (props) => (<MuiThemeProvider>
        <Subheader>Team roles.</Subheader>
        <List>
            {(!!props.items) ? renderList(props) : null}
        </List>
    </MuiThemeProvider>);
